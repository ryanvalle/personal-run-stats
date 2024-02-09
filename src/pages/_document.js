import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-33W1P1HC7H"/>
      <Script
          id='google-analytics'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-33W1P1HC7H');
              `,
          }}
      />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
