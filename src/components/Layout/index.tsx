import { Poppins } from '@next/font/google';
import Head from 'next/head';
import { FC, ReactElement } from 'react';
import styles from './Layout.module.css';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const Layout: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>spoons.fyi</title>
        <meta
          name="description"
          content="Find the best value-for-money in wetherspoons, because why else would you drink there?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content="spoons.fyi" />
        <meta
          property="og:description"
          content="Find the best value-for-money in wetherspoons, because why else would you drink there?"
        />
      </Head>
      <main className={`${styles.main} ${poppins.className}`}>{children}</main>
    </>
  );
};

export default Layout;
