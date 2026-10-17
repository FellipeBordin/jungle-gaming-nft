import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createOrder } from "../services/orders";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}
