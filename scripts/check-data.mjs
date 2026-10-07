// Checks every data file: required fields, valid tags, unique ids, no TODOs.
// Run with: npm run check   (or: node scripts/check-data.mjs node.js express.js  to check only some files)
import { readdirSync } from 'node:fs';

const REQUIRED = ['id', 'title', 'level', 'priority', 'frequency', 'summary', 'what', 'why', 'analogy', 'code', 'output', 'questions', 'answer30', 'mistakes', 'takeaway'];
const LEVELS = ['basic', 'intermediate', 'advanced'];
const PRIORITIES = ['must', 'good', 'rare'];
const FREQ = ['very common', 'common', 'occasional'];
const RESERVED = ['revise', 'rapid', 'cards']; // used by routes

let errors = 0;
const fail = (msg) => { errors++; console.error('  x ' + msg); };

const files = readdirSync(new URL('../src/data/', import.meta.url)).filter((f) => f !== 'index.js' && f.endsWith('.js'))
  .filter((f) => process.argv.length < 3 || process.argv.slice(2).includes(f));
for (const file of files) {
  const { default: stack } = await import(new URL('../src/data/' + file, import.meta.url));
  console.log(`${file}: ${stack.topics.length} topics, ${stack.rapidFire?.length ?? 0} rapid-fire`);
  const ids = new Set();
  for (const t of stack.topics) {
    const where = `${file} > ${t.id || t.title}`;
    for (const k of REQUIRED) if (t[k] == null || t[k] === '' || (Array.isArray(t[k]) && !t[k].length)) fail(`${where}: missing "${k}"`);
    if (!LEVELS.includes(t.level)) fail(`${where}: bad level "${t.level}"`);
    if (!PRIORITIES.includes(t.priority)) fail(`${where}: bad priority "${t.priority}"`);
    if (!FREQ.includes(t.frequency)) fail(`${where}: bad frequency "${t.frequency}"`);
    if (ids.has(t.id)) fail(`${where}: duplicate id`);
    if (RESERVED.includes(t.id)) fail(`${where}: id "${t.id}" is reserved`);
    ids.add(t.id);
    const codes = Array.isArray(t.code) ? t.code : [t.code];
    codes.forEach((c, i) => { if (!c?.source || !c?.lang) fail(`${where}: code[${i}] needs lang and source`); });
    (t.questions || []).forEach((q, i) => { if (!q.q || !q.a) fail(`${where}: question ${i + 1} incomplete`); });
    const s = JSON.stringify(t); if (/\bTODO\b|FIXME/.test(s) || /lorem ipsum/i.test(s)) fail(`${where}: contains a placeholder`);
  }
}
if (errors) { console.error(`\n${errors} problem(s) found.`); process.exit(1); }
console.log('\nAll data files look complete.');
