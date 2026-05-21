import Link from 'next/link';
import { useLocale } from 'next-intl';

interface LanguageSwitcherProps {
  hasAlternate: boolean;
  alternateSlug: string | null;
}

export default function LanguageSwitcher({
  hasAlternate,
  alternateSlug,
}: LanguageSwitcherProps) {
  const locale = useLocale();

  if (!hasAlternate || !alternateSlug) {
    return null;
  }

  const alternateLocale = locale === 'zh' ? 'en' : 'zh';
  const label = locale === 'zh' ? 'English' : '中文';

  return (
    <div className="flex items-center gap-2 font-ui text-sm">
      <span className="text-text-muted">|</span>
      <Link
        href={`/${alternateLocale}/posts/${alternateSlug}`}
        className="text-text-secondary hover:text-accent transition-colors"
      >
        {label}
      </Link>
    </div>
  );
}