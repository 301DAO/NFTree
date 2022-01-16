import { retrieveCollectionSaleStats } from '../lib/nft-port-api';
import { delay } from './misc';

export interface NFT {
  cached_file_url: string;
  contract_address: string;
  creator_address: string;
  description: string;
  file_url: string;
  metadata: any;
  metadata_url: string;
  name: string;
  token_id: string;
}

export interface SaleStatsResponse {
  response: string;
  statistics: SaleStats;
}

export interface SaleStats {
  one_day_volume: number;
  one_day_change: number;
  one_day_sales: number;
  one_day_average_price: number;
  seven_day_volume: number;
  seven_day_change: number;
  seven_day_sales: number;
  seven_day_average_price: number;
  thirty_day_volume: number;
  thirty_day_change: number;
  thirty_day_sales: number;
  thirty_day_average_price: number;
  total_volume: number;
  total_sales: number;
  total_supply: number;
  total_minted: number;
  num_owners: number;
  average_price: number;
  market_cap: number;
  floor_price: number;
}

export const uniqueContractAddresses = (nfts: NFT[]) => {
  return [...new Set(nfts?.map(nft => nft.contract_address))];
}

export const getCollectionSalesData = async (
  page: any,
  collectionData: any,
  setCollectionData: any
) => {
  // get all unique contract addresses
  const contractAddresses = new Set<string>(
    page?.map((nft: NFT) => nft.contract_address)
  );
  const uniqueContractAddresses = Array.from(contractAddresses);

  const newCollectionData: Record<string, SaleStats> = JSON.parse(
    JSON.stringify(collectionData)
  );

  const fetchSaleData = async (contract_address: string) => {
    await delay(Math.floor(Math.random() * 5000) + 1000);
    const saleDataResult = await retrieveCollectionSaleStats(
      contract_address as string
    );

    if (saleDataResult.response !== 'OK') {
      await fetchSaleData(contract_address);
    } else {
      if (saleDataResult.statistics) {
        newCollectionData[contract_address] = saleDataResult.statistics;
      }
    }
  };

  // loop through all unique contract addresses and get sale data
  for (const contractAddresses of uniqueContractAddresses) {
    await fetchSaleData(contractAddresses);
  }

  setCollectionData(newCollectionData);
};