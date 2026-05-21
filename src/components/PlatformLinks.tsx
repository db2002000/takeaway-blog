'use client';

import { useState } from 'react';
import type { PostFrontmatter } from '@/lib/types';

interface PlatformLinksProps {
  platforms: PostFrontmatter['platforms'];
}

const platformIcons: Record<string, { icon: string; color: string; label: string }> = {
  youtube: {
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    color: '#FF0000',
    label: 'YouTube',
  },
  xiaohongshu: {
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    color: '#FF2442',
    label: '小红书',
  },
  douyin: {
    icon: 'M17.305 2.28C15.54 1.646 13.797 1 12 1c-1.797 0-3.54.646-5.305 1.28C4.768 3.107 3 4.907 3 7.075v9.85c0 2.168 1.768 3.968 4.695 4.795 1.765.634 3.54 1.28 5.305 1.28 1.765 0 3.54-.646 5.305-1.28 2.927-.827 4.695-2.627 4.695-4.795V7.075c0-2.168-1.768-3.968-4.695-4.795z',
    color: '#161616',
    label: '抖音',
  },
  bilibili: {
    icon: 'M24 8.3c0-2.1-1.2-3.8-3.2-4.7l-1.3-.6c-.5-.2-.9-.3-1.4-.3H4.7C2.1 2.7.3 4.3.3 6.7v10.6c0 2.4 1.8 4.1 4.4 4.1h14.9l1.2.6c2 .9 3.2 2.6 3.2 4.7s-1.8 3.5-4.1 3.5H4.1c-2.3 0-4.1-1.6-4.1-3.5V14c1 0 2-.3 2.8-.8l1.3-.6h.2c.1 0 .2 0 .3.1s.2.2.3.2c.2.2.4.4.7.5l.4.1h15.4c2.3 0 4.1-1.6 4.1-3.5V8.3zm-8.4 2.7L10 12l3 5V11l3-5-5.7-2z',
    color: '#00A1D6',
    label: '哔哩哔哩',
  },
};

export default function PlatformLinks({ platforms }: PlatformLinksProps) {
  const [loaded, setLoaded] = useState(false);

  if (!platforms) return null;

  const availablePlatforms = Object.entries(platforms).filter(
    ([, url]) => url && url.trim() !== ''
  );

  if (availablePlatforms.length === 0) return null;

  return (
    <div className="flex items-center gap-3 py-6">
      {availablePlatforms.map(([key, url]) => {
        const platform = platformIcons[key];
        if (!platform || !url) return null;

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
            aria-label={`${platform.label} Link`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={platform.color}
              className="drop-shadow-sm"
            >
              <path d={platform.icon} />
            </svg>
          </a>
        );
      })}
    </div>
  );
}