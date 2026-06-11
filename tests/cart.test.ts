import { describe, expect, it } from "vitest";
import {
  addCartItem,
  getCartTotal,
  removeCartItem,
  updateCartItemQuantity,
  type CartProduct,
} from "../src/lib/cart-store";
import { mockProducts } from "../src/lib/commerce/mock-provider";

const product = mockProducts[0] as CartProduct;

describe("cart helpers", () => {
  it("adds an item and increments an existing item", () => {
    const first = addCartItem([], product);
    const second = addCartItem(first, product);

    expect(second).toHaveLength(1);
    expect(second[0].quantity).toBe(2);
  });

  it("updates quantity and total", () => {
    const items = updateCartItemQuantity(addCartItem([], product), product.id, 3);

    expect(items[0].quantity).toBe(3);
    expect(getCartTotal(items)).toBe(product.priceCents * 3);
  });

  it("removes items", () => {
    const items = removeCartItem(addCartItem([], product), product.id);

    expect(items).toHaveLength(0);
  });
});
