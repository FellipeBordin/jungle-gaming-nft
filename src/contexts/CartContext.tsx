
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import type { NFT } from '../types/nft'

interface CartItem {
  nft: NFT
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (nft: NFT) => void
  removeItem: (nftId: string) => void
  updateQuantity: (nftId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalEth: string
}

const CartContext = createContext<CartContextType | undefined>(
  undefined,
)

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(nft: NFT) {
    setItems((current) => {
      const existing = current.find(
        (item) => item.nft.id === nft.id,
      )

      if (existing) {
        return current.map((item) =>
          item.nft.id === nft.id &&
          item.quantity < nft.available
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      if (nft.available <= 0) {
        return current
      }

      return [...current, { nft, quantity: 1 }]
    })
  }

  function removeItem(nftId: string) {
    setItems((current) =>
      current.filter((item) => item.nft.id !== nftId),
    )
  }

  function updateQuantity(nftId: string, quantity: number) {
    setItems((current) =>
      current
        .map((item) => {
          if (item.nft.id !== nftId) {
            return item
          }

          return {
            ...item,
            quantity: Math.min(
              Math.max(0, Math.trunc(quantity)),
              item.nft.available,
            ),
          }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  const totalEth = (
    items.reduce(
      (total, item) =>
        total +
        Math.round(Number(item.nft.priceEth) * 100) *
          item.quantity,
      0,
    ) / 100
  ).toFixed(2)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalEth,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart deve ser utilizado dentro de CartProvider',
    )
  }

  return context
}
