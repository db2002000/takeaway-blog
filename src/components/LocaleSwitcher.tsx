'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const locales = [
  { code: 'zh', label: '简' },
  { code: 'zh-Hant', label: '繁' },
  { code: 'en', label: 'EN' },
];

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const handleSwitch = (targetLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    return segments.join('/');
  };

  return (
    <>
      <div style={{color:'red',fontSize:12}}>{currentLocale}</div>
      <div className="flex items-center gap-1 font-ui text-sm">
      {locales.map((l) => {
        const isActive = currentLocale === l.code;
        return (
          <Link
            key={l.code}
            href={handleSwitch(l.code)}
            scroll={false}
            className={`px-2 py-1 rounded transition-colors ${
              isActive
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
    </>
  );
}