import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, PostFrontmatter } from './types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getPostBySlug(slug: string, locale: 'zh' | 'en' | 'zh-Hant'): Post | null {
  // zh-Hant 读取 zh.mdx，简繁转换在渲染层处理
  const fileLocale = locale === 'zh-Hant' ? 'zh' : locale;
  const filePath = path.join(postsDirectory, slug, `${fileLocale}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    locale,
  };
}

export function getAllPosts(locale: 'zh' | 'en' | 'zh-Hant'): Post[] {
  const slugs = getPostSlugs();
  const posts: Post[] = [];

  for (const slug of slugs) {
    const post = getPostBySlug(slug, locale);
    if (post) {
      posts.push(post);
    }
  }

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function hasAlternateLocale(slug: string, currentLocale: 'zh' | 'en' | 'zh-Hant'): boolean {
  if (currentLocale === 'zh-Hant') {
    return fs.existsSync(path.join(postsDirectory, slug, 'en.mdx'));
  }
  if (currentLocale === 'en') {
    return fs.existsSync(path.join(postsDirectory, slug, 'zh-Hant.mdx')) ||
           fs.existsSync(path.join(postsDirectory, slug, 'zh.mdx'));
  }
  return fs.existsSync(path.join(postsDirectory, slug, 'en.mdx'));
}