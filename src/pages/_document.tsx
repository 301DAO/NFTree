import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
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