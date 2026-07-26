const DUMMY_IMAGE_URL = "/1719545334144.6924.png";
const DUMMY_AVATAR_URL = "/vti-shop-thumbnail.svg";
const DEFAULT_RESPONSE = {
  message: "Using dummy data.",
  statusCode: 200,
};

/** Handles with object. */
const withObject = (object) => ({
  ...DEFAULT_RESPONSE,
  object,
});

export const DEMO_BRANDS = [
  { id: 1, name: "VTI Basics", description: "Everyday essentials for office and streetwear." },
  { id: 2, name: "Northline", description: "Durable outdoor-inspired clothing." },
];

export const DEMO_CATEGORIES = [
  { id: 1, name: "Tops", description: "T-shirts, shirts, and light layers." },
  { id: 2, name: "Bottoms", description: "Trousers, jeans, and active pants." },
];

export const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Everyday Cotton Tee",
    short_description: "Soft cotton tee with a clean regular fit.",
    brand_id: DEMO_BRANDS[0],
    category_id: DEMO_CATEGORIES[0],
  },
  {
    id: 2,
    name: "Trail Stretch Pants",
    short_description: "Flexible pants built for travel, errands, and light trails.",
    brand_id: DEMO_BRANDS[1],
    category_id: DEMO_CATEGORIES[1],
  },
];

const COLORS = [
  { id: 1, color_code: "#111827", color_name: "Black" },
  { id: 2, color_code: "#2563eb", color_name: "Blue" },
  { id: 3, color_code: "#f8fafc", color_name: "White" },
];

const SIZES = [
  { id: 1, size: "M", height: "165-175cm", weight: "55-70kg" },
  { id: 2, size: "L", height: "170-182cm", weight: "65-82kg" },
];

const MATERIALS = [
  { id: 1, name: "Cotton" },
  { id: 2, name: "Nylon Stretch" },
];

const IMPORTED_PRODUCTS = [
  {
    id: 101,
    sku: "TEE-BLK-M",
    product_id: DEMO_PRODUCTS[0],
    color_id: COLORS[0],
    size_id: SIZES[0],
    material_id: MATERIALS[0],
    gender: "UNISEX",
    importPrice: 120000,
    importNumber: 80,
    stock: 42,
    image_url: DUMMY_IMAGE_URL,
    slider_url_1: DUMMY_IMAGE_URL,
    slider_url_2: DUMMY_IMAGE_URL,
    slider_url_3: DUMMY_IMAGE_URL,
    slider_url_4: DUMMY_IMAGE_URL,
    public_id_url: "dummy-tee-main",
    public_id_slider_url_1: "dummy-tee-1",
    public_id_slider_url_2: "dummy-tee-2",
    public_id_slider_url_3: "dummy-tee-3",
    public_id_slider_url_4: "dummy-tee-4",
  },
  {
    id: 102,
    sku: "TEE-WHT-L",
    product_id: DEMO_PRODUCTS[0],
    color_id: COLORS[2],
    size_id: SIZES[1],
    material_id: MATERIALS[0],
    gender: "UNISEX",
    importPrice: 125000,
    importNumber: 64,
    stock: 30,
    image_url: DUMMY_IMAGE_URL,
    slider_url_1: DUMMY_IMAGE_URL,
    slider_url_2: DUMMY_IMAGE_URL,
    slider_url_3: DUMMY_IMAGE_URL,
    slider_url_4: DUMMY_IMAGE_URL,
    public_id_url: "dummy-tee-white-main",
    public_id_slider_url_1: "dummy-tee-white-1",
    public_id_slider_url_2: "dummy-tee-white-2",
    public_id_slider_url_3: "dummy-tee-white-3",
    public_id_slider_url_4: "dummy-tee-white-4",
  },
  {
    id: 201,
    sku: "PANT-BLU-M",
    product_id: DEMO_PRODUCTS[1],
    color_id: COLORS[1],
    size_id: SIZES[0],
    material_id: MATERIALS[1],
    gender: "MALE",
    importPrice: 260000,
    importNumber: 50,
    stock: 21,
    image_url: DUMMY_IMAGE_URL,
    slider_url_1: DUMMY_IMAGE_URL,
    slider_url_2: DUMMY_IMAGE_URL,
    slider_url_3: DUMMY_IMAGE_URL,
    slider_url_4: DUMMY_IMAGE_URL,
    public_id_url: "dummy-pants-main",
    public_id_slider_url_1: "dummy-pants-1",
    public_id_slider_url_2: "dummy-pants-2",
    public_id_slider_url_3: "dummy-pants-3",
    public_id_slider_url_4: "dummy-pants-4",
  },
];

const ON_SALE_PRODUCTS = [
  {
    id: 1001,
    product_id: IMPORTED_PRODUCTS[0],
    sale_price: 249000,
    discount: 10,
    available_date: "2026-07-01",
    end_date: "2026-08-01",
  },
  {
    id: 1002,
    product_id: IMPORTED_PRODUCTS[1],
    sale_price: 259000,
    discount: 15,
    available_date: "2026-07-01",
    end_date: "2026-08-01",
  },
  {
    id: 2001,
    product_id: IMPORTED_PRODUCTS[2],
    sale_price: 429000,
    discount: 12,
    available_date: "2026-07-01",
    end_date: "2026-08-01",
  },
];

