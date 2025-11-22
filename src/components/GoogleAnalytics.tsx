'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only run in production with a configured ID
  const isEnabled = typeof window !== 'undefined' && measurementId && process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isEnabled || !window.gtag) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    window.gtag('config', measurementId, {
      page_path: url,
    });
  }, [isEnabled, measurementId, pathname, searchParams]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}


