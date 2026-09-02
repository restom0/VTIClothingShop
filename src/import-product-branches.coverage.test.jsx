import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => {
  const rendered = [];
  const dispatch = vi.fn();
  const navigate = vi.fn();
  const setter = vi.fn();
  const mutation = vi.fn(() => ({
    data: { statusCode: 200 },
    unwrap: vi.fn(async () => ({ data: { statusCode: 200 } })),
  }));

  return {
    dispatch,
    mutation,
    navigate,
    rendered,
    setter,
    stateIndex: 0,
    stateResolver: (initialState) => initialState,
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  const useEffect = (effect) => effect();
  const useState = (initialState) => [
    harness.stateResolver(initialState, harness.stateIndex++),
    harness.setter,
  ];
  const defaultExport = {
    ...actual.default,
    useEffect,
    useState,
  };

  return {
    ...actual,
    default: defaultExport,
    useEffect,
    useState,
  };
});

const componentFactory = async (names, tag = "div") => {
  const React = await import("react");
  const createComponent = (name) => {
    const Component = (props) => {
      harness.rendered.push({ name, props });
      const { children, label, value } = props;
      const primitiveValue = typeof value === "string" || typeof value === "number" ? value : name;

      return React.createElement(tag, null, children ?? label ?? primitiveValue);
    };
    Component.displayName = name;
    return Component;
  };

  return Object.fromEntries(names.map((name) => [name, createComponent(name)]));
};

vi.mock("@material-tailwind/react/components/Button", () => componentFactory(["Button"], "button"));
vi.mock("@material-tailwind/react/components/IconButton", () =>
  componentFactory(["IconButton"], "button")
);
vi.mock("@material-tailwind/react/components/Input", () => componentFactory(["Input"]));
vi.mock("@material-tailwind/react/components/Radio", () => componentFactory(["Radio"]));
vi.mock("@material-tailwind/react/components/Typography", () => componentFactory(["Typography"]));
vi.mock("@mui/icons-material/Close", async () => {
  const React = await import("react");
  return { default: (props) => React.createElement("svg", props) };
});
vi.mock("@mui/material", () =>
  componentFactory([
    "Container",
    "Dialog",
    "DialogActions",
    "DialogContent",
    "DialogTitle",
    "FormControl",
    "InputAdornment",
    "MenuItem",
    "OutlinedInput",
    "Select",
    "TextField",
  ])
);
vi.mock("./components/upload_image.component", async () => {
  const React = await import("react");
  return { default: (props) => React.createElement("input", { id: props.image, type: "file" }) };
});
vi.mock("./components/shared/loading.component", async () => {
  const React = await import("react");
  return { default: () => React.createElement("div", null, "loading.label") };
});
vi.mock("./layouts/admin/admin.layout", async () => {
  const React = await import("react");
  const AdminLayout = ({ bodyDetail, bodyUpdate, children, handleDeleteSubmit, updateSubmit }) =>
    React.createElement(
      "section",
      null,
      children,
      bodyDetail,
      bodyUpdate,
      React.createElement("button", { onClick: updateSubmit }, "update"),
      React.createElement("button", { onClick: handleDeleteSubmit }, "delete")
    );

  return { default: AdminLayout };
});
vi.mock("react-redux", () => ({
  useDispatch: () => harness.dispatch,
  useSelector: (selector) => selector({ selectedId: { value: 1 } }),
}));
vi.mock("react-router-dom", () => ({
  useNavigate: () => harness.navigate,
}));
vi.mock("./apis/product.api", () => ({
  useGetProductsQuery: () => ({
    data: { object: [{ id: 1, name: "Runner Tee" }] },
    error: null,
    isLoading: false,
  }),
}));
vi.mock("./apis/import_product.api", () => ({
  useAddImportedProductMutation: () => [harness.mutation, { isLoading: false }],
  useDeleteImportedProductMutation: () => [harness.mutation, { isLoading: false }],
  useGetImportedProductsQuery: () => ({
    data: {
      object: [
        {
          color_id: { color_code: "#111827", color_name: "Black", id: 10 },
          gender: "MALE",
          id: 1,
          image_url: "/server-avatar.png",
          importNumber: 20,
          importPrice: 100000,
          material_id: { id: 30, name: "Cotton" },
          product_id: { id: 1, name: "Runner Tee" },
          public_id_slider_url_1: "server-slider-1",
          public_id_slider_url_2: "server-slider-2",
          public_id_slider_url_3: "server-slider-3",
          public_id_slider_url_4: "server-slider-4",
          public_id_url: "server-avatar",
          size_id: { height: "165-175cm", id: 20, size: "M", weight: "55-70kg" },
          slider_url_1: "/server-1.png",
          slider_url_2: "/server-2.png",
          slider_url_3: "/server-3.png",
          slider_url_4: "/server-4.png",
        },
      ],
    },
    error: null,
    isLoading: false,
  }),
  useUpdateImportedProductMutation: () => [harness.mutation, { isLoading: false }],
}));
vi.mock("./configs/sweetalert2.config", () => ({
  Toast: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}));
