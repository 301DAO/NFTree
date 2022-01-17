import * as React from 'react';
import { useQuery } from 'react-query';
import { useMounted } from '../hooks';
import { fetchHeaders } from '../lib';
import { retrieveCollectionSaleStats } from '../lib/nft-port-api';
import { delay, isImage } from '../utils/misc';
import type { NFT } from '../utils/sales-data';
import dynamic from 'next/dynamic';
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

  const [performFetch, setPerformFetch] = React.useState(false);
  const mounted = useMounted();
  React.useEffect(() => {
    delay(3000).then(() => {
      setPerformFetch(true);
    });
  }, []);

  const { data: mediaType } = useQuery([file_url], () => fetchHeaders({ url: file_url }), {
    enabled: !!file_url && !isImage(file_url) && mounted
    // onSuccess: (data) => console.log(data)
  });

  const { data: collectionData } = useQuery(
    contract_address,
    async () => {
      const { statistics } = await retrieveCollectionSaleStats(contract_address);
      return statistics;
    },
    {
      enabled: !!contract_address && performFetch && mounted,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  );

  if (file_url.length === 0 || file_url === 'https://rarible.mypinata.cloud/') return <></>;

  return (
    <div className="flex flex-col max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="pb-0">
        <MediaComponent mediaType={mediaType ?? ''} mediaUrl={file_url} />
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
