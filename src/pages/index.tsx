import type { NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { useInfiniteQuery } from 'react-query';
import { delay } from '../utils/misc';
import { MediaDisplay } from '../components';
import { useIntersectionObserver } from '../hooks';
import { retrieveCollectionSaleStats, retrieveNftDetails, retrieveNftsByAddress } from '../lib/nft-port-api';
import styles from '../styles/Home.module.css';
import { getCollectionSalesData,NFT,SaleStats } from '../utils/sales-data';
import { queryEnsSubgraph } from '../lib/the-graph-api';

const TEST_ADDRESSES = [
  '0x577ebc5de943e35cdf9ecb5bbe1f7d7cb6c7c647',
  '0x066317b90509069eb52474a38c212508f8a1211c'
];

//tokenangels.eth

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);



  const searchInput = React.useRef<HTMLInputElement>(null);
  const [performFetch, setPerformFetch] = React.useState(false);
  const [continuationToken, setContinuationToken] = React.useState('');
  const [collectionData, setCollectionData] = React.useState<Record<string,SaleStats>>({});

  const {
    data: queryResponse,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,

    refetch
  } = useInfiniteQuery(
    ['queryResponse', searchInput.current?.value],
    async () => {

      let address = searchInput.current?.value;

      if(!address?.includes('0x') && address?.includes('.')) {
        const ensResults = await queryEnsSubgraph({name:address as string});

        if(ensResults.data.domains.length > 0)
        {
          address = ensResults.data.domains[0].resolvedAddress.id;
        }
      }

      const { continuation, nfts } = await retrieveNftsByAddress({
        address: address as string,
        continuationToken
      });

      getCollectionSalesData(nfts, collectionData, setCollectionData);
      

      setContinuationToken(continuation);
      setPerformFetch(false);
      return nfts;
    },
    {
      enabled: performFetch && mounted && !!searchInput?.current?.value
    }
  );

  


  const loadMoreButtonRef = React.useRef(null);
  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: () => fetchNextPage({ pageParam: continuationToken }),
    enabled: !!continuationToken,
    rootMargin: '10px'
  });

  const onSearchClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const search = searchInput?.current?.value.trim();
    if (!search) return;
    setPerformFetch(true);
  };
  const onEnterKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const search = searchInput?.current?.value.trim();
    if (!search) return;
    setPerformFetch(true);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>👀</title>
      </Head>
      <main className={styles.main}>
        <div className="flex justify-center items-end bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 w-[26rem] h-10 rounded-t-lg">
          <input
            // readOnly
            // value="0x577ebc5de943e35cdf9ecb5bbe1f7d7cb6c7c647"
            placeholder=""
            onKeyPress={onEnterKeyPress}
            ref={searchInput}
            className="bg-gray-50 active:outline-none outline-none focus:bg-white active:ring-0 border-b-0 rounded-t-md p-2 w-[99%] h-[95%] text-center placeholder-gray-600 focus:placeholder-transparent"
          />
        </div>
        <button
          disabled={!searchInput?.current?.value || isLoading || isFetching}
          type="button"
          className="text-white w-[26rem] h-10 mb-12 font-semibold
          bg-gradient-to-r from-red-200 via-red-300 to-yellow-200
          hover:bg-gradient-to-bl focus:ring-red-100 dark:focus:ring-red-400
          rounded-b-lg text-sm px-5 py-2.5 text-center hover:cursor-pointer text-white"
          onClick={onSearchClick}
        >
          SEARCH
        </button>

        <div className="flex flex-wrap items-center justify-center w-full md:w-11/12">
          {queryResponse?.pages.map((page: any, idx: number) => (
            <React.Fragment key={idx}>
              {page?.map((nft: NFT, idx: number) => 
                nft.file_url ? (
                  <MediaDisplay key={idx} url={nft.file_url} sale_stats={collectionData[nft.contract_address]} contract={nft.contract_address} nft_id={nft.token_id} owner={searchInput.current?.value as string} />
                ) : null 
              )}
            </React.Fragment>
          ))}
        </div>
        <button
          id="load-more-button"
          ref={loadMoreButtonRef}
          onClick={() => fetchNextPage({ pageParam: continuationToken })}
          disabled={!hasNextPage || isFetchingNextPage}
          style={{
            visibility: hasNextPage ? 'visible' : 'hidden'
          }}
          className={`relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900`}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            {isFetchingNextPage
              ? 'Loading...'
              : hasNextPage
              ? 'Load More'
              : 'LOAD MORE'}
          </span>
        </button>
      </main>
    </div>
  );
};

export default Home;
