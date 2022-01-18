import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useIntersectionObserver, useMounted } from '../hooks';
import { retrieveNftsByAddress } from '../lib/nft-port-api';
import { queryEnsSubgraph } from '../lib/the-graph-api';
import styles from '../styles/grid.module.css';
import type { NFT } from '../types';

const MediaCard = dynamic(() => import('../components/media-card'));
const LoadMoreButton = dynamic(() => import('../components/load-more-button'));
const CopyButton = dynamic(() => import('../components/copy-button'));

const Address = () => {
  const mounted = useMounted();
  const router = useRouter();
  const { address: param } = router.query;

  const [continuationToken, setContinuationToken] = React.useState('');
  const { data: address } = useQuery(
    ['ens-query', param],
    async () => {
      const { data } = await queryEnsSubgraph({
        name: param as string,
        address: param as string
      });
      const { addressQuery, nameQuery } = data;
      const returnedItem = [...addressQuery, ...nameQuery].find((item) => item.resolvedAddress.id);
      return returnedItem?.resolvedAddress.id;
    },
    { enabled: mounted && !!param }
  );

  const {
    data: infiniteQueryResponse,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteQuery(
    ['infiniteQueryResponse', param],
    async () => {
      const { continuation, nfts } = await retrieveNftsByAddress({
        address: address as string,
        continuationToken
      });
      setContinuationToken(continuation);
      return nfts;
    },
    {
      enabled: !!address && (address as string).startsWith('0x'),
      notifyOnChangeProps: 'tracked',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  );

  const loadMoreButtonRef = React.useRef(null);
  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: () => fetchNextPage({ pageParam: continuationToken }),
    enabled: !!continuationToken,
    rootMargin: '10px'
  });

  return (
    <main className="flex flex-col items-center justify-start flex-grow min-h-screen px-0 mt-16 pb-8">
      {!!infiniteQueryResponse && <CopyButton buttonText="Copy profile link" />}
      <div className={styles.gallery}>
        {infiniteQueryResponse?.pages.map((page: any, idx: number) => (
          <React.Fragment key={idx}>
            {page?.map((nft: NFT, idx: number) =>
              nft.file_url ? <MediaCard nft={nft} key={idx} /> : <></>
            )}
          </React.Fragment>
        ))}
      </div>
      <LoadMoreButton
        loadMoreRef={loadMoreButtonRef}
        disabled={!!continuationToken}
        loading={isFetchingNextPage || isFetching || isLoading}
        onLoadMoreClick={() => fetchNextPage({ pageParam: continuationToken })}
      />
    </main>
  );
};

export default Address;