const CART_ITEMS = [
  { id: 1, product_id: ON_SALE_PRODUCTS[0], quantity: 2 },
  { id: 2, product_id: ON_SALE_PRODUCTS[2], quantity: 1 },
];

/** Gets line total. */
const getLineTotal = ({ product_id: product, quantity }) =>
  product.sale_price * (1 - product.discount / 100) * quantity;

export const DEMO_CART = {
  id: 7001,
  total_price: CART_ITEMS.reduce((total, item) => total + getLineTotal(item), 0),
  orderItems: CART_ITEMS,
};

const ORDERS = [
  {
    id: 7001,
    order_code: "ORD-DEMO-001",
    receiver_name: "Demo Customer",
    address: "123 Sample Street",
    phone_number: "0900000000",
    total_price: DEMO_CART.total_price,
    payment_method: "COD",
    payment_status: "PENDING",
    orderItems: CART_ITEMS,
    created_at: "2026-07-10",
  },
  {
    id: 7002,
    order_code: "ORD-DEMO-002",
    receiver_name: "Sample Buyer",
    address: "456 Preview Avenue",
    phone_number: "0911111111",
    total_price: 429000,
    payment_method: "CARD",
    payment_status: "COMPLETED",
    orderItems: [{ id: 3, product_id: ON_SALE_PRODUCTS[2], quantity: 1 }],
    created_at: "2026-07-11",
  },
];

const INPUT_SALES = [
  {
    id: 1,
    filter: "PRODUCT",
    filter_id: DEMO_PRODUCTS[0].id,
    salePercentage: 160,
    discount: 10,
    available_date: "2026-07-01",
    end_date: "2026-08-01",
  },
  {
    id: 2,
    filter: "CATEGORY",
    filter_id: DEMO_CATEGORIES[1].id,
    salePercentage: 170,
    discount: 12,
    available_date: "2026-07-05",
    end_date: "2026-08-05",
  },
];

const VOUCHERS = [
  {
    id: 1,
    code: "DEMO10",
    value: 10,
    stock: 100,
    available_date: "2026-07-01",
    expired_date: "2026-08-31",
  },
  {
    id: 2,
    code: "FREESHIP",
    value: 5,
    stock: 50,
    available_date: "2026-07-01",
    expired_date: "2026-09-15",
  },
];

const USERS = [
  { id: 1, name: "Demo Admin", username: "admin.demo", role: "ADMIN", status: "ACTIVE" },
  { id: 2, name: "Demo User", username: "user.demo", role: "USER", status: "ACTIVE" },
];

export const DEMO_USER_PROFILE = {
  id: 2,
  name: "Demo User",
  username: "user.demo",
  email: "demo.user@example.com",
  gender: "MALE",
  phone_number: "0900000000",
  address: "123 Sample Street",
  birthday: "1998-01-15",
  avatar_url: DUMMY_AVATAR_URL,
  public_id_avatar_url: "dummy-avatar",
};

const COMMENTS = [
  {
    id: 1,
    username: "user.demo",
    star: 5,
    content: "Comfortable fit and clean stitching.",
    created_at: "2026-07-10",
  },
  {
    id: 2,
    username: "sample.buyer",
    star: 4,
    content: "Good value for daily wear.",
    created_at: "2026-07-11",
  },
];

const CHATS = [
  {
    id: 1,
    username: "user.demo",
    feedback: "Need size advice.",
    answer: "Choose M for 165-175cm.",
  },
  {
    id: 2,
    username: "sample.buyer",
    feedback: "Is COD available?",
    answer: "Yes, COD is supported.",
  },
];

const LOGS = [
  { id: 1, role: "ADMIN", action: "Viewed dashboard", date: "2026-07-11" },
  { id: 2, role: "USER", action: "Created demo order", date: "2026-07-11" },
];

const STATS = {
  monthlyIncome: {
    2025: [
      1200000, 1450000, 1620000, 1400000, 1880000, 2100000, 1950000, 2200000, 2380000, 2500000,
      2700000, 3100000,
    ],
    2026: [1600000, 1780000, 1920000, 2250000, 2480000, 2660000, 2900000, 0, 0, 0, 0, 0],
  },
  generalStats: {
    income: 14500000,
    order: 128,
    completed: 96,
    user: 420,
    product: 184,
    soldProduct: 312,
  },
};

/** Gets path. */
const getPath = (args) => {
  if (typeof args === "string") return args;
  if (args?.filter) return [args.filter, args.id].filter(Boolean).join("/");
  return args?.url ?? "";
};

/** Gets id from args. */
const getIdFromArgs = (args) => {
  const id = Number(getPath(args).split("/").findLast(Boolean));
  return Number.isNaN(id) ? null : id;
};

/** Finds by id. */
const findById = (items, args) => items.find((item) => item.id === getIdFromArgs(args)) ?? items[0];

