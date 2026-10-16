
import { useQuery } from '@tanstack/react-query'

import { getOrders } from '../services/orders'

export function useOrders(email?: string) {
  return useQuery({
    queryKey: ['orders', email],
    queryFn: ({ signal }) =>
      getOrders(email!, signal),
    enabled: Boolean(email),
    staleTime: 0,
    refetchOnMount: 'always',
  })
}
