const DEFAULT_PRODUCT_IMAGE = "/vti-shop-thumbnail.svg";

/** Gets first usable value. */
const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

/** Converts API response body into list. */
export const getResponseItems = (response) => {
  const object = firstValue(response?.object, response?.objects, response);
  if (Array.isArray(object)) return object;
  return object ? [object] : [];
};

/** Gets nested imported product from mixed API/mock shapes. */
export const getImportedProduct = (item) =>
  firstValue(item?.product, item?.product_id, item?.importedProduct, item?.imported_product, {});

/** Gets core product info from mixed API/mock shapes. */
export const getProductInfo = (item) => {
  const importedProduct = getImportedProduct(item);
  return firstValue(
    importedProduct?.product,
    importedProduct?.product_id,
    item?.productInfo,
    item?.product_id?.product_id,
    item?.product_id,
    item?.product,
    item,
    {}
  );
};

/** Gets product display name. */
export const getShopProductName = (item) => {
  const product = getProductInfo(item);
  return firstValue(product?.name, item?.title, item?.name, "Product");
};

/** Gets product image URL. */
export const getShopProductImageUrl = (item) => {
  const importedProduct = getImportedProduct(item);
  return firstValue(
    item?.imageUrl,
    item?.image_url,
    importedProduct?.imageUrl,
    importedProduct?.image_url,
    DEFAULT_PRODUCT_IMAGE
  );
};

/** Gets number value. */
const numberValue = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

/** Gets product price. */
export const getShopProductPrice = (item) => {
  const importedProduct = getImportedProduct(item);
  return numberValue(
    firstValue(
      item?.salePrice,
      item?.sale_price,
      item?.price,
      importedProduct?.salePrice,
      importedProduct?.sale_price,
      importedProduct?.importPrice,
      importedProduct?.import_price
    )
  );
};

/** Normalizes product card props. */
export const normalizeShopProduct = (item) => {
  const importedProduct = getImportedProduct(item);
  const product = getProductInfo(item);
  const imageUrl = getShopProductImageUrl(item);
  const price = getShopProductPrice(item);

  return {
    ...item,
    id: numberValue(firstValue(item?.id, importedProduct?.id, product?.id)),
    discount: numberValue(item?.discount),
    imageUrl,
    price,
    product_id: {
      ...importedProduct,
      image_url: imageUrl,
      imageUrl,
      product,
      product_id: product,
    },
    sale_price: price,
    salePrice: price,
    title: getShopProductName(item),
  };
};

/** Normalizes list of products for shop cards. */
export const normalizeShopProducts = (items) => items.map(normalizeShopProduct);

const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const entityMatchesSegment = (entity, segment) => {
  if (!segment) return true;
  return String(entity?.id) === String(segment) || slugify(entity?.name) === slugify(segment);
};

/** Filters products by route params. */
export const filterShopProducts = (products, { brandId, categoryId } = {}) =>
  products.filter((item) => {
    const product = getProductInfo(item);
    const brand = firstValue(product?.brand, product?.brand_id);
    const category = firstValue(product?.category, product?.category_id);
    return entityMatchesSegment(brand, brandId) && entityMatchesSegment(category, categoryId);
  });

const getCreatedValue = (item) =>
  numberValue(firstValue(item?.createdAt, item?.created_at, item?.id), 0);

/** Sorts products by current shop sort option. */
export const sortShopProducts = (products, sort) => {
  const sortedProducts = [...products];
  const collator = new Intl.Collator(undefined, { sensitivity: "base" });

  return sortedProducts.sort((left, right) => {
    if (sort === "A->Z")
      return collator.compare(getShopProductName(left), getShopProductName(right));
    if (sort === "Z->A")
      return collator.compare(getShopProductName(right), getShopProductName(left));
    if (sort === "price-asc") return getShopProductPrice(left) - getShopProductPrice(right);
    if (sort === "price-desc") return getShopProductPrice(right) - getShopProductPrice(left);
    if (sort === "old") return getCreatedValue(left) - getCreatedValue(right);
    return getCreatedValue(right) - getCreatedValue(left);
  });
};
