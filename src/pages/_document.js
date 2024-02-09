import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
      {/* <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-HLFDYBLJMB"/>
      <Script
          id='google-analytics'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-HLFDYBLJMB', {
                      page_path: window.location.pathname,
                  });
              `,
          }}
      /> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
