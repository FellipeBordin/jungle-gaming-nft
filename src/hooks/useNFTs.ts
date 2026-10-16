
import { useQuery } from '@tanstack/react-query'
import { getNFTs, type NFTFilters } from '../services/nfts'

export function useNFTs(filters: NFTFilters) {
  return useQuery({
    queryKey: ['nfts', filters],
    queryFn: ({ signal }) => getNFTs(filters, signal),
  })
}
