import { api } from "./api";

export type OrderStatus = "pending" | "confirmed" | "rejected";

export interface CreateOrderPayload {
  name: string;
  email: string;
  wallet: string;
  items: {
    nftId: string;
    quantity: number;
  }[];
}

export interface OrderResponse {
  id: string;
  status: OrderStatus;
  message: string;
}

export interface Order {
  id: string;
  name: string;
  email: string;
  wallet: string;
  items: {
    nftId: string;
    quantity: number;
  }[];
  status: OrderStatus;
  createdAt: string;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  const response = await api.post<OrderResponse>("/orders", payload);

  return response.data;
}

export async function getOrders(
  email: string,
  signal?: AbortSignal,
): Promise<Order[]> {
  const response = await api.get<Order[]>("/orders", {
    params: { email },
    signal,
  });

  return response.data;
}
