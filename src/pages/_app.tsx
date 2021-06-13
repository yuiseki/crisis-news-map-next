import Head from 'next/head';
import { GlobalStyles, css } from 'twin.macro';
import { Global } from '@emotion/react';
import { AppProps } from 'next/app';

const globalStyles = css`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  iframe#twitter-widget-0 {
    z-index: 1000;
    position: absolute !important;
    left: 64px !important;
    bottom: 10px !important;
  }

  iframe#twitter-widget-1 {
    z-index: 1000;
    position: absolute !important;
    left: 64px !important;
    bottom: 50px !important;
  }
`;

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>全国災害情報地図</title>
      <link rel='icon' href='/favicon.ico' />
      <link
        href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css'
        rel='stylesheet'
      ></link>
    </Head>
    <GlobalStyles />
    <Global styles={globalStyles} />
    <Component {...pageProps} />
  </>
);

export default App;
