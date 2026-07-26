import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => {
  const entries = new Map([["token", "client-token"]]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => entries.get(key) ?? null,
      setItem: (key, value) => entries.set(key, String(value)),
      removeItem: (key) => entries.delete(key),
      clear: () => entries.clear(),
    },
  });
  return entries;
});

import { accountApi } from "./account.api";
import { brandApi } from "./brand.api";
import { categoryApi } from "./category.api";
import { chatApi } from "./chat.api";
import { commentApi } from "./comment.api";
import { importedProductApi } from "./import_product.api";
import { InputSaleApi } from "./input_on_sale.api";
import { logApi } from "./log.api";
import { onSaleProductApi } from "./on_sale_product.api";
import { OrderApi } from "./order.api";
import { OrderItemApi } from "./order_item.api";
import { ProductApi } from "./product.api";
import { StatApi } from "./statistic.api";
import { userApi } from "./user.api";
import { voucherApi } from "./voucher.api";
import { STORAGE_KEYS } from "../constants/storage.constant";

const apiModules = [
  accountApi,
  brandApi,
  categoryApi,
  chatApi,
  commentApi,
  importedProductApi,
  InputSaleApi,
  logApi,
  onSaleProductApi,
  OrderApi,
  OrderItemApi,
  ProductApi,
  StatApi,
  userApi,
  voucherApi,
];

const okResponse = (body = { status: 200, object: [{ id: 99, name: "live" }] }) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

const errorResponse = () =>
  new Response(JSON.stringify({ message: "offline" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });

const requestInfo = () => {
  const request = fetch.mock.calls.at(-1)?.[0];
  return {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  };
};

const createStoreFor = (api) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });

const dispatchEndpoint = async (api, endpoint, arg) => {
  const store = createStoreFor(api);
  const result = await store.dispatch(api.endpoints[endpoint].initiate(arg));
  store.dispatch(api.util.resetApiState());
  return result;
};

