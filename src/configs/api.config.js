const SHOP_LOCAL_URL = "http://127.0.0.1:8080/";
const configuredShopUrl = import.meta.env?.VITE_SHOP_API_URL ?? SHOP_LOCAL_URL;
const SHOP_URL = configuredShopUrl.endsWith("/") ? configuredShopUrl : `${configuredShopUrl}/`;
const api_routes = {
  vouchers: "voucher/",
  products: "product/",
  brands: "brand/",
  categories: "category/",
  orders: "order/",
  users: "user/",
  order_items: "order-items/",
  input_sales: "input-sale/",
  imported_products: "imported-product/",
  on_sale_products: "on-sale-product/",
  comments: "comment/",
  chat: "chat/",
  log: "log/",
};
export { SHOP_LOCAL_URL, SHOP_URL, api_routes };
