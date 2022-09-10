import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { RenderPage, RenderPageResult } from 'next/dist/shared/lib/utils';
import metaData from '@config/metaData';
import GoogleAnalytics from '@components/GoogleAnalytics';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const originalRenderPage: RenderPage = ctx.renderPage;
    const sheet: ServerStyleSheet = new ServerStyleSheet();

    try {
      ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
          enhanceComponent: (Component) => Component,
        });

      const initialProps: DocumentInitialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const setInitialTheme = `
    function getUserTheme() {
      if(window.localStorage.getItem('theme')) {
        return window.localStorage.getItem('theme')
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    document.body.dataset.theme = getUserTheme();
  `;

    return (
      <Html lang={metaData.language}>
        <Head>
          <GoogleAnalytics />
          <link rel="icon" href="/favicons/favicon.ico" />
          <link rel="apple-touch-icon" sizes="76x76" href="/favicons/logo_76x76.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/logo_32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/logo_16x16.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
          <link rel="alternate" type="application/rss+xml" href="/rss.xml" />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
