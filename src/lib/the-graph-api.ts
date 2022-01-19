import fetch from 'isomorphic-unfetch';
import type { EnsSubgraphResponse } from '../types/the-graph';

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
  const variables = { address: address?.toLowerCase(), name: name?.toLowerCase() };

  const response = await fetch(GRAPH_ENS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  const data = await response.json();
  return data;
};
