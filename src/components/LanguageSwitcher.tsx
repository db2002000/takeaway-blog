'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  hasAlternate: boolean;
  alternateSlug: string | null;
}

export default function LanguageSwitcher({
  hasAlternate,
  alternateSlug,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  if (!hasAlternate || !alternateSlug) {
    return null;
  }

  const currentLocale = pathname.split('/')[1];
  const alternateLocale = currentLocale === 'en' ? 'zh' : 'en';
  const label = currentLocale === 'en' ? '中文' : 'English';

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