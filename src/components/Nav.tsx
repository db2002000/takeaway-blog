'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';

export default function Nav() {
  const locale = useLocale();
  const t = useTranslations('nav');

  return (
    <nav className="flex items-center justify-between py-6 border-b border-border">
      <Link
        href={`/${locale}`}
        className="font-display text-2xl font-bold text-text-primary hover:text-accent transition-colors"
      >
        打包Takeaway
      </Link>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6 font-ui text-sm">
          <Link
            href={`/${locale}`}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {t('home')}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {t('about')}
          </Link>
          <Link
            href={`/${locale}/tools`}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            工具
          </Link>
        </div>
        <LocaleSwitcher />
      </div>
    </nav>
  );
}