vi.mock("./features/slices/select_id.slice", () => ({
  resetSelectedId: () => ({ type: "selectedId/reset" }),
}));
vi.mock("./utils/delete_image.util", () => ({
  handleDelete: vi.fn(),
}));
vi.mock("./currency", () => ({
  useCurrency: () => ({ formatPrice: (value) => `${value} VND` }),
}));

const renderImportProduct = async (resolver) => {
  harness.stateIndex = 0;
  harness.stateResolver = resolver;
  const React = await import("react");
  const { default: ImportProduct } =
    await import("./components/admin/import_product.component.jsx");

  return renderToStaticMarkup(React.createElement(ImportProduct));
};

const filledImportState =
  ({ newOpen = true, oldOpen = false } = {}) =>
  (initialState, index) => {
    if (index >= 0 && index <= 4) return `/new-${index}.png`;
    if (index >= 5 && index <= 9) return `new-public-${index}`;
    if (index >= 10 && index <= 14) return `/update-${index}.png`;
    if (index >= 15 && index <= 19) return `update-public-${index}`;
    if (index === 20) return newOpen;
    if (index === 21) return oldOpen;
    if (index === 22) return 1;
    if (index === 23) return 10;
    if (index === 25) return "M";
    if (index === 28) return 30;
    if (initialState === "") return "typed";
    if (initialState === null) return 1;
    return initialState;
  };

const captured = (name, predicate = () => true) =>
  harness.rendered.filter((entry) => entry.name === name && predicate(entry.props));
const invoke = async (entry, handlerName = "onClick", event = { target: { value: "changed" } }) => {
  const result = entry?.props?.[handlerName]?.(event);
  if (result && typeof result.then === "function") await result;
};

beforeEach(() => {
  harness.rendered.length = 0;
  harness.dispatch.mockClear();
  harness.mutation.mockClear();
  harness.navigate.mockClear();
  harness.setter.mockClear();
});

describe("ImportProduct branch coverage", () => {
  it("renders selected import details, preview images, and update/new forms", async () => {
    const markup = await renderImportProduct(filledImportState({ newOpen: true, oldOpen: true }));

    expect(markup).toContain("Runner Tee");
    expect(markup).toContain("/new-0.png");
    expect(markup).toContain("/update-10.png");
    expect(markup).toContain("Xóa ảnh đại diện");

    for (const entry of [
      ...captured("TextField", (props) => typeof props.onChange === "function"),
      ...captured("OutlinedInput", (props) => typeof props.onChange === "function"),
      ...captured("Select", (props) => typeof props.onChange === "function"),
    ]) {
      await invoke(entry, "onChange");
    }
    for (const entry of [
      ...captured("Button", (props) => typeof props.onClick === "function"),
      ...captured("IconButton", (props) => typeof props.onClick === "function"),
    ]) {
      await invoke(entry);
    }

    expect(harness.mutation).toHaveBeenCalled();
    expect(harness.setter).toHaveBeenCalled();
  }, 10000);

  it("resets the new import form after a successful new-product submit", async () => {
    await renderImportProduct(filledImportState({ newOpen: true, oldOpen: false }));

    for (const entry of captured("Button", (props) => typeof props.onClick === "function")) {
      await invoke(entry);
    }

    expect(harness.mutation).toHaveBeenCalled();
    expect(harness.setter).toHaveBeenCalledWith("");
    expect(harness.setter).toHaveBeenCalledWith(null);
  });
});
