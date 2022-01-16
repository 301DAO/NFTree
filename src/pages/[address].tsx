import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { CopyIcon, MediaDisplay } from '../components';
import { useIntersectionObserver, useMounted } from '../hooks';
import { retrieveNftsByAddress } from '../lib/nft-port-api';
import styles from '../styles/Home.module.css';
import { NFT, SaleStats } from '../utils/sales-data';
import { queryEnsSubgraph } from '../lib/the-graph-api';

const DynamicRoute = () => {
  const [copied, setCopied] = React.useState(false);
  function copyAddress() {
    const el = document.createElement('input');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
  }
  const loadMoreButtonRef = React.useRef(null);
  const searchInput = React.useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { address: param } = router.query;
  React.useEffect(() => {
    searchInput!.current!.value = param as string
  }, [param]);

  const mounted = useMounted();

  const [performFetch, setPerformFetch] = React.useState(false);

  const [continuationToken, setContinuationToken] = React.useState('');
  const [collectionData, setCollectionData] = React.useState<Record<string, SaleStats>>({});

  const { data: address, isFetched: ensIsFetching } = useQuery(
    ['ens-query', searchInput?.current?.value],
    async () => {
      const { data } = await queryEnsSubgraph({
        name: param as string,
        address: param as string
      });

      const { addressQuery, nameQuery } = data;
      const returnedItem = [...addressQuery, ...nameQuery].find((item) => item.resolvedAddress.id);
      setPerformFetch(false);
      return returnedItem?.resolvedAddress.id;
    },
    {
      enabled: mounted
    }
  );

  const {
    data: queryResponse,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
    ['queryResponse', address],
    async () => {
      // in the response it returns 'continuation' which is a token
      // that can be used to fetch the next page
      const { continuation, nfts } = await retrieveNftsByAddress({
        address: address as string,
        continuationToken
      });
      // getCollectionSalesData(nfts, collectionData, setCollectionData);
      setContinuationToken(continuation);
      // setPerformFetch(false);
      return nfts;
    },
    {
      enabled: mounted && !!address && (address as string).startsWith('0x'),
      notifyOnChangeProps: 'tracked',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,

    }
  );

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
    router.push(
      {
        pathname: `/${search}`
      },
      undefined,
      {
        shallow: true
      }
    );
    setPerformFetch(true);
  };

  const onEnterKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const search = searchInput?.current?.value.trim();
    if (!search) return;
    router.push(
      {
        pathname: `/${search}`
      },
      undefined,
      {
        shallow: true
      }
    );
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
          disabled={isLoading || isFetching}
          type="button"
          className="text-white w-[26rem] h-10 mb-12 font-semibold
          bg-gradient-to-r from-red-200 via-red-300 to-yellow-200
          hover:bg-gradient-to-bl focus:ring-red-100 dark:focus:ring-red-400
          rounded-b-lg text-sm px-5 py-2.5 text-center hover:cursor-pointer"
          onClick={onSearchClick}
        >
          SEARCH
        </button>
        {queryResponse && (
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2 flex space-x-2 text-md"
            onClick={copied ? () => setCopied(false) : copyAddress}
          >
            <span>Copy Address</span>

            <span>
              <CopyIcon />
            </span>
          </button>
        )}
        <div className="flex flex-wrap space-x-3 space-y-3 items-center justify-center w-full md:w-11/12">
          {queryResponse?.pages.map((page: any, idx: number) => (
            <React.Fragment key={idx}>
              {page?.map((nft: NFT, idx: number) =>
                nft.file_url ? (
                  <MediaDisplay
                    nft={nft}
                    key={idx}
                    url={nft.file_url}
                    sale_stats={collectionData[nft.contract_address]}
                    contract={nft.contract_address}
                    nft_id={nft.token_id}
                    owner={searchInput.current?.value as string}
                  />
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
            {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'LOAD MORE'}
          </span>
        </button>
      </main>
    </div>
  );
};

export default DynamicRoute;
