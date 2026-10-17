import { createContext } from "react";
import type { NFT } from "../types/nft";

export interface CartItem {
  nft: NFT;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (nft: NFT) => void;
  removeItem: (nftId: string) => void;
  updateQuantity: (nftId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalEth: string;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
