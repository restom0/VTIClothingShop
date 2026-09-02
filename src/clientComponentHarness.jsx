import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, vi } from "vitest";

const harness = vi.hoisted(() => {
  const rendered = [];
  const dispatch = vi.fn();
  const navigate = vi.fn();
  const setLanguage = vi.fn();
  const setSeason = vi.fn();
  const setTheme = vi.fn();
  const mutation = vi.fn(() => ({
    data: { statusCode: 200 },
    unwrap: vi.fn(async () => ({ data: { statusCode: 200 } })),
  }));

  const createComponent = (ReactModule, name, tag = "div") => {
    const MockComponent = (componentProps) => {
      rendered.push({ name, props: componentProps });
      const { children, content, label, value, href, role, to } = componentProps;
      const elementProps = {};
      if (href || to) elementProps.href = href ?? to;
      if (role) elementProps.role = role;
      const primitiveValue = typeof value === "string" || typeof value === "number" ? value : name;

      return ReactModule.createElement(
        tag,
        elementProps,
        children ?? label ?? content ?? primitiveValue
      );
    };
    MockComponent.displayName = `Mock${name}`;

    return MockComponent;
  };

  return {
    apiState: {},
    createComponent,
    dispatch,
    moduleFactory: async (names, tag = "div") => {
      const ReactModule = await import("react");

      return Object.fromEntries(
        names.map((name) => [name, createComponent(ReactModule, name, tag)])
      );
    },
    navigate,
    mutation,
    rendered,
    reduxState: {
      active: { value: 1 },
      openAccordion: { value: 0 },
      selectedId: { value: 1 },
      sidebar_item: { value: "Thống kê" },
      sort: { id: 1, type: "ASC" },
    },
    setLanguage,
    setSeason,
    setTheme,
  };
});

vi.mock("@material-tailwind/react/components/Accordion", () =>
  harness.moduleFactory(["Accordion", "AccordionBody", "AccordionHeader"])
);
vi.mock("@material-tailwind/react/components/Breadcrumbs", () =>
  harness.moduleFactory(["Breadcrumbs"], "nav")
);
vi.mock("@material-tailwind/react/components/Button", () =>
  harness.moduleFactory(["Button"], "button")
);
vi.mock("@material-tailwind/react/components/Card", () =>
  harness.moduleFactory(["Card", "CardBody", "CardFooter"])
);
vi.mock("@material-tailwind/react/components/Dialog", () =>
  harness.moduleFactory(["Dialog", "DialogBody", "DialogFooter", "DialogHeader"])
);
vi.mock("@material-tailwind/react/components/IconButton", () =>
  harness.moduleFactory(["IconButton"], "button")
);
vi.mock("@material-tailwind/react/components/Input", () => harness.moduleFactory(["Input"]));
vi.mock("@material-tailwind/react/components/List", () =>
  harness.moduleFactory(["List", "ListItem", "ListItemPrefix"])
);
vi.mock("@material-tailwind/react/components/Menu", () =>
  harness.moduleFactory(["Menu", "MenuHandler", "MenuItem", "MenuList"])
);
vi.mock("@material-tailwind/react/components/Radio", () => harness.moduleFactory(["Radio"]));
vi.mock("@material-tailwind/react/components/Select", () =>
  harness.moduleFactory(["Option", "Select"])
);
vi.mock("@material-tailwind/react/components/Stepper", () =>
  harness.moduleFactory(["Step", "Stepper"])
);
vi.mock("@material-tailwind/react/components/Tabs", () =>
  harness.moduleFactory(["Tab", "Tabs", "TabsHeader"])
);
vi.mock("@material-tailwind/react/components/Textarea", () => harness.moduleFactory(["Textarea"]));
vi.mock("@material-tailwind/react/components/Tooltip", () => harness.moduleFactory(["Tooltip"]));
vi.mock("@material-tailwind/react/components/Typography", () =>
  harness.moduleFactory(["Typography"])
);

