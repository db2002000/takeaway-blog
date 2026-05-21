import { getTranslations } from 'next-intl/server';
import Nav from '@/components/Nav';
import Link from 'next/link';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('nav');

  return (
    <main>
      <Nav />
      <section className="py-16">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-8">
          {t('about')}
        </h1>
        <div className="prose prose-lg max-w-2xl">
          <p className="text-text-secondary leading-relaxed mb-6">
            打包Takeaway 是一个个人博客，将视频文字稿整理为文章发布。内容关于个人成长与发现。
          </p>
          <p className="text-text-muted font-ui">
            这里记录的是真实的想法和经历，没有完美的解决方案，只有不断尝试和调整。
          </p>
        </div>
      </section>
    </main>
  );
}