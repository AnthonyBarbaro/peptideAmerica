"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/lib/commerce/types";

export type CartProduct = Pick<
  Product,
  "id" | "slug" | "name" | "sku" | "priceCents" | "sizeLabel" | "stockStatus"
>;

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem(product: CartProduct, quantity?: number): void;
  removeItem(productId: string): void;
  updateQuantity(productId: string, quantity: number): void;
  clearCart(): void;
};

export function addCartItem(
  items: CartItem[],
  product: CartProduct,
  quantity = 1,
): CartItem[] {
  const amount = Math.max(1, Math.trunc(quantity));
  const existing = items.find((item) => item.product.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + amount }
        : item,
    );
  }

  return [...items, { product, quantity: amount }];
}

export function removeCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.product.id !== productId);
}

export function updateCartItemQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  if (quantity < 1) {
    return removeCartItem(items, productId);
  }

  return items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item,
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem(product, quantity = 1) {
        set((state) => {
          return { items: addCartItem(state.items, product, quantity) };
        });
      },
      removeItem(productId) {
        set((state) => ({
          items: removeCartItem(state.items, productId),
        }));
      },
      updateQuantity(productId, quantity) {
        set((state) => ({
          items: updateCartItemQuantity(state.items, productId, quantity),
        }));
      },
      clearCart() {
        set({ items: [] });
      },
    }),
    {
      name: "peptide-america-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function getCartTotal(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + item.product.priceCents * item.quantity,
    0,
  );
}
