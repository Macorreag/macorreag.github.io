#!/usr/bin/env node
/**
 * Diagnóstico: imprime el esquema y una página de muestra de las bases de Notion
 * Uso: solo en CI (requiere secrets)
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;

const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

async function describe(name, dbId) {
  if (!dbId) {
    console.log(`\n=== DB: ${name} — sin ID configurado ===`);
    return;
  }
  const schemaRes = await fetch(`https://api.notion.com/v1/databases/${dbId}`, { headers });
  if (!schemaRes.ok) {
    console.log(`\n=== DB: ${name} — error schema ${schemaRes.status} ${schemaRes.statusText} ===`);
    return;
  }
  const schema = await schemaRes.json();
  console.log(`\n=== DB: ${name} (${dbId}) ===`);
  console.log(`Title: ${schema.title?.[0]?.plain_text || schema.title || '(sin title)'}`);
  for (const [key, prop] of Object.entries(schema.properties)) {
    let extra = '';
    if (prop.type === 'select')
      extra = ` options=[${(prop.select.options || []).map(o => o.name).join(', ')}]`;
    if (prop.type === 'multi_select')
      extra = ` options=[${(prop.multi_select.options || []).map(o => o.name).join(', ')}]`;
    console.log(`  - "${key}"  [${prop.type}]${extra}`);
  }

  const q = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ page_size: 1 }),
  });
  if (!q.ok) return;
  const data = await q.json();
  const page = data.results[0];
  if (!page) {
    console.log('  (sin páginas)');
    return;
  }
  console.log('  Sample page properties:');
  for (const [key, prop] of Object.entries(page.properties)) {
    const val = JSON.stringify(prop);
    console.log(`    "${key}": ${val.length > 140 ? val.slice(0, 140) + '…' : val}`);
  }
}

(async () => {
  await describe('skills', process.env.NOTION_DATABASE_ID);
  await describe('experience', process.env.NOTION_EXPERIENCE_DATABASE_ID);
})().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
