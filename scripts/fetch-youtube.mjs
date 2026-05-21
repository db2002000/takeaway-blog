import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error('YOUTUBE_API_KEY not found in .env.local');
  process.exit(1);
}

const PROXY_URL = 'http://127.0.0.1:7890';
const agent = new HttpsProxyAgent(PROXY_URL);

const CHANNEL_HANDLE = '@dbdb3845';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

function apiRequest(pathname, params) {
  return new Promise((resolve, reject) => {
    const searchParams = new URLSearchParams({ key: API_KEY });
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.set(k, String(v));
      }
    }
    const url = `${BASE_URL}${pathname}?${searchParams.toString()}`;

    const req = https.get(url, { agent }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function getVideoDurations(videoIds) {
  const results = {};
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const idsParam = batch.join(',');
    const data = await apiRequest('/videos', {
      part: 'contentDetails,snippet',
      id: idsParam
    });

    if (data.items) {
      for (const item of data.items) {
        const duration = item.contentDetails?.duration;
        const isShort = !duration ||
          parseDuration(duration) < 150;

        results[item.id] = {
          isShort,
          title: item.snippet?.title,
          description: item.snippet?.description,
          publishedAt: item.snippet?.publishedAt,
          thumbnail: item.snippet?.thumbnails?.high?.url ||
                     item.snippet?.thumbnails?.medium?.url ||
                     item.snippet?.thumbnails?.default?.url,
        };
      }
    }
  }
  return results;
}

function parseDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s一-鿿]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

function formatDate(iso) {
  return iso.substring(0, 10);
}

function escapeDescription(text) {
  return text.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
}

function extractTags(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const tagMap = {
    '个人成长': ['成长', '改变', '习惯', '拖延', '效率', '自律', '自我', '提升'],
    '心理': ['焦虑', '压力', '情绪', '心理', '大脑', '杏仁核', '皮质醇', '情感'],
    '社交': ['社交', '沟通', '人际关系', '朋友', '关系', '相处'],
    '工作': ['工作', '职场', '创业', '副业', '收入', '赚钱', '事业'],
    '学习': ['学习', '读书', '阅读', '知识', '认知', '思维'],
  };

  const found = [];
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some(k => text.includes(k))) {
      found.push(tag);
    }
  }
  return found.length > 0 ? found.slice(0, 3) : ['个人成长'];
}

async function main() {
  console.log(`Fetching channel ID for ${CHANNEL_HANDLE}...`);

  const channelData = await apiRequest('/channels', {
    part: 'id',
    forHandle: CHANNEL_HANDLE
  });

  const channelId = channelData.items?.[0]?.id;
  if (!channelId) {
    console.error('Channel not found');
    process.exit(1);
  }
  console.log(`Channel ID: ${channelId}`);

  console.log('\nFetching all video IDs...');
  const allVideoIds = [];
  let pageToken = null;
  let pageCount = 0;

  do {
    const data = await apiRequest('/search', {
      part: 'id',
      channelId,
      maxResults: '50',
      order: 'date',
      type: 'video',
      pageToken: pageToken || undefined
    });

    if (data.items) {
      for (const item of data.items) {
        allVideoIds.push(item.id.videoId);
      }
    }

    pageToken = data.nextPageToken;
    pageCount++;
    console.log(`  Page ${pageCount}: ${data.items?.length || 0} videos, total: ${allVideoIds.length}`);
  } while (pageToken && pageCount < 10);

  console.log(`\nTotal videos: ${allVideoIds.length}`);
  console.log('Fetching duration for each video...');

  const videoDetails = await getVideoDurations(allVideoIds);

  const videos = Object.entries(videoDetails)
    .filter(([id, details]) => !details.isShort)
    .map(([id, details]) => ({
      videoId: id,
      title: details.title,
      description: details.description,
      publishedAt: details.publishedAt,
      thumbnail: details.thumbnail,
    }));

  console.log(`Videos (excluding Shorts): ${videos.length}`);

  const postsDir = path.join(process.cwd(), 'content', 'posts');

  for (const video of videos) {
    const slug = slugify(video.title);
    const postDir = path.join(postsDir, slug);

    if (fs.existsSync(path.join(postDir, 'zh.mdx'))) {
      console.log(`[SKIP] ${slug}`);
      continue;
    }

    fs.mkdirSync(postDir, { recursive: true });

    const tags = extractTags(video.title, video.description);
    const date = formatDate(video.publishedAt);
    const shortDesc = video.description
      ? escapeDescription(video.description.substring(0, 150))
      : '视频文字稿';

    const content = `---
title: "${video.title}"
date: "${date}"
description: "${shortDesc}"
tags: ${JSON.stringify(tags)}
platforms:
  youtube: "https://youtube.com/watch?v=${video.videoId}"
---

# ${video.title}

${video.description || '（暂无描述）'}
`;

    fs.writeFileSync(path.join(postDir, 'zh.mdx'), content);
    console.log(`[CREATE] ${slug}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);