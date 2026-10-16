
import { useMutation } from '@tanstack/react-query'

import { createOrder } from '../services/orders'

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}
