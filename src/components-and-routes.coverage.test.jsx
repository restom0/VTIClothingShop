import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => {
  const rendered = [];

  const createComponent = (ReactModule, name, tag = "div") => {
    const MockComponent = (componentProps) => {
      rendered.push({ name, props: componentProps });
      const { children, content, label, value, href, role } = componentProps;
      const elementProps = {};
      if (href) elementProps.href = href;
      if (role) elementProps.role = role;

      return ReactModule.createElement(
        tag,
        elementProps,
        children ?? label ?? value ?? content ?? name
      );
    };
    MockComponent.displayName = `Mock${name}`;

    return MockComponent;
  };

  return {
    dispatch: vi.fn(),
    moduleFactory: async (names, tag = "div") => {
      const ReactModule = await import("react");

      return Object.fromEntries(
        names.map((name) => [name, createComponent(ReactModule, name, tag)])
      );
    },
    params: {},
    reduxState: {
      active: { value: 2 },
      sort: { id: 1, type: "ASC" },
    },
    rendered,
  };
});

vi.mock("@material-tailwind/react/components/Breadcrumbs", () =>
  harness.moduleFactory(["Breadcrumbs"], "nav")
);
vi.mock("@material-tailwind/react/components/Button", () =>
  harness.moduleFactory(["Button"], "button")
);
vi.mock("@material-tailwind/react/components/Card", () => harness.moduleFactory(["CardFooter"]));
vi.mock("@material-tailwind/react/components/Radio", () => harness.moduleFactory(["Radio"]));
vi.mock("@material-tailwind/react/components/Typography", () =>
  harness.moduleFactory(["Typography"])
);
vi.mock("@heroicons/react/24/outline", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return {
    ArrowLeftIcon: Icon,
    ArrowRightIcon: Icon,
    ChevronUpDownIcon: Icon,
  };
});
vi.mock("@heroicons/react/24/solid", async () => {
  const ReactModule = await import("react");
  const Icon = (props) => ReactModule.createElement("svg", props);

  return {
    InboxArrowDownIcon: Icon,
    LifebuoyIcon: Icon,
    PowerIcon: Icon,
    UserCircleIcon: Icon,
  };
});
vi.mock("@mui/icons-material/Settings", async () => {
  const ReactModule = await import("react");
  const SettingsIcon = (props) => ReactModule.createElement("svg", props);

  return { default: SettingsIcon };
});
vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: ({ count }) => ({
    getTotalSize: () => count * 100,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        key: `row-${index}`,
        start: index * 100,
      })),
    measureElement: vi.fn(),
  }),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => harness.dispatch,
  useSelector: (selector) => selector(harness.reduxState),
}));
vi.mock("react-router-dom", async () => {
  const ReactModule = await import("react");
  const Link = ({ children, href, to }) =>
    ReactModule.createElement("a", { href: href ?? to }, children);

  return {
    Link,
    NavLink: Link,
    useLocation: () => ({ pathname: "/brand/1" }),
    useParams: () => harness.params,
  };
});

vi.mock("./i18n", () => ({
  useI18n: () => ({
    t: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key),
  }),
}));
vi.mock("./currency", () => ({
  useCurrency: () => ({
    formatPrice: (value) => `${Number(value ?? 0).toLocaleString("en-US")} VND`,
  }),
}));
vi.mock("./apis/on_sale_product.api", () => ({
  useGetOnSaleProductsQuery: () => ({
    data: { object: [] },
    error: null,
    isLoading: false,
  }),
}));
vi.mock("./components/shared/LazyImage", async () => {
  const ReactModule = await import("react");

  return {
    default: ({ alt, src }) => ReactModule.createElement("img", { alt, src }),
  };
});
vi.mock("./components/shared/ScrollReveal", async () => {
  const ReactModule = await import("react");

  return {
    default: ({ as = "div", children, className }) =>
      ReactModule.createElement(as, { className }, children),
  };
});
vi.mock("./components/shared/profile_sidebar.component", async () => {
  const ReactModule = await import("react");

  return {
    default: ({ tab }) => ReactModule.createElement("aside", null, `profile-sidebar:${tab}`),
  };
});
vi.mock("./components/shared/shop/ShopList", async () => {
  const ReactModule = await import("react");

  return {
    default: ({ products }) =>
      ReactModule.createElement("section", null, `shop-list:${products.length}`),
  };
});
vi.mock("./components/shop/order.component", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("section", null, "orders") };
});
vi.mock("./components/shop/rating_product.component", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("section", null, "ratings") };
});
vi.mock("./components/shop/seen_product.component", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("section", null, "seen-products") };
});
vi.mock("./components/shop/user_info.component", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("section", null, "user-info") };
});
vi.mock("./components/shop/voucer.component", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("section", null, "vouchers") };
});
vi.mock("./components/shop/wishlist.component", async () => {
  const ReactModule = await import("react");

  return { default: () => ReactModule.createElement("section", null, "wishlist") };
});

