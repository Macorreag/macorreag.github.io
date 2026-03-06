#!/usr/bin/env node
/**
 * Script de sincronización con Notion REST API - Base de datos de Experiencia
 * Consume la base de datos de Experiencia y genera un JSON para Gatsby
 */

const fs = require('fs');
const path = require('path');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_EXPERIENCE_DATABASE_ID = process.env.NOTION_EXPERIENCE_DATABASE_ID;
const OUTPUT_PATH = path.join(__dirname, '../src/data/notion/experience.json');

async function fetchNotionDatabase(startCursor = undefined) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_EXPERIENCE_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_cursor: startCursor,
        page_size: 100,
        sorts: [{ property: 'Fecha Inicio', direction: 'descending' }],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Extrae texto de propiedades de Notion
const extractTitle = (prop) => prop?.[0]?.plain_text || '';
const extractRichText = (arr) => arr?.map((t) => t.plain_text).join('') || '';

function normalizeRecord(page) {
  const p = page.properties;
  return {
    id: page.id,
    nombre: extractTitle(p['Nombre']?.title),
    compania: extractRichText(p['Compañía']?.rich_text),
    fechaInicio: p['Fecha Inicio']?.date?.start || null,
    fechaFin: p['Fecha Fin']?.date?.start || null,
    descripcion: extractRichText(p['Descripción']?.rich_text),
  };
}

async function syncNotionExperience() {
  if (!NOTION_API_KEY || !NOTION_EXPERIENCE_DATABASE_ID) {
    console.log('⚠️  Variables NOTION_API_KEY o NOTION_EXPERIENCE_DATABASE_ID no configuradas.');
    console.log('   Usando datos placeholder para desarrollo.');
    return;
  }

  console.log('🔄 Sincronizando experiencia con Notion...');

  let allRecords = [];
  let hasMore = true;
  let cursor = undefined;

  // Manejo de paginación
  while (hasMore) {
    const data = await fetchNotionDatabase(cursor);
    const normalized = data.results.map(normalizeRecord);
    allRecords = allRecords.concat(normalized);
    hasMore = data.has_more;
    cursor = data.next_cursor;
  }

  // Asegurar directorio existe
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allRecords, null, 2));
  console.log(`✅ Sincronizados ${allRecords.length} registros de experiencia en ${OUTPUT_PATH}`);
}

syncNotionExperience().catch((err) => {
  console.error('❌ Error sincronizando experiencia con Notion:', err.message);
  process.exit(1);
});
