import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error('YOUTUBE_API_KEY not found in .env.local');
  process.exit(1);
}

const CHANNEL_HANDLE = '@dbdb3845';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

function apiRequest(path, params) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({ key: API_KEY, ...params }).toString();
    const url = `${BASE_URL}${path}?${query}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function getChannelId(handle) {
  const data = await apiRequest('/channels', {
    part: 'id',
    forHandle: handle
  });
  return data.items?.[0]?.id;
}

async function getChannelVideos(channelId) {
  const videos = [];
  let pageToken = null;

  do {
    const data = await apiRequest('/search', {
      part: 'snippet',
      channelId,
      maxResults: 50,
      order: 'date',
      type: 'video',
      pageToken: pageToken || undefined
    });

    if (data.items) {
      for (const item of data.items) {
        videos.push({
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnail: item.snippet.thumbnails?.high?.url ||
                     item.snippet.thumbnails?.medium?.url ||
                     item.snippet.thumbnails?.default?.url,
        });
      }
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return videos;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s一-鿿-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

function formatDate(iso) {
  return iso.substring(0, 10);
}

function generateFrontmatter(video) {
  const date = formatDate(video.publishedAt);
  const slug = slugify(video.title);

  const tags = extractTags(video.title, video.description);

  return `---
title: "${video.title}"
date: "${date}"
description: "${escapeDescription(video.description.substring(0, 200))}"
platforms:
  youtube: "https://youtube.com/watch?v=${video.videoId}"
---

# ${video.title}

${video.description || '（暂无描述）'}
`;
}

function extractTags(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const tagMap = {
    '个人成长': ['成长', '改变', '习惯', '拖延', '效率', '自律'],
    '心理': ['焦虑', '压力', '情绪', '心理', '大脑', '杏仁核', '皮质醇'],
    '社交': ['社交', '沟通', '人际关系', '朋友'],
    '工作': ['工作', '职场', '创业', '副业', '收入'],
  };

  const found = [];
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some(k => text.includes(k))) {
      found.push(tag);
    }
  }
  return found.slice(0, 3);
}

function escapeDescription(text) {
  return text.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

async function main() {
  console.log('Fetching channel ID for', CHANNEL_HANDLE);

  const channelId = await getChannelId(CHANNEL_HANDLE);
  if (!channelId) {
    console.error('Channel not found');
    process.exit(1);
  }
  console.log('Channel ID:', channelId);

  console.log('Fetching videos...');
  const videos = await getChannelVideos(channelId);
  console.log(`Found ${videos.length} videos`);

  const postsDir = path.join(process.cwd(), 'content', 'posts');

  for (const video of videos) {
    const slug = slugify(video.title);
    const postDir = path.join(postsDir, slug);

    if (fs.existsSync(path.join(postDir, 'zh.mdx'))) {
      console.log(`[SKIP] ${slug} already exists`);
      continue;
    }

    fs.mkdirSync(postDir, { recursive: true });

    const frontmatter = generateFrontmatter(video);
    fs.writeFileSync(path.join(postDir, 'zh.mdx'), frontmatter);

    console.log(`[CREATE] ${slug}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);