import { utils } from "ethers"

export const isValidEthAddress = (address: string) => {
  const regex = /^0x[a-fA-F0-9]{40}$/i
  return regex.test(address)
}

export const isValidEnsName = (name: string) => {
  const regex = /^[a-z][a-z0-9]*(\.eth)$/i
  return regex.test(name)
}