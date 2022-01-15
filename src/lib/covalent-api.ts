import { base64Encode } from '@/utils/misc'

const COVALENT_ENDPOINT = 'https://api.covalenthq.com/v1'
const COVALENT_API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY || ''
// Ethereum's chain ID
const CHAIN_ID = 1

const CovalentRequest = async (relativePath: string) => {
  const url = `${COVALENT_ENDPOINT}/${CHAIN_ID}/${relativePath}`
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${base64Encode(COVALENT_API_KEY)}`,
    },
    redirect: 'follow',
  }
  try {
    const response = await fetch(url, options)
    return response.json()
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * retrieve past transactions for a given address
 * @param address accepts ethereum address or ENS name
 * @param limit number of transactions to return, default is 0 which means no limit
 */
export const getTransactionsForAddress = async ({
  address,
  limit = 1,
}: {
  address: string
  limit?: number
}) => {
  const primer = JSON.stringify(PRIMER)
  const relativePath = `address/${address}/transactions_v2/?limit=${limit}`
  return await CovalentRequest(relativePath)
}

/**
 * retrieve transaction logs given a transaction hash
 * @param hash: transaction hash
 */
export const getTransaction = async (hash: string) => {
  const relativePath = `transactions_v2/${hash}`
  return await CovalentRequest(relativePath)
}

export const getHistoricalPortfolioValue = async (address: string) => {
  const relativePath = `address/${address}/portfolio_v2/`
  return CovalentRequest(relativePath)
}

/**
 * retrieve past transactions for a given address
 * @param address accepts ethereum address or ENS name
 * @param limit number of transactions to return, default is 0 which means no limit
 * @param contractAddress smart contract address
 */
export const getERC20tokenTransfersForAddress = async ({
  address,
  limit = 0,
  contractAddress,
}: {
  address: string
  limit?: number
  contractAddress?: string
}) => {
  const relativePath = `address/${address}/transfers_v2/?contract-address=${contractAddress}&limit=${limit}`
  return CovalentRequest(relativePath)
}

// https://www.covalenthq.com/docs/developer/primer/
const PRIMER = [
  {
    $match: {
      log_events: {
        $elemMatch: {
          'decoded.name': {
            $in: [
              'Transfer',
              'WithdrawalRequested',
              'Approval',
              'TransferSingle',
              'ClaimVolts',
              'OrderCancelled',
              'ReMint',
              'Trade',
              'Withdrawal',
              'Redeem',
              'Print',
              'TransactionEnqueued',
              'Claim',
              'ApprovalForAll',
              'NameRenewed',
              'Deposit',
              'ProviderLastClaimTimeUpdated',
              'Upgraded',
              'DelegateChanged',
              'NameRegistered',
              'Mint',
              'NameBid',
              'NameClaimed',
            ],
          },
        },
      },
    },
  },
  {
    $group: {
      _id: {
        log_events: 'log_events',
        successful: 'successful',
      },
    },
  },
]
