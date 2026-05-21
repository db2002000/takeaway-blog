import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['zh', 'zh-Hant', 'en'],
  defaultLocale: 'zh',
  localeCookie: {
    name: 'NEXT_LOCALE',
  },
});

export const config = {
  matcher: ['/', '/(zh|zh-Hant|en)/:path*']
};