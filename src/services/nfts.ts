
import { api } from './api'
import type { NFTListResponse } from '../types/nft'


export interface NFTFilters {
  search: string
  page: number
  network: 'all' | 'ethereum' | 'polygon' | 'solana'
  sort: 'newest' | 'price_asc' | 'price_desc'
}

export async function getNFTs(
  filters: NFTFilters,
  signal?: AbortSignal,
): Promise<NFTListResponse> {
  const response = await api.get<NFTListResponse>('/nfts', {
    params: filters,
    signal,
  })

  return response.data
}
