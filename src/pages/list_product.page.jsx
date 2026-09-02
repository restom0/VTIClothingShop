import BreadcrumbsWithIcon from "../components/shared/breadcrumbs.component";
import BrandFilter from "../components/shared/shop/BrandFilter";
import CategoryFilter from "../components/shared/shop/CategoryFilter";
import ProductFilter from "../components/shared/shop/ProductFilter";
import ShopList from "../components/shared/shop/ShopList";
import Loading from "../components/shared/loading.component";
import { useGetOnSaleProductsQuery } from "../apis/on_sale_product.api";
import { useI18n } from "../i18n";
import { getResponseItems, normalizeShopProducts } from "../utils/shop_product.util";

/** Handles productpage. */
const Productpage = () => {
  const { data, error, isLoading } = useGetOnSaleProductsQuery();
  const { t } = useI18n();
  const products = normalizeShopProducts(getResponseItems(data));

  if (isLoading) return <Loading />;

  return (
    <main className="page-container shop-browse-page">
      <div className="mb-5">
        <BreadcrumbsWithIcon />
      </div>
      <div className="shop-browse-layout">
        <aside className="shop-filter-panel">
          <BrandFilter />
          <CategoryFilter />
          <ProductFilter />
        </aside>
        {error && (
          <p className="rounded border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("notification.error_message")}
          </p>
        )}
        <ShopList products={products} />
      </div>
    </main>
  );
};

export default Productpage;
