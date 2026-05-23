import fs from 'fs';
import path from 'path';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import matter from 'gray-matter';

const API_KEY = process.env.DEEPL_API_KEY || '54b28140-514a-47c3-a828-0df7f40d8509:fx';
if (!API_KEY) {
  console.error('Missing DEEPL_API_KEY');
  process.exit(1);
}

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const BACKUP_DIR = path.join(POSTS_DIR, '_backup');

// Ensure backup dir exists
if (!existsSync(BACKUP_DIR)) {
  mkdirSync(BACKUP_DIR, { recursive: true });
}

// Collect all zh.mdx files
const slugs = readdirSync(POSTS_DIR).filter(f => {
  return fs.statSync(path.join(POSTS_DIR, f)).isDirectory();
});

async function translate(text) {
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      target_lang: 'ZH',
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.translations[0].text;
}

async function processFile(slug) {
  const zhPath = path.join(POSTS_DIR, slug, 'zh.mdx');
  if (!existsSync(zhPath)) return;

  const content = readFileSync(zhPath, 'utf-8');

  // Backup original
  const backupPath = path.join(BACKUP_DIR, `${slug}_zh.mdx`);
  writeFileSync(backupPath, content);

  // Parse frontmatter
  const parsed = matter(content);
  const data = parsed.data;
  const body = parsed.content;

  // Translate title and description
  const translatedTitle = await translate(data.title);
  const translatedDesc = await translate(data.description);

  // Translate body content
  const translatedBody = await translate(body);

  // Reconstruct frontmatter
  const newData = { ...data, title: translatedTitle, description: translatedDesc };
  let newContent = '---\n';
  for (const [key, val] of Object.entries(newData)) {
    newContent += `${key}: ${JSON.stringify(val)}\n`;
  }
  newContent += '---\n' + translatedBody;

  writeFileSync(zhPath, newContent, 'utf-8');
  console.log(`Translated: ${slug}`);
}

async function main() {
  for (const slug of slugs) {
    try {
      await processFile(slug);
    } catch (e) {
      console.error(`Failed ${slug}: ${e.message}`);
    }
  }
  console.log('Done');
}

main();