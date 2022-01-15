import { useQuery } from "react-query";
import * as React from "react";
import { fetchHeaders } from "../lib";
import { retrieveCollectionSaleStats } from "../lib/nft-port-api";
import { delay } from "../utils/misc";
import { SaleStats } from "../utils/sales-data";


export const MediaDisplay = ({ url, sale_stats }: { url: string, sale_stats: SaleStats }) => {

  const [collectionData, setCollectionData] = React.useState<SaleStats|null>(null);

  const { data: mediaType } = useQuery([url], () => fetchHeaders({ url }), {
    enabled: !!url,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24
  });
  if (url.length === 0) return <></>;

  React.useEffect(() => {
    if(sale_stats?.floor_price >= 0) {
      setCollectionData(sale_stats);
    }
  }, [sale_stats]);

  if (!!mediaType && mediaType === 'video/mp4') {
    return (
      <div>
        <a
          href={url}
          className="border-solid border m-4 p-2 text-left no-underline"
        >
          <video src={url} autoPlay width={300} height={300} loop />
        </a>
        {sale_stats ? <p className="">Floor Price:  {collectionData?.floor_price ?? '?'} ETH</p> : <p className="">Loading Floor Price...</p>}
      </div>
    );
  }
  return (
    <div>
      <a
        href={url}
        target="_blank"
        className="border-solid border m-4 p-2 text-left no-underline"
      >
        <img src={url} width={300} height={300} loading="lazy" />
      </a>
      {sale_stats ? <p className="">Floor Price:  {collectionData?.floor_price ?? '?'} ETH</p> : <p className="">Loading Floor Price...</p>}
    </div>
  );
};