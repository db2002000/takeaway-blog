import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

const API_KEY = process.env.DEEPL_API_KEY;
if (!API_KEY) {
  console.error('Missing DEEPL_API_KEY env var');
  process.exit(1);
}
const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const BACKUP_DIR = path.join(POSTS_DIR, '_backup');

if (!existsSync(BACKUP_DIR)) {
  mkdirSync(BACKUP_DIR, { recursive: true });
}

const slugs = readdirSync(POSTS_DIR).filter(f => {
  return existsSync(path.join(POSTS_DIR, f, 'zh.mdx'));
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
      target_lang: 'ZH-HANT',
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

  const hantPath = path.join(POSTS_DIR, slug, 'zh-Hant.mdx');
  if (existsSync(hantPath)) {
    console.log(`Skip ${slug} (zh-Hant.mdx already exists)`);
    return;
  }

  const content = readFileSync(zhPath, 'utf-8');
  const parsed = matter(content);
  const data = parsed.data;
  const body = parsed.content;

  console.log(`Translating ${slug} title and description...`);
  const translatedTitle = await translate(data.title);
  const translatedDesc = await translate(data.description);

  console.log(`Translating ${slug} body...`);
  const translatedBody = await translate(body);

  const newData = { ...data, title: translatedTitle, description: translatedDesc };
  let newContent = '---\n';
  for (const [key, val] of Object.entries(newData)) {
    newContent += `${key}: ${JSON.stringify(val)}\n`;
  }
  newContent += '---\n' + translatedBody;

  writeFileSync(hantPath, newContent, 'utf-8');
  console.log(`Done: ${slug}`);
}

async function main() {
  for (const slug of slugs) {
    try {
      await processFile(slug);
    } catch (e) {
      console.error(`Failed ${slug}: ${e.message}`);
    }
  }
  console.log('All done');
}

main();
