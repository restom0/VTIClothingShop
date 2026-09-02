import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Option, Select } from "@material-tailwind/react/components/Select";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import Pagination from "../pagination.component";
import VirtualizedGrid from "../VirtualizedGrid";
import usePaginatedItems from "../../../hooks/usePaginatedItems.hook";
import useResponsiveColumns from "../../../hooks/useResponsiveColumns.hook";
import { useI18n } from "../../../i18n";
import { sortShopProducts } from "../../../utils/shop_product.util";

const PRODUCT_PAGE_SIZE = 24;
const VIRTUAL_PRODUCT_ROW_ESTIMATE = 384;

/**
 * ShopList — danh sách sản phẩm với virtualization + pagination.
 *
 * a11y:
 *  - aria-live="polite" trên kết quả count (WCAG 4.1.3 — Status Messages)
 *  - aria-label trên <section> và sort <Select>
 *  - Scroll về đầu grid khi chuyển trang
 *
 * performance:
 *  - React.memo: chỉ re-render khi products thay đổi
 *  - useCallback: memoize renderItem + getKey
 */
const ShopList = memo(({ products }) => {
  const { t } = useI18n();
  const [filter, setFilter] = useState("new");
  const [active, setActive] = useState(1);
  const gridRef = useRef(null);
  const sortedProducts = useMemo(() => sortShopProducts(products, filter), [filter, products]);

  const columns = useResponsiveColumns();
  const { pageCount, pageItems } = usePaginatedItems(sortedProducts, active, PRODUCT_PAGE_SIZE);

  // Scroll về đầu danh sách mỗi khi chuyển trang
  useEffect(() => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  // Memoize callbacks để tránh VirtualizedGrid re-render không cần thiết
  /** Renders item. */
  const renderItem = useCallback((product) => <ProductCard {...product} />, []);
  /** Gets key. */
  const getKey = useCallback((product) => product.id, []);
  /** Handles page. */
  const handlePage = useCallback((page) => setActive(page), []);

  return (
    <section className="shop-results" aria-label={t("shop.product_list_aria")}>
      {/* Toolbar: kết quả + sort */}
      <div className="shop-list-toolbar">
        {/*
          aria-live="polite": screen reader thông báo khi số kết quả đổi
          (WCAG 4.1.3 — Status Messages)
        */}
        <div className="results-count" aria-live="polite" aria-atomic="true">
          <span className="sr-only">{t("shop.results_count_sr")}: </span>
          {t("shop.results_count", { count: sortedProducts.length })}
        </div>

        <div className="cluster-sm">
          {/* htmlFor không dùng được với Select của MT, dùng aria-label thay */}
          <label id="sort-label" className="text-sm">
            {t("shop.sort_label")}:
          </label>
          <span>
            <Select
              value={filter}
              onChange={setFilter}
              className="rounded"
              aria-labelledby="sort-label"
              aria-label={t("shop.sort_aria")}
            >
              <Option value="new">{t("shop.sort_newest")}</Option>
              <Option value="old">{t("shop.sort_oldest")}</Option>
              <Option value="A->Z">A → Z</Option>
              <Option value="Z->A">Z → A</Option>
              <Option value="price-asc">{t("shop.sort_price_asc")}</Option>
              <Option value="price-desc">{t("shop.sort_price_desc")}</Option>
            </Select>
          </span>
        </div>
      </div>

      {/* Ref dùng để scroll về đầu khi đổi trang */}
      <div ref={gridRef}>
        <VirtualizedGrid
          className="virtual-shop-grid"
          columns={columns}
          estimateRowHeight={VIRTUAL_PRODUCT_ROW_ESTIMATE}
          getKey={getKey}
          items={pageItems}
          renderItem={renderItem}
          aria-label={t("shop.page_aria", { page: active, count: pageItems.length })}
        />
      </div>

      <Pagination page={pageCount} active={active} setActive={handlePage} />
    </section>
  );
});

ShopList.displayName = "ShopList";

ShopList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ShopList;
