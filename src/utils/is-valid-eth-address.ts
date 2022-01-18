export const isValidEthAddress = (address: string) => {
  const regex = /^(0x)?[0-9a-f]{40}$/i
  return regex.test(address)
}