vi.mock("@mui/material", () =>
  harness.moduleFactory([
    "Box",
    "Avatar",
    "Card",
    "CardContent",
    "Button",
    "Chip",
    "Container",
    "Dialog",
    "DialogActions",
    "DialogContent",
    "DialogTitle",
    "Divider",
    "FormControl",
    "IconButton",
    "InputAdornment",
    "InputLabel",
    "MenuItem",
    "OutlinedInput",
    "Pagination",
    "Radio",
    "RadioGroup",
    "Rating",
    "Select",
    "Switch",
    "TextField",
    "FormControlLabel",
    "Typography",
  ])
);
vi.mock("@mui/material/Box", async () => {
  const ReactModule = await import("react");
  const Box = ({ children, component = "div", ...props }) =>
    ReactModule.createElement(component, props, children);

  return { default: Box };
});
vi.mock("@mui/material/TextField", async () => {
  const ReactModule = await import("react");
  const TextField = (props) => {
    harness.rendered.push({ name: "TextField", props });
    const { inputProps, ...safeProps } = props;
    return ReactModule.createElement("input", { ...safeProps, ...inputProps });
  };

  return { default: TextField };
});
vi.mock("@mui/material/Autocomplete", async () => {
  const ReactModule = await import("react");
  const Autocomplete = ({ getOptionLabel, options, renderInput, renderOption }) =>
    ReactModule.createElement(
      "section",
      null,
      getOptionLabel(options[0]),
      renderOption({ key: "country-option" }, options[1]),
      renderInput({ inputProps: { "aria-label": "country" } })
    );

  return { default: Autocomplete };
});
vi.mock("@mui/x-date-pickers", () => harness.moduleFactory(["DatePicker", "LocalizationProvider"]));
vi.mock("@mui/x-date-pickers/DatePicker", () => harness.moduleFactory(["DatePicker"]));
vi.mock("@mui/x-date-pickers/AdapterDayjs", () => ({
  AdapterDayjs: function AdapterDayjs() {},
}));
vi.mock("@mui/x-date-pickers/LocalizationProvider", () =>
  harness.moduleFactory(["LocalizationProvider"])
);
vi.mock("@mui/x-date-pickers/internals/demo", () => harness.moduleFactory(["DemoContainer"]));

const iconModule = async (names) => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return Object.fromEntries(names.map((name) => [name, Icon]));
};

vi.mock("@heroicons/react/24/outline", () =>
  iconModule([
    "ArrowLeftIcon",
    "ArrowRightIcon",
    "BriefcaseIcon",
    "ChatBubbleLeftRightIcon",
    "CheckCircleIcon",
    "ChevronUpDownIcon",
    "ChevronDownIcon",
    "ChevronRightIcon",
    "ClipboardDocumentCheckIcon",
    "ComputerDesktopIcon",
    "EnvelopeIcon",
    "GlobeAltIcon",
    "MapPinIcon",
    "MoonIcon",
    "PhoneIcon",
    "QuestionMarkCircleIcon",
    "ShieldCheckIcon",
    "ShoppingBagIcon",
    "SparklesIcon",
    "SunIcon",
    "TruckIcon",
  ])
);
vi.mock("@heroicons/react/24/solid", () =>
  iconModule([
    "FlagIcon",
    "InboxArrowDownIcon",
    "LifebuoyIcon",
    "PowerIcon",
    "PresentationChartBarIcon",
    "ShoppingBagIcon",
    "UserCircleIcon",
  ])
);

vi.mock("@mui/icons-material/ArrowBack", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/CheckCircle", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/Close", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/Delete", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/East", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/Edit", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/FilterList", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/FmdGoodOutlined", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/HighlightOffOutlined", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/KeyOutlined", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/LocalPhoneOutlined", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/MailOutlined", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/Public", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/Receipt", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/Settings", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/SecurityOutlined", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/ShoppingCart", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});
vi.mock("@mui/icons-material/SubdirectoryArrowRight", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return { default: Icon };
});

