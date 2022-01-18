
export interface EnsSubgraphResponse {
  data: Data;
}
interface Data {
  nameQuery: Domain[];
  addressQuery: Domain[];
}

interface Domain {
  name: string;
  resolvedAddress: ResolvedAddress;
  resolver: Resolver;
}

interface ResolvedAddress {
  id: string;
}

interface Resolver {
  contentHash: string;
  texts: string[];
}
