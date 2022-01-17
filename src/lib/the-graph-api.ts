import fetch from 'isomorphic-unfetch';
import { utils } from 'ethers';
const API_KEY = process.env.NEXT_PUBLIC_THE_GRAPH_KEY;
const GRAPH_ENS_ENDPOINT = `${process.env.NEXT_PUBLIC_THE_GRAPH_URL}/ensdomains/ens`;

const query = `
  query EnsQuery($name: String, $address: String) {
    nameQuery: domains(where: {name: $name}) {
      name
      resolvedAddress { id }
    }
    addressQuery: domains(where: {resolvedAddress: $address}, first: 1) {
      name
      resolvedAddress { id }
    }
  }
`;

/**
 * It will query the subgraph when you pass it an ens name or an address
 * if you pass an ens name it will return the address and the name
 * if you pass an address it will return the name and the address
 * you can pass it either one and leave the other one empty
 */
export const queryEnsSubgraph = async ({
  name,
  address
}: {
  name?: string;
  address?: string;
}): Promise<EnsSubgraphResponse> => {
  const variables = { address: address?.toLowerCase(), name };

  const response = await fetch(GRAPH_ENS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  const data = await response.json();
  // console.log(`queryEnsSubgraph: `, variables, JSON.stringify(data, null, 2));
  return data;
};

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
