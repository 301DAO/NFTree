import fetch from 'isomorphic-unfetch';

// Docs: https://docs.nftport.xyz/docs
const API_KEY = process.env.NEXT_PUBLIC_NFT_PORT_KEY || '';
const NFT_PORT_ENDPOINT = 'https://api.nftport.xyz/v0';

const NftPortRequest = async (relativePath: string) => {
  const url = `${NFT_PORT_ENDPOINT}/${relativePath}`;
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_KEY
    },
    redirect: 'follow'
  };
  try {
    const response = await fetch(url, options);
    return response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Returns NFTs owned by a given account (i.e. wallet) address. Can also return each NFT metadata with 'include' parameter.
 */
export const retrieveNftsByAddress = async ({
  address,
  continuationToken,
  limit,
}: {
  address: string;
  continuationToken?: string;
  limit?: number;
}) => {
  const continuation = continuationToken
    ? `&continuation=${continuationToken}`
    : '';
  const page_size = limit ?? 12;
  const relativePath = `accounts/${address}?chain=ethereum&include=metadata&page_size=${page_size}${continuation}`;
  return NftPortRequest(relativePath);
};

/**
 * Returns details for a given NFT. These include metadata_url, metadata such as name, description, attributes, etc., image_url, cached_image_url and mint_date.
 */
export const retrieveNftDetails = async (contract: string, tokenId: string) => {
  const relativePath = `transactions/nfts/${contract}/${tokenId}?chain=ethereum&type=list`;
  return NftPortRequest(relativePath);
};

export const retrieveCollectionSaleStats = async (contract: string) => {
  const relativePath = `transactions/stats/${contract}?chain=ethereum`;
  return NftPortRequest(relativePath);
};
