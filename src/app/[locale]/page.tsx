import Link from 'next/link';
import Nav from '@/components/Nav';
import PostCard from '@/components/PostCard';
import VideoPlayer from '@/components/VideoPlayer';
import { getAllPosts } from '@/lib/mdx';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const posts = getAllPosts(locale as 'zh' | 'en' | 'zh-Hant');
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
          {t('tagline')}
        </p>
        <h1 className="font-display text-[72px] font-black leading-[1.0] tracking-[-0.03em] text-text-primary mb-7">
          {t('heroTitle')}<br />
          <em className="italic text-accent">{t('heroEm')}</em>
        </h1>
        <p className="text-[15px] leading-[1.75] text-text-secondary mb-9">
          {t('heroSubtitle')}
        </p>
        <div className="flex items-center gap-3 text-[12px] text-text-muted">
          <span>{t('updateFrequency')}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#C9C2D8]" />
          <span>{t('languageFocus')}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#C9C2D8]" />
          <span>{t('platformSync')}</span>
        </div>
      </section>

      <div className="h-[1px] bg-border mx-10" />

      {/* Latest Posts */}
      <section className="px-10 pt-10">
        <p className="text-[11px] tracking-[0.12em] text-text-muted uppercase mb-6">
          {t('latestPosts')}
        </p>

        {/* Featured Post */}
        {featured && (
          <div className="bg-surface rounded-[18px] border border-border p-8 mb-2">
            <div className="text-[10px] tracking-[0.12em] text-accent-pink uppercase mb-3">
              {t('featuredLabel')} · {new Date(featured.frontmatter.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'zh-Hant' ? 'zh-TW' : 'zh-CN', { year: 'numeric', month: 'long' })}
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
                {t('readArticle')}
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
            className="block py-5 border-b border-border group"
          >
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-5">
                <span className="text-[11px] text-[#C9C2D8] min-w-[20px] tabular-nums">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <span className="font-display text-[20px] font-bold tracking-[-0.01em] text-text-primary group-hover:text-accent transition-colors leading-[1.25]">
                  {post.frontmatter.title}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {post.frontmatter.tags?.[0] && (
                  <span className="text-[10px] tracking-[0.08em] text-accent-pink bg-accent-muted px-2 py-1 rounded uppercase">
                    {post.frontmatter.tags[0]}
                  </span>
                )}
                <span className="text-[11px] text-[#C9C2D8]">
                  {new Date(post.frontmatter.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'zh-Hant' ? 'zh-TW' : 'zh-CN', { year: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Grid of remaining posts */}
      {rest.length > 0 && (
        <section className="px-10 py-12">
          <p className="text-[11px] tracking-[0.12em] text-text-muted uppercase mb-6">
            {t('morePosts')}
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