vi.mock("developer-icons", () =>
  iconModule(["Facebook", "Google", "Twitter", "GitHubDark", "Instagram"])
);

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: ({ count }) => ({
    getTotalSize: () => count * 64,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        end: (index + 1) * 64,
        index,
        key: `row-${index}`,
        start: index * 64,
      })),
    measureElement: vi.fn(),
  }),
}));
vi.mock("swiper/react", () => harness.moduleFactory(["Swiper", "SwiperSlide"]));
vi.mock("swiper/modules", () => ({ Navigation: {} }));
vi.mock("axios", () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => harness.dispatch,
  useSelector: (selector) => selector(harness.reduxState),
}));
vi.mock("react-router-dom", async () => {
  const ReactModule = await import("react");
  const Link = ({ children, href, to }) =>
    ReactModule.createElement("a", { href: href ?? to }, children);
  const Wrapper = ({ children }) => ReactModule.createElement("div", null, children);
  const Route = (props) => {
    harness.rendered.push({ name: "Route", props });
    return ReactModule.createElement(
      "section",
      null,
      `route:${props.path ?? "index"}`,
      props.children
    );
  };

  return {
    BrowserRouter: Wrapper,
    Link,
    NavLink: Link,
    Outlet: () => ReactModule.createElement("div", null, "outlet"),
    Route,
    Routes: Wrapper,
    useLocation: () => ({ pathname: "/dashboard" }),
    useNavigate: () => harness.navigate,
    useParams: () => ({}),
  };
});

vi.mock("./i18n", () => ({
  useI18n: () => ({
    language: "en",
    setLanguage: harness.setLanguage,
    supportedLanguages: [
      { code: "en", labelKey: "language.english" },
      { code: "vi", labelKey: "language.vietnamese" },
    ],
    t: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key),
  }),
}));
vi.mock("./currency", () => ({
  useCurrency: () => ({
    formatPrice: (value) => `${Number(value ?? 0).toLocaleString("en-US")} VND`,
  }),
}));
vi.mock("./theme", () => ({
  useThemeMode: () => ({
    activeTheme: "dark",
    setTheme: harness.setTheme,
    theme: "system",
    themeOptions: [
      { labelKey: "theme.light", value: "light" },
      { labelKey: "theme.dark", value: "dark" },
      { labelKey: "theme.system", value: "system" },
    ],
  }),
}));
vi.mock("./theme/SeasonProvider", () => ({
  useSeasonMode: () => ({
    activeSeason: "summer",
    season: "auto",
    seasonOptions: [
      { emoji: "A", labelKey: "season.auto", value: "auto" },
      { emoji: "S", labelKey: "season.summer", value: "summer" },
    ],
    setSeason: harness.setSeason,
  }),
}));

