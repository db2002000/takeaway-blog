import Link from 'next/link';
import Nav from '@/components/Nav';
import PostCard from '@/components/PostCard';
import VideoPlayer from '@/components/VideoPlayer';
import PlatformLinks from '@/components/PlatformLinks';
import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');

  const posts = getAllPosts(locale as 'zh' | 'en');
  const featured = posts[0];
  const latest = posts.slice(1, 4);
  const rest = posts.slice(4);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  const extractBilibiliBvid = (url: string): string | null => {
    const match = url.match(/\/video\/(BV[a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-bg">
      <Nav />

      {/* Hero */}
      <section className="px-10 pt-16 pb-12">
        <p className="text-[11px] tracking-[0.14em] text-accent-pink uppercase mb-5">
          个人成长 · 真实发现
        </p>
        <h1 className="font-display text-[72px] font-black leading-[1.0] tracking-[-0.03em] text-text-primary mb-7">
          把值得的东西<br />
          <em className="italic text-accent">打包带走</em>
        </h1>
        <p className="text-[15px] leading-[1.75] text-text-secondary max-w-[420px] mb-9">
          视频的文字版。每篇文章对应一条影片，读完还想看的，直接跳转。
        </p>
        <div className="flex items-center gap-3 text-[12px] text-text-muted">
          <span>月更</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#C9C2D8]" />
          <span>中文为主</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#C9C2D8]" />
          <span>全平台同步</span>
        </div>
      </section>

      <div className="h-[1px] bg-border mx-10" />

      {/* Latest Posts */}
      <section className="px-10 pt-10">
        <p className="text-[11px] tracking-[0.12em] text-text-muted uppercase mb-6">
          最新文章
        </p>

        {/* Featured Post */}
        {featured && (
          <div className="bg-surface rounded-[18px] border border-border p-8 mb-2">
            <div className="text-[10px] tracking-[0.12em] text-accent-pink uppercase mb-3">
              置顶 · {new Date(featured.frontmatter.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
            </div>
            <h2 className="font-display text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-text-primary mb-3">
              {featured.frontmatter.title}
            </h2>
            <p className="text-[13px] leading-[1.8] text-text-secondary mb-5">
              {featured.frontmatter.description}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href={`/${locale}/posts/${featured.slug}`}
                className="inline-flex items-center gap-2 text-[12px] text-accent bg-accent-muted px-4 py-2 rounded-lg hover:bg-accent-muted/80 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6.5 3.5l5 4.5-5 4.5v-3.5H3v-2h3.5V3.5z"/>
                </svg>
                阅读文章
              </Link>
              {(featured.frontmatter.platforms?.youtube || featured.frontmatter.platforms?.bilibili) && (
                <VideoPlayer
                  youtubeId={extractVideoId(featured.frontmatter.platforms?.youtube || '') || undefined}
                  bilibiliBvid={extractBilibiliBvid(featured.frontmatter.platforms?.bilibili || '') || undefined}
                  size="small"
                />
              )}
            </div>
          </div>
        )}

        {/* Post List */}
        {latest.map((post, i) => (
          <Link
            key={post.slug}
            href={`/${locale}/posts/${post.slug}`}
            className="flex items-baseline justify-between py-5 border-b border-border group"
          >
            <div className="flex items-baseline gap-5 flex-1">
              <span className="text-[11px] text-[#C9C2D8] min-w-[20px] tabular-nums">
                {String(i + 2).padStart(2, '0')}
              </span>
              <span className="font-display text-[20px] font-bold tracking-[-0.01em] text-text-primary group-hover:text-accent transition-colors leading-[1.25]">
                {post.frontmatter.title}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 ml-6">
              {post.frontmatter.tags?.[0] && (
                <span className="text-[10px] tracking-[0.08em] text-accent-pink bg-accent-muted px-2 py-1 rounded uppercase">
                  {post.frontmatter.tags[0]}
                </span>
              )}
              <span className="text-[11px] text-[#C9C2D8] min-w-[56px] text-right">
                {new Date(post.frontmatter.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }).replace('年', '').replace('月', '')}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Grid of remaining posts */}
      {rest.length > 0 && (
        <section className="px-10 py-12">
          <p className="text-[11px] tracking-[0.12em] text-text-muted uppercase mb-6">
            更多文章
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}