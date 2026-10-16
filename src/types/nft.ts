
export interface NFT {
  id: string
  name: string
  collection: string
  imageUrl: string
  priceEth: string
  available: number
  network: 'ethereum' | 'polygon' | 'solana'
  version: number
}

export interface NFTListResponse {
  items: NFT[]
  total: number
  page: number
  pageSize: number
}
