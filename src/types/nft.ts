export interface NFT {
  cached_file_url: string;
  contract_address: string;
  creator_address: string;
  description: string;
  file_url: string;
  metadata_url: string;
  name: string;
  token_id: string;
  metadata: Metadata;
}

export interface Metadata {
  description: string;
  name: string;
  image: string;
  background_color: string;
  external_url: string;
  animation_url: string;
}