vi.mock("./apis/brand.api", () => ({
  useAddBrandMutation: () => [harness.mutation, { isLoading: false }],
  useDeleteBrandMutation: () => [harness.mutation, { isLoading: false }],
  useGetBrandsQuery: () => harness.apiState.brands,
  useUpdateBrandMutation: () => [harness.mutation, { isLoading: false }],
}));
vi.mock("./apis/category.api", () => ({
  useAddCategoryMutation: () => [harness.mutation, { isLoading: false }],
  useDeleteCategoryMutation: () => [harness.mutation, { isLoading: false }],
  useGetCategoriesQuery: () => harness.apiState.categories,
  useUpdateCategoryMutation: () => [harness.mutation, { isLoading: false }],
}));
vi.mock("./apis/comment.api", () => ({
  useDeleteCommentMutation: () => [harness.mutation, { isLoading: false }],
  useGetCommentsQuery: () => harness.apiState.comments,
}));
vi.mock("./apis/import_product.api", () => ({
  useAddImportedProductMutation: () => [harness.mutation, { isLoading: false }],
  useDeleteImportedProductMutation: () => [harness.mutation, { isLoading: false }],
  useGetColorsQuery: () => harness.apiState.colors,
  useGetImportedProductQuery: () => harness.apiState.importedProductPreview,
  useGetImportedProductsQuery: () => harness.apiState.importedProducts,
  useGetMaterialsQuery: () => harness.apiState.materials,
  useGetSizesQuery: () => harness.apiState.sizes,
  useUpdateImportedProductMutation: () => [harness.mutation, { isLoading: false }],
}));
vi.mock("./apis/input_on_sale.api", () => ({
  useCreateInputSaleMutation: () => [harness.mutation, { isLoading: false }],
  useDeleteInputSaleMutation: () => [harness.mutation, { isLoading: false }],
  useGetInputSalesQuery: () => harness.apiState.inputSales,
  useUpdateInputSaleMutation: () => [harness.mutation, { isLoading: false }],
}));
vi.mock("./apis/order.api", () => ({
  useDeleteOrderMutation: () => [harness.mutation, { isLoading: false }],
  useGetCartQuery: () => harness.apiState.cart,
  useGetOrdersQuery: () => harness.apiState.orders,
  useGetOrdersByUserQuery: () => harness.apiState.orders,
}));
vi.mock("./apis/on_sale_product.api", () => ({
  useGetOnSaleProductQuery: () => harness.apiState.onSaleProduct,
  useGetOnSaleProductsQuery: () => harness.apiState.onSaleProducts,
}));
vi.mock("./apis/product.api", () => ({
  useCreateProductMutation: () => [harness.mutation, { isLoading: false }],
  useDeleteProductMutation: () => [harness.mutation, { isLoading: false }],
  useGetProductsQuery: () => harness.apiState.products,
  useUpdateProductMutation: () => [harness.mutation, { isLoading: false }],
}));
vi.mock("./apis/user.api", () => ({
  useGetUserProfileQuery: () => harness.apiState.userProfile,
  useGetUsersQuery: () => harness.apiState.users,
  useUpdatePasswordMutation: () => [harness.mutation, { isLoading: false }],
  useUpdateUserProfileMutation: () => [harness.mutation, { isLoading: false }],
}));
vi.mock("./apis/voucher.api", () => ({
  useAddVoucherMutation: () => [harness.mutation, { isLoading: false }],
  useGetAvailableVouchersQuery: () => harness.apiState.availableVouchers,
  useGetVouchersQuery: () => harness.apiState.vouchers,
  useUpdateVoucherMutation: () => [harness.mutation, { isLoading: false }],
}));

vi.mock("./components/shared/admin/admin_navbar.component", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("header", null, "admin-navbar") };
});
vi.mock("./components/shared/shop/Banner", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("div", null, "shop-banner") };
});
vi.mock("./components/shared/shop/NavbarWithSublist", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("nav", null, "shop-navbar") };
});
vi.mock("./components/shop/checkout_step_1.component", async () => {
  const ReactModule = await import("react");

  return {
    default: ({ handleNext }) =>
      ReactModule.createElement("button", { onClick: handleNext }, "checkout-step-1"),
  };
});
vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}));
vi.mock("./configs/sweetalert2.config", () => ({
  Toast: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}));
vi.mock("./utils/delete_image.util", () => ({
  handleDelete: vi.fn(),
}));

const render = (Component, props = {}) =>
  renderToStaticMarkup(React.createElement(Component, props));
const captured = (name, predicate = () => true) =>
  harness.rendered.filter((entry) => entry.name === name && predicate(entry.props));
const invoke = async (entry, handlerName = "onClick", event = { target: { value: "typed" } }) => {
  const result = entry?.props?.[handlerName]?.(event);
  if (result && typeof result.then === "function") await result;
};
const withMockedUseState = async (resolveInitialState, callback) => {
  const originalUseState = React.useState;
  let callIndex = 0;
  React.useState = (initialState) => [resolveInitialState(initialState, callIndex++), vi.fn()];

  try {
    return await callback();
  } finally {
    React.useState = originalUseState;
  }
};

