import type { AppProps } from 'next/app';
import { Hydrate, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import queryClient from '../lib/clients/react-query';
import '../styles/globals.css';
import { Layout } from '../layouts';
import Head from 'next/head';
function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NFTree</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
