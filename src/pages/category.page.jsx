import { useParams } from "react-router-dom";
import BreadcrumbsWithIcon from "../components/shared/breadcrumbs.component";
import CategoryFilter from "../components/shared/shop/CategoryFilter";
import BrandFilter from "../components/shared/shop/BrandFilter";
import ProductFilter from "../components/shared/shop/ProductFilter";
import ShopList from "../components/shared/shop/ShopList";
import Loading from "../components/shared/loading.component";
import { useGetOnSaleProductsQuery } from "../apis/on_sale_product.api";
import { useI18n } from "../i18n";
import {
  filterShopProducts,
  getResponseItems,
  normalizeShopProducts,
} from "../utils/shop_product.util";
/** Handles catepage. */
const Catepage = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetOnSaleProductsQuery();
  const { t } = useI18n();
  const products = filterShopProducts(normalizeShopProducts(getResponseItems(data)), {
    categoryId: id,
  });

  if (isLoading) return <Loading />;

  return (
    <main className="page-container shop-browse-page">
      <div className="mb-5">
        <BreadcrumbsWithIcon name={id ?? null} />
      </div>
      <div className="shop-browse-layout">
        <aside className="shop-filter-panel">
          {!id && <CategoryFilter />}
          <BrandFilter />
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

export default Catepage;
