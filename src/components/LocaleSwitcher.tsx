'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

const locales = [
  { code: 'zh', label: '简中' },
  { code: 'zh-Hant', label: '繁中' },
  { code: 'en', label: 'English' },
];

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-1 font-ui text-sm">
      {locales.map((l) => (
        <Link
          key={l.code}
          href={`/${l.code}`}
          scroll={false}
          className={`px-2 py-1 rounded transition-colors ${
            locale === l.code
              ? 'bg-accent text-white'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}