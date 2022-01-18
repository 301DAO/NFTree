import { retrieveCollectionSaleStats } from '../lib/nft-port-api';
import { delay } from './misc';
import { NFT, SaleStats } from '../types';

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