const render = (Component, props = {}) =>
  renderToStaticMarkup(React.createElement(Component, props));
const renderElement = (element) => renderToStaticMarkup(element);
const captured = (name, predicate = () => true) =>
  harness.rendered.filter((entry) => entry.name === name && predicate(entry.props));

const collectElements = (node, predicate, matches = []) => {
  if (Array.isArray(node)) {
    node.forEach((child) => collectElements(child, predicate, matches));
    return matches;
  }
  if (!React.isValidElement(node)) return matches;

  if (predicate(node)) matches.push(node);
  collectElements(node.props.children, predicate, matches);

  return matches;
};

beforeEach(() => {
  vi.clearAllMocks();
  harness.rendered.length = 0;
  harness.params = {};
  harness.reduxState = {
    active: { value: 2 },
    sort: { id: 1, type: "ASC" },
  };
});

describe("additional component and route coverage", () => {
  it("renders browse and profile route wrappers", async () => {
    const [{ default: BrandPage }, { default: CategoryPage }, { default: ProfilePage }] =
      await Promise.all([
        import("./pages/brand.page.jsx"),
        import("./pages/category.page.jsx"),
        import("./pages/profile.page.jsx"),
      ]);

    expect(render(BrandPage)).toContain("filter.brand");
    expect(render(CategoryPage)).toContain("filter.product_type");
    expect(render(ProfilePage)).toContain("profile-sidebar:0");
    expect(render(ProfilePage)).toContain("user-info");

    harness.params = { id: "nike" };
    expect(render(BrandPage)).not.toContain("filter.brand");
    expect(render(CategoryPage)).not.toContain("filter.product_type");
  });

  it("renders shop filter and product card states", async () => {
    const [{ default: ProductFilter, ProductFilterView }, { default: ProductCard }] =
      await Promise.all([
        import("./components/shared/shop/ProductFilter.jsx"),
        import("./components/shared/shop/ProductCard.jsx"),
      ]);

    expect(render(ProductFilter)).toContain("filter.material");
    expect(
      render(ProductFilterView, {
        colorOptions: [{ color: "#111111", label: "Black" }],
        labels: { color: "Color", material: "Material", size: "Size" },
        materialOptions: [{ label: "Cotton", value: "cotton" }],
        onColorSelect: vi.fn(),
        onSizeSelect: vi.fn(),
        selectedColor: "#111111",
        selectedSize: "M",
        sizes: ["S", "M"],
      })
    ).toContain("Cotton");

    expect(
      render(ProductCard, {
        discount: 10,
        id: 101,
        imageUrl: "shirt.jpg",
        price: 100000,
        title: "Runner Tee",
      })
    ).toContain("-10%");
    expect(
      render(ProductCard, {
        id: 102,
        product_id: { image_url: "shoe.jpg", product_id: { name: "Runner Shoe" } },
        sale_price: 200000,
      })
    ).toContain("Runner Shoe");
  });

  it("renders shared table, pagination, and virtual grid controls", async () => {
    const [{ default: TableHeader }, { default: Pagination }, { default: VirtualizedGrid }] =
      await Promise.all([
        import("./components/shared/header_table.jsx"),
        import("./components/shared/pagination.component.jsx"),
        import("./components/shared/VirtualizedGrid.jsx"),
      ]);

    const headerElement = React.createElement(TableHeader, {
      TABLE_HEAD: [
        { col: 1, label: "Name" },
        { col: 2, label: React.createElement("span", null, "Custom") },
      ],
      noDelete: false,
      noUpdate: true,
    });
    expect(renderElement(headerElement)).toContain("Name");

    for (const tableHeader of collectElements(
      headerElement.type(headerElement.props),
      (node) => node.type === "th"
    )) {
      tableHeader.props.onClick?.();
    }
    expect(harness.dispatch).toHaveBeenCalled();

    harness.rendered.length = 0;
    expect(render(Pagination, { page: 3 })).toContain("1");
    for (const button of captured("Button", (props) => typeof props.onClick === "function")) {
      button.props.onClick();
    }
    expect(harness.dispatch).toHaveBeenCalled();
    expect(render(Pagination, { page: 1 })).toBe("");

    expect(
      render(VirtualizedGrid, {
        "aria-label": "Products",
        columns: 2,
        estimateRowHeight: 100,
        getKey: (item) => item.id,
        items: [
          { id: 1, name: "One" },
          { id: 2, name: "Two" },
          { id: 3, name: "Three" },
        ],
        renderItem: (item) => React.createElement("span", null, item.name),
      })
    ).toContain("Three");
  });
});
