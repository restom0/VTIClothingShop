export const NAV_SKELETON_DELAY_MS = 400;

export const NAV_SKELETON_WIDTHS = ["9.9rem", "8rem", "8.75rem", "6.6rem", "4.6rem"];

/** Gets menu items. */
export const getMenuItems = (data) => (Array.isArray(data?.object) ? data.object : []);

/** Gets dropdown column count. */
export const getDropdownColumnCount = (items) => {
  const itemCount = Array.isArray(items) ? items.length : 0;

  if (itemCount <= 0) return 1;
  return Math.min(itemCount, 3);
};

/** Gets cart items. */
export const getCartItems = (cart) =>
  Array.isArray(cart?.object?.orderItems) ? cart.object.orderItems : [];

/** Gets cart total. */
export const getCartTotal = (cart) => cart?.object?.total_price ?? 0;

/** Gets cart route. */
export const getCartRoute = (hasToken) => (hasToken ? "/cart" : "/login");

/** Gets cart unit price. */
export const getCartUnitPrice = (item) => {
  const salePrice = item?.product_id?.sale_price ?? 0;
  const discount = item?.product_id?.discount ?? 0;

  return salePrice * (1 - discount / 100);
};

/** Gets cart tooltip rows. */
export const getCartTooltipRows = (cart) =>
  getCartItems(cart).map((item) => {
    const unitPrice = getCartUnitPrice(item);
    const quantity = item?.quantity ?? 0;

    return {
      id: item.id,
      imageUrl: item?.product_id?.product_id?.image_url ?? "",
      title: item.title,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

/** Gets navbar labels. */
export const getNavbarLabels = (t) => ({
  productList: t("nav.product_list"),
  brands: t("nav.brands"),
  categories: t("nav.categories"),
  aboutUs: t("nav.about_us"),
  contact: t("nav.contact"),
  search: t("common.search"),
  cart: t("common.cart"),
  login: t("common.login"),
  mainAria: t("nav.main_aria"),
  openMenu: t("nav.open_menu"),
  closeMenu: t("nav.close_menu"),
  demoMode: t("nav.demo_mode"),
  demoModeOn: t("nav.demo_mode_on"),
  enableDemoMode: t("nav.enable_demo_mode"),
  disableDemoMode: t("nav.disable_demo_mode"),
});

/** Gets cart labels. */
export const getCartLabels = (t, itemCount) => ({
  cart: t("common.cart"),
  itemCount: t("common.items", { count: itemCount }),
  total: t("common.total"),
  productImageAlt: t("nav.cart_product_image_alt"),
});
