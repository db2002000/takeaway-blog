'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  youtubeId?: string;
  bilibiliBvid?: string;
  size?: 'normal' | 'small';
}

export default function VideoPlayer({ youtubeId, bilibiliBvid, size = 'normal' }: VideoPlayerProps) {
  const [activePlatform, setActivePlatform] = useState<'youtube' | 'bilibili'>(
    youtubeId ? 'youtube' : 'bilibili'
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const hasYoutube = !!youtubeId;
  const hasBilibili = !!bilibiliBvid;

  const aspectClass = size === 'small' ? 'pt-[42.86%]' : 'pt-[56.25%]';
  const playButtonSize = size === 'small' ? 'w-10 h-10' : 'w-16 h-16';
  const playIconSize = size === 'small' ? '16' : '24';

  function renderPlatformPicker() {
    return (
      <div className={`flex justify-center gap-2 ${size === 'small' ? 'mb-2' : 'mb-3'}`}>
        {hasYoutube && (
          <button
            onClick={() => { setActivePlatform('youtube'); setIsLoaded(false); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              activePlatform === 'youtube'
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-surface border-zinc-200 text-zinc-500 hover:border-zinc-300'
            }`}
          >
            YouTube
          </button>
        )}
        {hasBilibili && (
          <button
            onClick={() => { setActivePlatform('bilibili'); setIsLoaded(false); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              activePlatform === 'bilibili'
                ? 'bg-pink-50 border-pink-200 text-pink-600'
                : 'bg-surface border-zinc-200 text-zinc-500 hover:border-zinc-300'
            }`}
          >
            哔哩哔哩
          </button>
        )}
      </div>
    );
  }

  function renderEmbed() {
    if (!isLoaded) {
      return (
        <button
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 flex items-center justify-center bg-accent-muted hover:bg-accent-muted/80 transition-colors cursor-pointer group"
          aria-label="Load video"
        >
          <div className={`${playButtonSize} rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <svg
              width={playIconSize}
              height={playIconSize}
              viewBox="0 0 24 24"
              fill="white"
              className="ml-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      );
    }

    if (activePlatform === 'youtube' && youtubeId) {
      return (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (activePlatform === 'bilibili' && bilibiliBvid) {
      return (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://player.bilibili.com/player.html?bvid=${bilibiliBvid}&p=1&autoplay=0`}
          title="Bilibili video player"
          frameBorder="0"
          allow="autoplay; fullscreen"
        />
      );
    }

    return null;
  }

  if (!hasYoutube && !hasBilibili) return null;

  return (
    <div className={size === 'small' ? 'my-3' : 'my-8'}>
      {hasYoutube && hasBilibili && renderPlatformPicker()}
      <div className={`relative w-full ${aspectClass} bg-surface rounded-2xl overflow-hidden`}>
        {renderEmbed()}
      </div>
    </div>
  );
}