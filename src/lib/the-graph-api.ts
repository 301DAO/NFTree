import fetch from 'isomorphic-unfetch';

const API_KEY = process.env.NEXT_PUBLIC_THE_GRAPH_KEY;
const GRAPH_ENS_ENDPOINT = `${process.env.NEXT_PUBLIC_THE_GRAPH_URL}/ensdomains/ens`;

export const queryByName = `
  query queryByName($name: String) {
    domains(where: {name: $name}) {
      resolvedAddress {
        id
      }
      name
      resolver {
        contentHash
      }
    }
  }`;

export const queryByAddress = `
  query queryByAddress($address: String) {
    domains(where: {resolvedAddress: $address}, orderBy: createdAt, first: 5) {
      resolvedAddress {
        id
      }
      name
      resolver {
        contentHash
      }
    }
  }`;

export const queryEnsSubgraph = async ({
  name,
  address,
}: {
  name?: string;
  address?: string;
}): Promise<EnsSubgraphResponse> => {

  const variables = { address, name };

  const query = name ? queryByName : queryByAddress;
  const response = await fetch(GRAPH_ENS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await response.json();
  console.log(`queryEnsSubgraph: `, JSON.stringify(data, null, 2));

  return data;
};

export interface EnsSubgraphResponse {
  data: Data;
}

export interface Data {
  domains: Domain[];
}

export interface Domain {
  name: string;
  resolvedAddress: ResolvedAddress;
  resolver: Resolver;
}

export interface ResolvedAddress {
  id: string;
}

export interface Resolver {
  contentHash: string;
  texts: string[];
}
