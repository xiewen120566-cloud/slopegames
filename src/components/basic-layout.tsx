import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { PropsWithChildren } from "react";
import Script from "next/script";

import { Locale } from "@/i18n/routing";
import ElTemplate from "@/components/el-temlplate";

import { Providers } from "./providers";

interface Props extends PropsWithChildren {
  locale: Locale;
}

export default async function BaseLayout({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script
          id="google-gpt-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.googletag = window.googletag || { cmd: [] };
window.googletag.cmd.push(function() {
  window.__gptSlots = window.__gptSlots || {};
  window.__gptSlots['div-gpt-ad-1775487047646-0'] = window.googletag.defineSlot(
    '/23346479587/Acgg-Banner',
    [[300, 100], [300, 50], [320, 50], [300, 250]],
    'div-gpt-ad-1775487047646-0'
  ).addService(window.googletag.pubads());
  window.__gptSlots['div-gpt-ad-1775487047646-1'] = window.googletag.defineSlot(
    '/23346479587/Acgg-Banner',
    [[300, 100], [300, 50], [320, 50], [300, 250]],
    'div-gpt-ad-1775487047646-1'
  ).addService(window.googletag.pubads());
  window.googletag.pubads().enableSingleRequest();
  window.googletag.enableServices();
});
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <div className="gpt-sticky-bottom">
              <div className="gpt-sticky-bottom__inner">
                <ElTemplate
                  id="div-gpt-ad-1775487047646-1"
                  style={{ minWidth: 300, minHeight: 50 }}
                />
              </div>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
