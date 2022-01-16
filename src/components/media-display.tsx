import { useQuery } from "react-query";
import * as React from "react";
import { fetchHeaders } from "../lib";
import { retrieveCollectionSaleStats, retrieveNftDetails } from "../lib/nft-port-api";
import { delay } from "../utils/misc";
import { SaleStats } from "../utils/sales-data";


export const MediaDisplay = ({ url, sale_stats, contract, nft_id , owner}: { url: string, sale_stats: SaleStats,contract:string, nft_id: string, owner:string }) => {

  const [collectionData, setCollectionData] = React.useState<SaleStats|null>(null);
  const [listingPrice,setListingPrice] = React.useState<string>("");
  const [listingAsset,setListingAsset] = React.useState<string>("");

  const { data: mediaType } = useQuery([url], () => fetchHeaders({ url }), {
    enabled: !!url,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24
  });
  if (url.length === 0) return <></>;

  React.useEffect(() => {

    const fetchNftDetails = async (contract:string,nft_id:string) => {
      await delay(Math.floor(Math.random() * 30000) + 10000);
      const results = await retrieveNftDetails(
        contract as string,
        nft_id,
      );
  
      if (results.response !== 'OK') {
        await fetchNftDetails(contract,nft_id);
      } else {
        //console.log(results);
        if (results.transactions.length > 0) {

          let ownerFound = false;
          // loop through transactiosn and find address that matches owner
          for (let i = 0; i < results.transactions.length; i++) {
            // console.log("owner: ",owner);
            // console.log("lister addres: ",results.transactions[i].lister_address);
            // console.log(results.transactions[i].lister_address == owner);
            if (results.transactions[i].lister_address.toLowerCase() == owner.toLowerCase()) {
              setListingPrice(results.transactions[i].price_details.price);
              setListingAsset(results.transactions[i].price_details.asset_type);
              ownerFound = true;
              break;
            }
          }

          if (!ownerFound) {
            setListingPrice("Owner Has Not Listed Yet");
            setListingAsset("");
          }
        } else {
          console.log(results);
          setListingPrice("No Transaction History");
          setListingAsset("");
        }
      }
    };

    fetchNftDetails(contract,nft_id);

    
  }, []);

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
          className="border-0 m-4 p-2 text-left no-underline"
        >
          <video src={url} autoPlay width={300} height={300} loop />
        </a>
        {sale_stats ? <p className="">Floor Price:  {collectionData?.floor_price ?? '?'} ETH</p> : <p className="">Loading Floor Price...</p>}
        {listingPrice ? <p className="">Listing Price:  {listingPrice ?? '?'} {listingAsset ?? 
      '?'}</p> : <p className="">Loading Listing Price...</p>}
      </div>
    );
  }
  return (
    <div>
      <a
        href={url}
        target="_blank"
        className="border-0 m-4 p-2 text-left no-underline"
      >
        <img src={url} width={300} height={300} loading="lazy" />
      </a>
      {sale_stats ? <p className="">Floor Price:  {collectionData?.floor_price ?? '?'} ETH</p> : <p className="">Loading Floor Price...</p>}
      {listingPrice ? <p className="">Listing Price:  {listingPrice ?? '?'} {listingAsset ?? 
      '?'}</p> : <p className="">Loading Listing Price...</p>}
    </div>
  );
};