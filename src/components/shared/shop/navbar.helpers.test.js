import { describe, expect, it } from "vitest";
import {
  NAV_SKELETON_DELAY_MS,
  NAV_SKELETON_WIDTHS,
  getCartItems,
  getCartLabels,
  getCartRoute,
  getCartTooltipRows,
  getCartTotal,
  getCartUnitPrice,
  getDropdownColumnCount,
  getMenuItems,
  getNavbarLabels,
} from "./navbar.helpers";

const cartItem = {
  id: 7,
  title: "T-shirt",
  quantity: 2,
  product_id: {
    sale_price: 100000,
    discount: 25,
    product_id: {
      image_url: "/shirt.jpg",
    },
  },
};

describe("navbar helpers", () => {
  it("normalizes dropdown data and column counts", () => {
    expect(getMenuItems({ object: [{ id: 1, name: "Nike" }] })).toEqual([{ id: 1, name: "Nike" }]);
    expect(getMenuItems({})).toEqual([]);
    expect(getDropdownColumnCount([])).toBe(1);
    expect(getDropdownColumnCount([1, 2])).toBe(2);
    expect(getDropdownColumnCount([1, 2, 3, 4])).toBe(3);
  });

  it("builds cart display data", () => {
    const cart = {
      object: {
        orderItems: [cartItem],
        total_price: 150000,
      },
    };

    expect(getCartItems(cart)).toEqual([cartItem]);
    expect(getCartTotal(cart)).toBe(150000);
    expect(getCartUnitPrice(cartItem)).toBe(75000);
    expect(getCartTooltipRows(cart)).toEqual([
      {
        id: 7,
        imageUrl: "/shirt.jpg",
        title: "T-shirt",
        quantity: 2,
        unitPrice: 75000,
        lineTotal: 150000,
      },
    ]);
  });

  it("formats routes and labels", () => {
    const t = (key, params) => (params ? `${key}:${params.count}` : key);

    expect(getCartRoute(true)).toBe("/cart");
    expect(getCartRoute(false)).toBe("/login");
    expect(getNavbarLabels(t)).toMatchObject({
      search: "common.search",
      demoMode: "nav.demo_mode",
      demoModeOn: "nav.demo_mode_on",
      enableDemoMode: "nav.enable_demo_mode",
      disableDemoMode: "nav.disable_demo_mode",
    });
    expect(getCartLabels(t, 4)).toEqual({
      cart: "common.cart",
      itemCount: "common.items:4",
      total: "common.total",
      productImageAlt: "nav.cart_product_image_alt",
    });
  });

  it("exposes reusable navbar loading and layout constants", () => {
    expect(NAV_SKELETON_DELAY_MS).toBeGreaterThan(0);
    expect(NAV_SKELETON_WIDTHS).toHaveLength(5);
  });
});
