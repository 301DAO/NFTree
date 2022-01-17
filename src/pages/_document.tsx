import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌴</text></svg>"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/@themesberg/flowbite@1.3.0/dist/flowbite.min.css"
          />
        </Head>
        <body>
          <Script src="https://unpkg.com/@themesberg/flowbite@1.3.0/dist/flowbite.bundle.js" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
