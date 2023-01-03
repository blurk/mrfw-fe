import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { RouterTransition } from 'components/atoms/RouterTransition';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { SWRConfig } from 'swr';
import { Layout } from '../components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Page title</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <SWRConfig>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <RouterTransition />
          <NotificationsProvider position="top-right">
            <Toaster />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NotificationsProvider>
        </MantineProvider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