beforeEach(() => {
  storage.clear();
  storage.set("token", "client-token");
  globalThis.fetch = vi.fn(async () => okResponse());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RTK Query API wrappers", () => {
  it("registers every API reducer path", () => {
    expect(apiModules.map((api) => api.reducerPath)).toEqual([
      "AccountApi",
      "brandApi",
      "categoryApi",
      "chatApi",
      "CommentApi",
      "importedProductApi",
      "InputSaleApi",
      "logApi",
      "onSaleProductApi",
      "OrderApi",
      "OrderItemApi",
      "ProductApi",
      "StatApi",
      "userApi",
      "voucherApi",
    ]);
  });

  it("adds bearer tokens through prepareHeaders and falls back to dummy data for failed reads", async () => {
    fetch.mockResolvedValue(errorResponse());

    const result = await dispatchEndpoint(brandApi, "getBrands");

    expect(result.data.object[0].name).toBe("VTI Basics");
    expect(requestInfo().headers.authorization).toBe("Bearer client-token");
  });

  it.each([
    [accountApi, "getAccount", undefined, "object"],
    [categoryApi, "getCategory", 2, "object"],
    [chatApi, "getChat", 1, "object"],
    [commentApi, "getComments", undefined, 0],
    [importedProductApi, "getImportedProduct", { filter: "PRODUCT", id: 1 }, "object"],
    [InputSaleApi, "getInputSale", 1, "object"],
    [logApi, "getLogs", undefined, "objects"],
    [onSaleProductApi, "getOnSaleProduct", 1001, "object"],
    [OrderApi, "getCart", undefined, "object"],
    [OrderItemApi, "getOrderItemByOrder", 7001, "object"],
    [ProductApi, "getProduct", 1, "object"],
    [StatApi, "getStat", undefined, "object"],
    [userApi, "getUserProfile", undefined, "object"],
    [voucherApi, "getVoucherByCode", "DEMO10", "object"],
  ])("returns dummy data for %s.%s read failures", async (api, endpoint, arg, expectedKey) => {
    fetch.mockResolvedValue(errorResponse());

    const result = await dispatchEndpoint(api, endpoint, arg);

    expect(result.error).toBeUndefined();
    if (typeof expectedKey === "number") {
      expect(result.data[expectedKey]).toBeTruthy();
    } else {
      expect(result.data).toHaveProperty(expectedKey);
    }
  });

  it("uses live read responses without replacing them with dummy data", async () => {
    fetch.mockResolvedValue(okResponse({ statusCode: 200, object: [{ id: 42, name: "live" }] }));

    const result = await dispatchEndpoint(brandApi, "getBrands");

    expect(result.data.object[0]).toEqual({ id: 42, name: "live" });
  });

  it("uses demo read data immediately while demo mode is enabled", async () => {
    storage.set(STORAGE_KEYS.DEMO_MODE, "enabled");

    const result = await dispatchEndpoint(brandApi, "getBrands");

    expect(result.data.object[0].name).toBe("VTI Basics");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("accepts demo mutations without touching the live API", async () => {
    storage.set(STORAGE_KEYS.DEMO_MODE, "enabled");

    const result = await dispatchEndpoint(OrderItemApi, "createOrderItem", {
      order_id: 7001,
      product_id: 1001,
      quantity: 1,
    });

    expect(result.data).toMatchObject({ demo: true, statusCode: 200 });
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    ["PRODUCT", 1, "Everyday Cotton Tee"],
    ["BRAND", 1, "Everyday Cotton Tee"],
    ["CATEGORY", 1, "Everyday Cotton Tee"],
    ["COLOR", 1, "Everyday Cotton Tee"],
    ["SIZE", 1, "Everyday Cotton Tee"],
    ["MATERIAL", 1, "Everyday Cotton Tee"],
    ["ALL", undefined, "Everyday Cotton Tee"],
  ])("filters imported-product fallback by %s", async (filter, id, expectedName) => {
    fetch.mockResolvedValue(errorResponse());

    const result = await dispatchEndpoint(importedProductApi, "getImportedProduct", {
      filter,
      id,
    });

    expect(result.data.object[0].product_id.name).toBe(expectedName);
  });

  it.each([
    [importedProductApi, "getColors", undefined, "color_name", "Black"],
    [importedProductApi, "getSizes", undefined, "size", "M"],
    [importedProductApi, "getMaterials", undefined, "name", "Cotton"],
    [OrderApi, "getOrders", undefined, "order_code", "ORD-DEMO-001"],
    [OrderApi, "getOrdersByUser", 2, "receiver_name", "Demo Customer"],
    [OrderItemApi, "getOrderItems", undefined, "quantity", 2],
    [OrderItemApi, "getOrderItemsByOrder", 7001, "quantity", 2],
    [voucherApi, "getAvailableVouchers", undefined, "code", "DEMO10"],
    [voucherApi, "getVoucher", "bad-id", "code", "DEMO10"],
  ])("covers additional dummy fallback endpoint %s.%s", async (api, endpoint, arg, key, value) => {
    fetch.mockResolvedValue(errorResponse());

    const result = await dispatchEndpoint(api, endpoint, arg);
    const fallbackObject = Array.isArray(result.data.object)
      ? result.data.object[0]
      : result.data.object;

    expect(fallbackObject[key]).toBe(value);
  });

  it("does not use dummy read fallback for failed mutations", async () => {
    fetch.mockResolvedValue(errorResponse());

    const result = await dispatchEndpoint(brandApi, "addBrand", {
      description: "Outdoor",
      name: "Northline",
    });

    expect(result.error.status).toBe(503);
  });

  it.each([
    [
      accountApi,
      "login",
      { username: "ada", password: "secret" },
      { url: "/login", method: "POST", body: { username: "ada", password: "secret" } },
    ],
    [
      brandApi,
      "updateBrand",
      { id: 7, name: "Northline", description: "Outdoor" },
      { url: "/7", method: "PUT", body: { name: "Northline", description: "Outdoor" } },
    ],
    [categoryApi, "deleteCategory", 3, { url: "/3", method: "DELETE" }],
    [
      chatApi,
      "replyChat",
      { id: 4, message: "Done" },
      { url: "/reply/4", method: "POST", body: { message: "Done" } },
    ],
    [
      commentApi,
      "addComment",
      { product_id: 1, content: "Nice", star: 5 },
      { url: "/", method: "POST", body: { product_id: 1, content: "Nice", star: 5 } },
    ],
    [
      importedProductApi,
      "updateImportedProduct",
      { id: 8, product_id: 1, importNumber: 10 },
      { url: "/8", method: "PUT" },
    ],
    [
      InputSaleApi,
      "createInputSale",
      { filter: "ALL", filter_id: 0, salePercentage: 150, discount: 10 },
      { url: "/", method: "POST" },
    ],
    [
      OrderApi,
      "updateOrder",
      { id: 9, product_id: 5, quantity: 2 },
      { url: "/9", method: "PUT", body: { product_id: 5, quantity: 2 } },
    ],
    [
      OrderItemApi,
      "createOrderItem",
      { order_id: 1, product_id: 2, quantity: 3 },
      { url: "/", method: "POST", body: { order_id: 1, product_id: 2, quantity: 3 } },
    ],
    [
      ProductApi,
      "createProduct",
      { name: "Tee", short_description: "Cotton", brand_id: 1, category_id: 2 },
      {
        url: "/",
        method: "POST",
        body: { name: "Tee", short_description: "Cotton", brand_id: 1, category_id: 2 },
      },
    ],
    [
      userApi,
      "updatePassword",
      { oldPassword: "old", newPassword: "new" },
      { url: "/password", method: "PUT", body: { oldPassword: "old", newPassword: "new" } },
    ],
    [
      voucherApi,
      "updateVoucher",
      { id: 2, code: "SAVE", input_stock: 10, value: 15 },
      { url: "/2", method: "PUT" },
    ],
  ])("builds mutation request for %s.%s", async (api, endpoint, arg, expected) => {
    await dispatchEndpoint(api, endpoint, arg);

    const request = fetch.mock.calls.at(-1)[0];
    const requestBody = request.body ? JSON.parse(await request.text()) : undefined;
    expect(request.url).toContain(expected.url);
    expect(request.method).toBe(expected.method);
    if (expected.body) {
      expect(requestBody).toEqual(expected.body);
    }
  });
});
