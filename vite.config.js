import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const MT_COMPONENT_CHUNKS = {
  accordion: "vendor-mt-navigation",
  alert: "vendor-mt-overlay",
  avatar: "vendor-mt-base",
  badge: "vendor-mt-base",
  breadcrumbs: "vendor-mt-navigation",
  button: "vendor-mt-base",
  buttongroup: "vendor-mt-base",
  card: "vendor-mt-base",
  carousel: "vendor-mt-overlay",
  checkbox: "vendor-mt-forms",
  chip: "vendor-mt-base",
  collapse: "vendor-mt-navigation",
  dialog: "vendor-mt-overlay",
  drawer: "vendor-mt-overlay",
  iconbutton: "vendor-mt-base",
  input: "vendor-mt-forms",
  list: "vendor-mt-navigation",
  menu: "vendor-mt-overlay",
  navbar: "vendor-mt-navigation",
  popover: "vendor-mt-overlay",
  progress: "vendor-mt-base",
  radio: "vendor-mt-forms",
  rating: "vendor-mt-forms",
  select: "vendor-mt-forms",
  slider: "vendor-mt-forms",
  speeddial: "vendor-mt-overlay",
  spinner: "vendor-mt-base",
  stepper: "vendor-mt-forms",
  tabs: "vendor-mt-forms",
  textarea: "vendor-mt-forms",
  timeline: "vendor-mt-base",
  tooltip: "vendor-mt-overlay",
  typography: "vendor-mt-base",
};

// Ordered [predicate, chunk] rules. First match wins — order matches the
// original if-chain, so the mt/node_modules rules stay ahead of mt-core.
const VENDOR_RULES = [
  [(id) => id.includes("@mui/icons-material") || id.includes("@heroicons"), "vendor-icons"],
  [(id) => id.includes("@mui/"), "vendor-mui"],
  [(id) => id.includes("@emotion/"), "vendor-emotion"],
  [(id) => id.includes("@material-tailwind/react/node_modules/framer-motion"), "vendor-motion"],
  [(id) => id.includes("@material-tailwind/react/node_modules/@floating-ui"), "vendor-floating-ui"],
  [(id) => id.includes("@material-tailwind/react/node_modules/"), "vendor-material-tailwind-utils"],
  [(id) => id.includes("@material-tailwind/react/"), "vendor-mt-core"],
  [
    (id) => id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/"),
    "vendor-react",
  ],
  [(id) => id.includes("react-router-dom") || id.includes("@remix-run"), "vendor-router"],
  [(id) => id.includes("@reduxjs/") || id.includes("react-redux"), "vendor-state"],
  [(id) => id.includes("chart.js") || id.includes("react-chartjs-2"), "vendor-charts"],
  [(id) => id.includes("swiper"), "vendor-swiper"],
  [(id) => id.includes("sweetalert2"), "vendor-alerts"],
  [(id) => id.includes("@tanstack/"), "vendor-virtual"],
  [
    (id) => ["/axios/", "/crypto-js/", "/dayjs/", "/formik/", "/yup/"].some((p) => id.includes(p)),
    "vendor-utils",
  ],
];

const getVendorChunk = (id) => {
  if (!id.includes("node_modules")) return undefined;

  const normalizedId = id.replaceAll("\\", "/");

  const componentMatch = normalizedId.match(/@material-tailwind\/react\/components\/([^/]+)/);
  if (componentMatch) {
    return MT_COMPONENT_CHUNKS[componentMatch[1].toLowerCase()] ?? "vendor-mt-base";
  }

  const rule = VENDOR_RULES.find(([test]) => test(normalizedId));
  return rule ? rule[1] : "vendor-misc";
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    chunkSizeWarningLimit: 500,
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
      output: {
        manualChunks: getVendorChunk,
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    // Emit a JUnit report in CI so the pipeline can publish test results.
    reporters: process.env.CI
      ? ["default", ["junit", { outputFile: "test-report.junit.xml" }]]
      : ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/**/*.test.{js,jsx}",
        "src/**/*.spec.{js,jsx}",
        "src/clientComponentHarness.jsx",
        "src/main.jsx",
      ],
      // Quality gate: fail the build if coverage regresses below current levels.
      // Raise these as the i18n migration adds tests.
      thresholds: {
        statements: 80,
        branches: 65,
        functions: 70,
        lines: 85,
      },
    },
  },
});