/** Filters imported products. */
const filterImportedProducts = (args) => {
  const [filter = "ALL", rawId] = getPath(args).split("/");
  const id = Number(rawId);

  if (filter === "PRODUCT") return IMPORTED_PRODUCTS.filter((item) => item.product_id.id === id);
  if (filter === "BRAND")
    return IMPORTED_PRODUCTS.filter((item) => item.product_id.brand_id.id === id);
  if (filter === "CATEGORY")
    return IMPORTED_PRODUCTS.filter((item) => item.product_id.category_id.id === id);
  if (filter === "COLOR") return IMPORTED_PRODUCTS.filter((item) => item.color_id.id === id);
  if (filter === "SIZE") return IMPORTED_PRODUCTS.filter((item) => item.size_id.id === id);
  if (filter === "MATERIAL") return IMPORTED_PRODUCTS.filter((item) => item.material_id.id === id);

  return IMPORTED_PRODUCTS;
};

/** Gets on sale product detail. */
const getOnSaleProductDetail = (args) => {
  const selected = findById(ON_SALE_PRODUCTS, args);
  const productId = selected?.product_id?.product_id?.id;

  return ON_SALE_PRODUCTS.filter((item) => item.product_id.product_id.id === productId);
};

export const DEMO_READ_RESPONSES = {
  account: {
    /** Gets account. */
    getAccount: () => withObject(DEMO_USER_PROFILE),
  },
  brand: {
    /** Gets brands. */
    getBrands: () => withObject(DEMO_BRANDS),
    /** Gets brand. */
    getBrand: (args) => withObject(findById(DEMO_BRANDS, args)),
  },
  category: {
    /** Gets categories. */
    getCategories: () => withObject(DEMO_CATEGORIES),
    /** Gets category. */
    getCategory: (args) => withObject(findById(DEMO_CATEGORIES, args)),
  },
  chat: {
    /** Gets chats. */
    getChats: () => withObject(CHATS),
    /** Gets chat. */
    getChat: (args) => withObject(findById(CHATS, args)),
  },
  comment: {
    /** Gets comments. */
    getComments: () => COMMENTS,
    /** Gets comment. */
    getComment: (args) => findById(COMMENTS, args),
  },
  importedProduct: {
    /** Gets imported products. */
    getImportedProducts: () => withObject(IMPORTED_PRODUCTS),
    /** Gets imported product. */
    getImportedProduct: (args) => withObject(filterImportedProducts(args)),
    /** Gets colors. */
    getColors: () => withObject(COLORS),
    /** Gets sizes. */
    getSizes: () => withObject(SIZES),
    /** Gets materials. */
    getMaterials: () => withObject(MATERIALS),
  },
  inputSale: {
    /** Gets input sales. */
    getInputSales: () => withObject(INPUT_SALES),
    /** Gets input sale. */
    getInputSale: (args) => withObject(findById(INPUT_SALES, args)),
  },
  log: {
    /** Gets logs. */
    getLogs: () => ({ ...DEFAULT_RESPONSE, objects: LOGS }),
  },
  onSaleProduct: {
    /** Gets on sale products. */
    getOnSaleProducts: () => withObject(ON_SALE_PRODUCTS),
    /** Gets on sale product. */
    getOnSaleProduct: (args) => withObject(getOnSaleProductDetail(args)),
  },
  order: {
    /** Gets orders. */
    getOrders: () => withObject(ORDERS),
    /** Gets orders by user. */
    getOrdersByUser: () => withObject(ORDERS),
    /** Gets cart. */
    getCart: () => withObject(DEMO_CART),
  },
  orderItem: {
    /** Gets order items. */
    getOrderItems: () => withObject(CART_ITEMS),
    /** Gets order items by order. */
    getOrderItemsByOrder: () => withObject(CART_ITEMS),
    /** Gets order item by order. */
    getOrderItemByOrder: (args) => withObject(findById(CART_ITEMS, args)),
  },
  product: {
    /** Gets products. */
    getProducts: () => withObject(DEMO_PRODUCTS),
    /** Gets product. */
    getProduct: (args) => withObject(findById(DEMO_PRODUCTS, args)),
  },
  stat: {
    /** Gets stat. */
    getStat: () => withObject(STATS),
  },
  user: {
    /** Gets users. */
    getUsers: () => withObject(USERS),
    /** Gets user profile. */
    getUserProfile: () => withObject(DEMO_USER_PROFILE),
  },
  voucher: {
    /** Gets vouchers. */
    getVouchers: () => withObject(VOUCHERS),
    /** Gets voucher. */
    getVoucher: (args) => withObject(findById(VOUCHERS, args)),
    /** Gets voucher by code. */
    getVoucherByCode: () => withObject(VOUCHERS[0]),
    /** Gets available vouchers. */
    getAvailableVouchers: () => withObject(VOUCHERS),
  },
};

/** Gets demo read response. */
export const getDemoReadResponse = (resource, endpoint, args) =>
  DEMO_READ_RESPONSES[resource]?.[endpoint]?.(args);

/** Gets demo mutation response. */
export const getDemoMutationResponse = (resource, endpoint) => ({
  ...DEFAULT_RESPONSE,
  demo: true,
  message: `Demo mode accepted ${resource}.${endpoint}.`,
});
