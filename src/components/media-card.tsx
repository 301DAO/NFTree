import dynamic from 'next/dynamic';
import * as React from 'react';
import { useQuery } from 'react-query';
import { useIsMounted } from '../hooks';
import { retrieveCollectionSaleStats } from '../lib/nft-port-api';
import type { NFT } from '../types';
import { badUrls } from '../utils/bad-nft-urls';
import { delay } from '../utils/misc';

const MediaComponent = dynamic(() => import('../components/media-tag'));


const MediaCard = React.memo(({ nft }: { nft: NFT }) => {
  const {
    contract_address,
    creator_address,
    token_id,
    cached_file_url,
    file_url,
    metadata_url,
    name,
    description
  } = nft;

  if (file_url.length === 0 || badUrls.includes(file_url)) return <></>;

  const [performFetch, setPerformFetch] = React.useState(false);
  const isMounted = useIsMounted();
  React.useEffect(() => {
    delay(3000).then(() => {
      setPerformFetch(true);
      return () => setPerformFetch(false);
    });
  }, []);

  const { data: collectionData } = useQuery(
    contract_address,
    async () => {
      const { statistics } = await retrieveCollectionSaleStats(contract_address);
      return statistics;
    },
    {
      enabled: !!contract_address && performFetch && isMounted,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  );

  return (
    <div className="max-w-md bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">

      <div className="pb-0">
        <MediaComponent mediaUrl={file_url} />
      </div>
      <a
        href={`https://opensea.io/assets/${contract_address}/${token_id}`}
        target="_blank"
        className="break-word px-3 pt-2 text-left mb-1 font-normal text-gray-700 dark:text-gray-400 hover:text-blue-600"
      >
        {name}
      </a>
      <div className="px-3 p-2 flex justify-between space-x-6">
        <span className="bg-blue-100 text-blue-800 text-md font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
          AVG. {collectionData?.average_price && collectionData?.average_price.toFixed(2)} Ξ
        </span>
        <span className="bg-blue-100 text-blue-800 text-md font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
          FLR. {collectionData?.floor_price && collectionData?.floor_price.toFixed(2)} Ξ
        </span>
      </div>
    </div>
  );
});

export default MediaCard;
