#!/usr/bin/env node
/**
 * Script de sincronización con Notion REST API
 * Consume una base de datos y genera un JSON para Gatsby
 */

const fs = require('fs');
const path = require('path');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const OUTPUT_PATH = path.join(__dirname, '../src/data/notion/skills.json');

async function fetchNotionDatabase(startCursor = undefined) {
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start_cursor: startCursor,
      page_size: 100,
      // Sin filtro - trae todos los registros
    }),
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Extrae texto de propiedades de Notion
const extractText = (prop) => prop?.[0]?.plain_text || '';
const extractRichText = (arr) => arr?.map(t => t.plain_text).join('') || '';
const extractMultiSelect = (arr) => arr?.map(s => s.name) || [];

function normalizeRecord(page) {
  const p = page.properties;
  const title = extractText(p['Habilidad Detallada']?.title);
  const skills = extractMultiSelect(p['Habilidad']?.multi_select);
  const experience = p['Experiencia']?.number || extractRichText(p['Experiencia']?.rich_text) || '';
  return {
    id: page.id,
    title,
    name: title,
    description: extractRichText(p['Descripción']?.rich_text),
    skills,
    tags: skills,
    experience,
    level: experience,
    date: p['Date']?.date?.start || null,
    version: p['Versión']?.number || null,
  };
}

async function syncNotion() {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.log('⚠️  Variables NOTION_API_KEY o NOTION_DATABASE_ID no configuradas.');
    console.log('   Usando datos placeholder para desarrollo.');
    return;
  }

  console.log('🔄 Sincronizando con Notion...');
  
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
  console.log(`✅ Sincronizados ${allRecords.length} registros en ${OUTPUT_PATH}`);
}

syncNotion().catch(err => {
  console.error('❌ Error sincronizando Notion:', err.message);
  process.exit(1);
});