beforeEach(() => {
  vi.clearAllMocks();
  const storage = {
    clear: vi.fn(),
    getItem: vi.fn(() => null),
    removeItem: vi.fn(),
    setItem: vi.fn(),
  };
  globalThis.localStorage = storage;
  globalThis.window = {
    addEventListener: vi.fn(),
    cancelAnimationFrame: vi.fn(),
    innerHeight: 900,
    innerWidth: 1200,
    localStorage: storage,
    removeEventListener: vi.fn(),
    requestAnimationFrame: vi.fn((callback) => {
      callback();
      return 1;
    }),
  };
  globalThis.document = {
    documentElement: {
      classList: { toggle: vi.fn() },
      dataset: {},
      style: {},
    },
  };
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { userAgent: "Chrome" },
  });
  globalThis.requestAnimationFrame = globalThis.window.requestAnimationFrame;
  globalThis.cancelAnimationFrame = globalThis.window.cancelAnimationFrame;
  harness.rendered.length = 0;
  harness.mutation.mockClear();
  harness.apiState.brands = {
    data: {
      object: [
        { description: "Athletic gear", id: 1, name: "Nike" },
        { description: "Classic gear", id: 2, name: "Adidas" },
      ],
    },
    error: null,
    isLoading: false,
  };
  harness.apiState.categories = {
    data: {
      object: [
        { description: "Everyday shirts", id: 1, name: "Shirts" },
        { description: "Everyday pants", id: 2, name: "Pants" },
      ],
    },
    error: null,
    isLoading: false,
  };
  harness.apiState.comments = {
    data: [
      {
        content: "Comfortable fabric",
        created_at: "2026-07-18",
        id: 1,
        star: 5,
        username: "ada",
      },
    ],
    error: null,
    isLoading: false,
  };
  harness.apiState.products = {
    data: {
      object: [
        {
          brand_id: { id: 1, name: "Nike" },
          category_id: { id: 1, name: "Shirts" },
          id: 1,
          name: "Runner Tee",
          short_description: "Training tee",
        },
      ],
    },
    error: null,
    isLoading: false,
  };
  harness.apiState.onSaleProducts = {
    data: {
      object: [
        {
          discount: 10,
          id: 101,
          product: {
            id: 1,
            imageUrl: "/runner-tee.png",
            product: {
              brand: { id: 1, name: "Nike" },
              category: { id: 1, name: "Shirts" },
              id: 1,
              name: "Runner Tee",
            },
            stock: 12,
          },
          salePrice: 100000,
        },
      ],
    },
    error: null,
    isLoading: false,
  };
  harness.apiState.onSaleProduct = {
    data: { object: harness.apiState.onSaleProducts.data.object },
    error: null,
    isLoading: false,
  };
  const importedProductRows = [
    {
      color_id: { color_code: "#111827", color_name: "Black", id: 1 },
      id: 1,
      image_url: "/runner-tee.png",
      importNumber: 20,
      importPrice: 100000,
      material_id: { id: 1, name: "Cotton" },
      product_id: { id: 1, name: "Runner Tee" },
      public_id_slider_url_1: "slide-1",
      public_id_slider_url_2: "slide-2",
      public_id_slider_url_3: "slide-3",
      public_id_slider_url_4: "slide-4",
      public_id_url: "main",
      size_id: { height: "165-175cm", id: 1, size: "M", weight: "55-70kg" },
      sku: "RUN-BLK-M",
      slider_url_1: "/runner-1.png",
      slider_url_2: "/runner-2.png",
      slider_url_3: "/runner-3.png",
      slider_url_4: "/runner-4.png",
      stock: 12,
    },
    {
      color_id: { color_code: "#f8fafc", color_name: "White", id: 2 },
      id: 2,
      image_url: "/runner-tee-white.png",
      importNumber: 5,
      importPrice: 120000,
      material_id: { id: 2, name: "Linen" },
      product_id: { id: 1, name: "Runner Tee" },
      public_id_slider_url_1: "white-slide-1",
      public_id_slider_url_2: "white-slide-2",
      public_id_slider_url_3: "white-slide-3",
      public_id_slider_url_4: "white-slide-4",
      public_id_url: "white-main",
      size_id: { height: "170-180cm", id: 2, size: "L", weight: "65-80kg" },
      sku: "RUN-WHT-L",
      slider_url_1: "/runner-white-1.png",
      slider_url_2: "/runner-white-2.png",
      slider_url_3: "/runner-white-3.png",
      slider_url_4: "/runner-white-4.png",
      stock: 0,
    },
  ];
  harness.apiState.colors = {
    data: { object: importedProductRows.map(({ color_id: color }) => color) },
    error: null,
    isLoading: false,
  };
  harness.apiState.importedProducts = {
    data: { object: importedProductRows },
    error: null,
    isLoading: false,
  };
  harness.apiState.importedProductPreview = {
    data: { object: importedProductRows },
    error: null,
    isLoading: false,
  };
  harness.apiState.inputSales = {
    data: {
      object: [
        {
          available_date: "2026-07-01",
          discount: 10,
          end_date: "2026-08-01",
          filter: "PRODUCT",
          filter_id: 1,
          id: 1,
          salePercentage: 120,
        },
      ],
    },
    error: null,
    isLoading: false,
  };
  harness.apiState.materials = {
    data: { object: importedProductRows.map(({ material_id: material }) => material) },
    error: null,
    isLoading: false,
  };
  harness.apiState.sizes = {
    data: { object: importedProductRows.map(({ size_id: size }) => size) },
    error: null,
    isLoading: false,
  };
  harness.apiState.orders = {
    data: {
      object: [
        {
          address: "1 Main St",
          id: 1,
          order_code: "ORD-1",
          orderItems: [
            {
              id: 10,
              product_id: {
                discount: 10,
                product_id: { product_id: { name: "Runner Tee" } },
                sale_price: 100000,
              },
              quantity: 2,
            },
          ],
          payment_method: "BANK",
          payment_status: "PAID",
          phone_number: "0912345678",
          receiver_name: "Ada Buyer",
          total_price: 180000,
        },
      ],
    },
    error: null,
    isLoading: false,
  };
  harness.apiState.cart = {
    data: { object: { id: 1, orderItems: [], total_price: 0 } },
    error: null,
    isLoading: false,
  };
  harness.apiState.users = {
    data: {
      object: [{ id: 1, name: "Ada User", role: "USER", status: "ACTIVE", username: "ada" }],
    },
    error: null,
    isLoading: false,
  };
  harness.apiState.userProfile = {
    data: {
      object: {
        address: "1 Main St",
        avatar_url: "/avatar.png",
        birthday: "1998-01-15",
        email: "ada@example.com",
        gender: "MALE",
        name: "Ada Profile",
        phone_number: "0912345678",
        public_id_avatar_url: "avatar-public-id",
      },
    },
    isError: false,
    isLoading: false,
  };
  harness.apiState.vouchers = {
    data: {
      object: [
        {
          available_date: "2026-07-01T00:00:00.000Z",
          code: "SAVE10",
          expired_date: "2026-08-01T00:00:00.000Z",
          id: 1,
          stock: 5,
          value: 10,
        },
        {
          available_date: "2026-09-01T00:00:00.000Z",
          code: "SAVE20",
          expired_date: "2026-10-01T00:00:00.000Z",
          id: 2,
          stock: 8,
          value: 20,
        },
      ],
    },
    isError: false,
    isLoading: false,
  };
  harness.apiState.availableVouchers = {
    data: { object: [] },
    isError: false,
    isLoading: false,
  };
  harness.reduxState = {
    active: { value: 1 },
    openAccordion: { value: 0 },
    selectedId: { value: 1 },
    sidebar_item: { value: "Thống kê" },
    sort: { id: 1, type: "ASC" },
  };
});

export { React, harness, render, captured, invoke, withMockedUseState };
