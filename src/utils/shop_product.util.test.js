import { describe, expect, it } from "vitest";
import {
  filterShopProducts,
  getResponseItems,
  normalizeShopProduct,
  sortShopProducts,
} from "./shop_product.util";

const saleProduct = {
  createdAt: 20,
  discount: 10,
  id: 9,
  product: {
    id: 4,
    imageUrl: "/tee.png",
    product: {
      brand: { id: 2, name: "Northline" },
      category: { id: 3, name: "Tops" },
      id: 1,
      name: "Trail Tee",
    },
  },
  salePrice: 200000,
};

describe("shop product utilities", () => {
  it("unwraps common response shapes", () => {
    expect(getResponseItems({ object: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(getResponseItems({ objects: [{ id: 2 }] })).toEqual([{ id: 2 }]);
    expect(getResponseItems({ object: { id: 3 } })).toEqual([{ id: 3 }]);
    expect(getResponseItems(null)).toEqual([]);
  });

  it("normalizes camel and snake product shapes for product cards", () => {
    expect(normalizeShopProduct(saleProduct)).toMatchObject({
      discount: 10,
      imageUrl: "/tee.png",
      price: 200000,
      product_id: {
        image_url: "/tee.png",
        product_id: { name: "Trail Tee" },
      },
      sale_price: 200000,
      title: "Trail Tee",
    });
    expect(
      normalizeShopProduct({
        id: 10,
        product_id: { image_url: "/pants.png", product_id: { name: "Pants" } },
        sale_price: 150000,
      })
    ).toMatchObject({ imageUrl: "/pants.png", salePrice: 150000, title: "Pants" });
  });

  it("filters by brand and category route segments", () => {
    expect(filterShopProducts([saleProduct], { brandId: "2" })).toHaveLength(1);
    expect(filterShopProducts([saleProduct], { brandId: "northline" })).toHaveLength(1);
    expect(filterShopProducts([saleProduct], { categoryId: "tops" })).toHaveLength(1);
    expect(filterShopProducts([saleProduct], { categoryId: "missing" })).toHaveLength(0);
  });

  it("sorts by name, price, and recency", () => {
    const products = [
      normalizeShopProduct({ created_at: 1, id: 1, price: 300, title: "Beta" }),
      normalizeShopProduct({ created_at: 2, id: 2, price: 100, title: "Alpha" }),
    ];

    expect(sortShopProducts(products, "A->Z").map(({ title }) => title)).toEqual(["Alpha", "Beta"]);
    expect(sortShopProducts(products, "price-desc").map(({ price }) => price)).toEqual([300, 100]);
    expect(sortShopProducts(products, "new").map(({ id }) => id)).toEqual([2, 1]);
  });
});
