import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { Hydrate, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import queryClient from '../lib/clients/react-query';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <Toaster />
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
