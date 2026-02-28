import '@composition/styles/globals.css';
import type { AppProps } from 'next/app';
import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';
import { FC } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Composition</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        {/* Meta tags for SEO and social media */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="composition" />
        <meta name="theme-color" content="#171717" />
        {/* Open Graph tags */}
        <meta property="og:title" content="composition" />
        <meta property="og:description" content="composition" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon.png" />
        <meta
          property="og:url"
          content="https://hieudoanm.github.io/composition"
        />
        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="composition" />
        <meta name="twitter:description" content="composition" />
        <meta name="twitter:image" content="/favicon.png" />
      </Head>

      <div
        className={`${geistSans.className} ${geistMono.className} bg-neutral-900 text-neutral-100`}>
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default App;
