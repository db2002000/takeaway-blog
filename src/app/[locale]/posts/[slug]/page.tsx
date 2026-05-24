import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import PostCard from '@/components/PostCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import PlatformLinks from '@/components/PlatformLinks';
import Concept from '@/components/Concept';
import BrainResetMap from '@/components/BrainResetMap';
import TrackingSelector from '@/components/TrackingSelector';
import VideoPlayer from '@/components/VideoPlayer';
import { getPostBySlug, hasAlternateLocale, getAllPosts } from '@/lib/mdx';
import { toTraditionalChinese } from '@/lib/zh-hant';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ['zh', 'zh-Hant', 'en'];
  // 动态获取所有 slug，避免硬编码
  const { getAllPosts } = await import('@/lib/mdx');
  const allPosts = [...getAllPosts('zh'), ...getAllPosts('en')];
  const slugs = [...new Set(allPosts.map((p) => p.slug))];
  const params: { locale: string; slug: string }[] = [];

  for (const slug of slugs) {
    for (const locale of locales) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale as 'zh' | 'zh-Hant' | 'en');

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const isZhHant = locale === 'zh-Hant';
  const convertText = (text: string) => isZhHant ? toTraditionalChinese(text) : text;

  return {
    title: convertText(post.frontmatter.title),
    description: convertText(post.frontmatter.description),
  };
}

export default async function PostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('post');

  const post = getPostBySlug(slug, locale as 'zh' | 'zh-Hant' | 'en');

  if (!post) {
    notFound();
  }

  const hasAlternate = hasAlternateLocale(slug, locale as 'zh' | 'zh-Hant' | 'en');
  const allPosts = getAllPosts(locale as 'zh' | 'en');
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const isZhHant = locale === 'zh-Hant';
  const convertText = (text: string) => isZhHant ? toTraditionalChinese(text) : text;

  const dateFormatted = new Date(post.frontmatter.date).toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : locale === 'zh-Hant' ? 'zh-TW' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  const extractBilibiliBvid = (url: string): string | null => {
    const match = url.match(/\/video\/(BV[a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  return (
    <main>
      <Nav />
      <article className="py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/${locale}`}
              className="font-ui text-sm text-text-muted hover:text-accent transition-colors"
            >
              ← {t('backToList')}
            </Link>
            <LanguageSwitcher
              hasAlternate={hasAlternate}
              alternateSlug={slug}
            />
          </div>

          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-ui px-2 py-1 rounded-full bg-accent-muted text-accent-pink"
                >
                  {convertText(tag)}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
            {convertText(post.frontmatter.title)}
          </h1>

          <p className="font-body text-lg text-text-secondary mb-4 leading-relaxed">
            {convertText(post.frontmatter.description)}
          </p>

          <time className="font-ui text-sm text-text-muted block">
            {dateFormatted}
          </time>

          {(post.frontmatter.platforms?.youtube || post.frontmatter.platforms?.bilibili) && (
            <div className="mt-4">
              <VideoPlayer
                youtubeId={extractVideoId(post.frontmatter.platforms?.youtube || '') || undefined}
                bilibiliBvid={extractBilibiliBvid(post.frontmatter.platforms?.bilibili || '') || undefined}
                size="small"
              />
            </div>
          )}
        </header>

        <div className="max-w-3xl mx-auto">
        <div className="prose prose-lg prose-primary max-w-[65ch] mx-auto prose-headings:font-display prose-headings:font-bold prose-p:font-body prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <MDXRemote source={convertText(post.content)} components={{ Concept, BrainResetMap, TrackingSelector }} />
        </div>
      </div>

        {post.frontmatter.platforms && (
          <PlatformLinks platforms={post.frontmatter.platforms} />
        )}
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-12 border-t border-border">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            More Articles
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((p) => (
              <PostCard key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}