#!/usr/bin/env node
/**
 * Script de sincronización con Notion REST API - Base de datos de Experiencia
 * Auto-detecta el esquema real de la base y mapea las propiedades a campos internos.
 */

const fs = require('fs');
const path = require('path');
const { setStatus } = require('./sync-status');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DB_ID = process.env.NOTION_EXPERIENCE_DATABASE_ID;
const OUTPUT_PATH = path.join(__dirname, '../src/data/notion/experience.json');
const IS_CI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

const extractTitle = prop =>
  prop?.title?.map(t => t.plain_text).join('') ||
  prop?.rich_text?.map(t => t.plain_text).join('') ||
  '';
const extractRichText = arr => (arr || []).map(t => t.plain_text).join('') || '';
const extractSelect = prop => prop?.select?.name || prop?.status?.name || '';

function findProp(schema, candidates) {
  for (const c of candidates) {
    if (schema[c]) return c;
  }
  return null;
}

function buildMapping(schema) {
  const names = Object.keys(schema);
  const byType = {};
  for (const name of names) {
    const t = schema[name].type;
    (byType[t] = byType[t] || []).push(name);
  }

  const titleName =
    findProp(schema, ['Nombre', 'Cargo', 'Rol', 'Puesto', 'Title', 'Name']) ||
    byType.title?.[0] ||
    null;

  const dateNames = byType.date || [];
  const startName =
    findProp(schema, ['Fecha Inicio', 'Inicio', 'Start', 'Fecha inicio', 'Fecha de inicio']) ||
    dateNames.find(n => /inicio|start/i.test(n)) ||
    null;
  let endName =
    findProp(schema, ['Fecha Fin', 'Fin', 'End', 'Fecha fin', 'Fecha de fin']) ||
    dateNames.find(n => /fin|end/i.test(n)) ||
    null;
  if (dateNames.length === 1 && !startName) startName = dateNames[0];
  if (endName && endName === startName) endName = null;

  const richNames = byType.rich_text || [];
  const descName =
    findProp(schema, ['Descripción', 'Descripcion', 'Detalles', 'Description']) ||
    richNames.find(n => /desc|detail/i.test(n)) ||
    richNames[0] ||
    null;
  const companyName =
    findProp(schema, ['Compañía', 'Compania', 'Empresa', 'Company', 'Organización']) ||
    richNames.find(n => /empresa|compa|company|organiz/i.test(n)) ||
    richNames.find(n => n !== descName) ||
    null;

  const estadoName =
    findProp(schema, ['Estado', 'Estado Actual', 'Status']) ||
    byType.select?.[0] ||
    byType.status?.[0] ||
    null;

  const urlName = byType.url?.[0] || findProp(schema, ['URL', 'Link', 'Enlace']) || null;

  return { titleName, startName, endName, descName, companyName, estadoName, urlName };
}

function normalizeRecord(page, map) {
  const p = page.properties;
  return {
    id: page.id,
    nombre: map.titleName ? extractTitle(p[map.titleName]) : '',
    compania: map.companyName ? extractRichText(p[map.companyName]?.rich_text) : '',
    fechaInicio: map.startName ? p[map.startName]?.date?.start || null : null,
    fechaFin: map.endName ? p[map.endName]?.date?.start || null : null,
    descripcion: map.descName ? extractRichText(p[map.descName]?.rich_text) : '',
    estado: map.estadoName ? extractSelect(p[map.estadoName]) : null,
    url: map.urlName ? p[map.urlName]?.url || null : null,
  };
}

async function fetchNotionDatabase(startCursor = undefined, sortProp = null) {
  const body = { start_cursor: startCursor, page_size: 100 };
  if (sortProp) body.sorts = [{ property: sortProp, direction: 'descending' }];
  const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function syncNotionExperience() {
  if (!NOTION_API_KEY || !DB_ID) {
    if (IS_CI) {
      console.error(
        '❌ Error: NOTION_API_KEY o NOTION_EXPERIENCE_DATABASE_ID no configuradas en CI.\n' +
          '   La sincronización es obligatoria en producción para no desplegar datos placeholder.\n' +
          '   Configura los secrets en GitHub: Settings > Secrets and variables > Actions.',
      );
      process.exit(1);
    }
    console.log('⚠️  Variables NOTION_API_KEY o NOTION_EXPERIENCE_DATABASE_ID no configuradas.');
    console.log('   Usando datos placeholder para desarrollo local.');
    setStatus('experience', { source: 'placeholder', lastSyncedAt: null });
    return;
  }

  console.log('🔄 Sincronizando experiencia con Notion...');

  // 1. Obtener esquema real de la base de datos
  const schemaRes = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, { headers });
  if (!schemaRes.ok) {
    throw new Error(`Error obteniendo esquema: ${schemaRes.status} ${schemaRes.statusText}`);
  }
  const schema = await schemaRes.json();
  const map = buildMapping(schema.properties || {});
  console.log('  Schema detectado:');
  console.log(
    `    title      -> ${map.titleName ? `"${map.titleName}"` : '(ninguna propiedad title)'}`,
  );
  console.log(`    fechaInicio-> ${map.startName ? `"${map.startName}"` : '(no encontrada)'}`);
  console.log(`    fechaFin   -> ${map.endName ? `"${map.endName}"` : '(no encontrada)'}`);
  console.log(`    compania   -> ${map.companyName ? `"${map.companyName}"` : '(no encontrada)'}`);
  console.log(`    descripcion-> ${map.descName ? `"${map.descName}"` : '(no encontrada)'}`);
  console.log(`    estado     -> ${map.estadoName ? `"${map.estadoName}"` : '(no encontrada)'}`);
  console.log(`    url        -> ${map.urlName ? `"${map.urlName}"` : '(no encontrada)'}`);

  // 2. Consultar registros
  let allRecords = [];
  let hasMore = true;
  let cursor = undefined;

  while (hasMore) {
    const data = await fetchNotionDatabase(cursor, map.startName);
    const normalized = data.results.map(page => normalizeRecord(page, map));
    allRecords = allRecords.concat(normalized);
    hasMore = data.has_more;
    cursor = data.next_cursor;
  }

  if (allRecords.length > 0) {
    const sample = allRecords[0];
    console.log('  Registro de muestra:');
    console.log(
      `    ${JSON.stringify({
        nombre: sample.nombre,
        compania: sample.compania,
        fechaInicio: sample.fechaInicio,
        fechaFin: sample.fechaFin,
        descripcion: (sample.descripcion || '').slice(0, 60),
        estado: sample.estado,
      })}`,
    );
  }

  // 3. Guardar
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allRecords, null, 2));
  setStatus('experience', {
    source: 'notion',
    lastSyncedAt: new Date().toISOString(),
    count: allRecords.length,
  });
  console.log(`✅ Sincronizados ${allRecords.length} registros de experiencia en ${OUTPUT_PATH}`);
}

syncNotionExperience().catch(err => {
  console.error('❌ Error sincronizando experiencia con Notion:', err.message);
  process.exit(1);
});
