import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: '打包Takeaway',
    template: '%s | 打包Takeaway',
  },
  description: '视频文字稿 · 个人成长 · 真实发现',
};

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'zh-Hant' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Noto+Serif+SC:wght@400;700&family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}