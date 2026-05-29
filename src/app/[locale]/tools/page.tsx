import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '工具 | 打包Takeaway',
  description: '自助探索工具，辅助发现天赋、梳理思路等',
};

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main>
      <Nav />
      <div className="max-w-2xl mx-auto py-16">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-4">
          工具
        </h1>
        <p className="text-text-secondary mb-12">
          自助探索工具，辅助发现天赋、梳理思路等。
        </p>

        <div className="flex flex-col gap-4">
          <ToolCard
            href={`/${locale}/tools/talent-discovery`}
            title="发现你的天赋"
            desc="基于《世界一やさしい「才能」の見つけ方》，通过回答五个问题、从天赋清单选择、询问他人三个步骤，发现你的天赋所在。"
            tag="天赋"
          />
        </div>
      </div>
    </main>
  );
}

function ToolCard({
  href,
  title,
  desc,
  tag,
}: {
  href: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <Link
      href={href}
      className="group block border border-border rounded-2xl p-6 hover:border-border-muted transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="font-display text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
          {title}
        </h2>
        <span
          className="inline-block rounded px-2 py-0.5 text-xs font-ui"
          style={{
            background: 'var(--color-accent-muted)',
            color: 'var(--color-accent)',
          }}
        >
          {tag}
        </span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
    </Link>
  );
}