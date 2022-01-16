import * as React from 'react';
import { useQuery } from 'react-query';
import { useMounted } from '../hooks';
import { fetchHeaders } from '../lib';
import { retrieveCollectionSaleStats, retrieveNftDetails } from '../lib/nft-port-api';
import { delay, isImage } from '../utils/misc';
import { SaleStats } from '../utils/sales-data';

export const MediaDisplay = ({
  url,
  sale_stats,
  contract,
  nft_id,
  owner,
  nft
}: {
  url: string;
  sale_stats: SaleStats;
  contract: string;
  nft_id: string;
  owner: string;
  nft: any;
}) => {
  const [performFetch, setPerformFetch] = React.useState(false);
  const mounted = useMounted();
  React.useEffect(() => {
    delay(3000).then(() => {
      setPerformFetch(true);
    });
  }, []);
  //const [collectionData, setCollectionData] = React.useState<SaleStats | null>(null);
  const [listingPrice, setListingPrice] = React.useState<string>('');
  const [listingAsset, setListingAsset] = React.useState<string>('');

  const { data: mediaType } = useQuery([url], () => fetchHeaders({ url }), {
    enabled: !!url && !isImage(url)
    // onSuccess: (data) => console.log(data)
  });

  const { data: details, isFetched: isDetailsFetching } = useQuery(
    [contract, nft_id],
    async () => {
      console.log(contract, nft_id);

      const { data } = await retrieveNftDetails(contract, nft_id);
      console.log(`retrieveNftDetails: ${JSON.stringify(data, null, 2)}`);

      return data;
    },
    {
      enabled: false, // !!contract && !!nft_id,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  );

  const { data: collectionData } = useQuery(
    contract,
    async () => {
      const { statistics } = await retrieveCollectionSaleStats(contract);
      console.log(`collection: ${JSON.stringify(statistics, null, 2)}`);
      return statistics;
    },
    {
      enabled: !!contract && performFetch, // && !!details,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onSuccess: (data) => console.log(`collection: ${JSON.stringify(data, null, 2)}`)
    }
  );

  if (url.length === 0 || url === 'https://rarible.mypinata.cloud/') return <></>;

  if (isImage(url) || url.includes('metadata.ens.domains')) {
    return (
      <div>
        <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <a href={url} target="_blank" className="pb-2">
            <img src={url} loading="lazy" className="rounded-t-lg" />
          </a>
          <a
            href={url}
            target="_blank"
            className="pl-3 pt-2 text-center mb-1 font-normal text-gray-700 dark:text-gray-400 hover:text-blue-600"
          >
            {nft.name}
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
      </div>
    );
  }

  if (!!mediaType && ['video/mp4', 'video/quicktime', 'video/webm']?.includes(mediaType)) {
    return (
      <div>
        <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <a href={url} target="_blank">
            <video src={url} autoPlay loop className="rounded-t-lg text-center" />
          </a>
          <a
            href={url}
            target="_blank"
            className="pl-3 p-1 text-center mb-1 font-normal text-gray-700 dark:text-gray-400 hover:text-blue-600"
          >
            {nft.name}
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
      </div>
    );
  }
  return (
    <div>
      <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <a href={url} target="_blank">
          <img src={url} loading="lazy" className="rounded-t-lg" />
        </a>
        <a
          href={url}
          target="_blank"
          className="pl-3 p-1 text-center mb-1 font-normal text-gray-700 dark:text-gray-400 hover:text-blue-600"
        >
          {nft.name}
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
    </div>
  );
};
