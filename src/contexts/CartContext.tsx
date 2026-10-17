import { useEffect, useState, type ReactNode } from "react";

import type { NFT } from "../types/nft";
import type { CartItem } from "./cart-context";

import { CartContext } from "./cart-context";
import { useAuth } from "../hooks/useAuth";

const GUEST_CART_KEY = "kurio_cart_guest";

function getCartKey(userId: string | null) {
  return userId ? `kurio_cart_user_${userId}` : GUEST_CART_KEY;
}

function readCart(key: string): CartItem[] {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((value): CartItem[] => {
      if (!value || typeof value !== "object") {
        return [];
      }

      const item = value as Partial<CartItem>;
      const nft = item.nft;

      if (
        !nft ||
        typeof nft.id !== "string" ||
        typeof nft.available !== "number" ||
        !Number.isFinite(nft.available) ||
        !Number.isFinite(Number(nft.priceEth)) ||
        typeof item.quantity !== "number" ||
        !Number.isFinite(item.quantity)
      ) {
        return [];
      }

      const quantity = Math.min(
        Math.max(0, Math.trunc(item.quantity)),
        Math.max(0, Math.trunc(nft.available)),
      );

      return quantity > 0 ? [{ nft, quantity }] : [];
    });
  } catch {
    return [];
  }
}

function mergeCarts(
  accountItems: CartItem[],
  guestItems: CartItem[],
): CartItem[] {
  const merged = [...accountItems];

  for (const guestItem of guestItems) {
    const existingIndex = merged.findIndex(
      (item) => item.nft.id === guestItem.nft.id,
    );

    if (existingIndex === -1) {
      merged.push(guestItem);
      continue;
    }

    const existing = merged[existingIndex];

    merged[existingIndex] = {
      ...existing,
      quantity: Math.min(
        existing.quantity + guestItem.quantity,
        existing.nft.available,
      ),
    };
  }

  return merged;
}

function CartSessionProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string | null;
}) {
  const storageKey = getCartKey(userId);

  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = readCart(storageKey);

    if (!userId) {
      return savedItems;
    }

    const guestItems = readCart(GUEST_CART_KEY);

    return mergeCarts(savedItems, guestItems);
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));

      if (userId) {
        localStorage.removeItem(GUEST_CART_KEY);
      }
    } catch (error) {
      console.error("Não foi possível salvar o carrinho:", error);
    }
  }, [items, storageKey, userId]);

  function addItem(nft: NFT) {
    setItems((current) => {
      const existing = current.find((item) => item.nft.id === nft.id);

      if (existing) {
        return current.map((item) =>
          item.nft.id === nft.id && item.quantity < nft.available
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      if (nft.available <= 0) {
        return current;
      }

      return [
        ...current,
        {
          nft,
          quantity: 1,
        },
      ];
    });
  }

  function removeItem(nftId: string) {
    setItems((current) => current.filter((item) => item.nft.id !== nftId));
  }

  function updateQuantity(nftId: string, quantity: number) {
    setItems((current) =>
      current
        .map((item) => {
          if (item.nft.id !== nftId) {
            return item;
          }

          return {
            ...item,
            quantity: Math.min(
              Math.max(0, Math.trunc(quantity)),
              item.nft.available,
            ),
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalEth = (
    items.reduce(
      (total, item) =>
        total + Math.round(Number(item.nft.priceEth) * 100) * item.quantity,
      0,
    ) / 100
  ).toFixed(2);

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
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const userId = user?.id ?? null;

  return (
    <CartSessionProvider key={userId ?? "guest"} userId={userId}>
      {children}
    </CartSessionProvider>
  );
}
