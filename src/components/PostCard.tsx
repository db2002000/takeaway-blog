import Link from 'next/link';
import type { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
  locale: string;
}

export default function PostCard({ post, locale }: PostCardProps) {
  const { slug, frontmatter } = post;
  const dateFormatted = new Date(frontmatter.date).toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <Link href={`/${locale}/posts/${slug}`}>
      <article className="group bg-surface rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5">
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-ui px-2 py-1 rounded-full bg-accent-muted text-accent-pink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-display text-2xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
          {frontmatter.title}
        </h2>
        <p className="font-body text-text-secondary text-base leading-relaxed mb-4 line-clamp-2">
          {frontmatter.description}
        </p>
        <time className="font-ui text-sm text-text-muted">{dateFormatted}</time>
      </article>
    </Link>
  );
}