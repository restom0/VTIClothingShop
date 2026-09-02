import { memo } from "react";
import PropTypes from "prop-types";
import { useCurrency } from "../../../currency";
import { useI18n } from "../../../i18n";
import LazyImage from "../LazyImage";
import ScrollReveal from "../ScrollReveal";
import {
  getShopProductImageUrl,
  getShopProductName,
  getShopProductPrice,
} from "../../../utils/shop_product.util";

/**
 * ProductCard — thẻ sản phẩm.
 *
 * a11y:
 *  - Dùng <a href> thực sự thay vì div[role=link] (WCAG 4.1.2)
 *  - aria-label mô tả đầy đủ: tên + giá + giảm giá (WCAG 1.3.1)
 *  - LazyImage nhận alt text là tên sản phẩm
 *
 * performance:
 *  - React.memo: chỉ re-render khi props thay đổi
 *  - LazyImage đã dùng loading="lazy" + decoding="async"
 */
const ProductCard = memo(
  ({ discount = 0, id, imageUrl, price, product_id, sale_price, salePrice, title }) => {
    const { formatPrice } = useCurrency();
    const { t } = useI18n();

    const productInfo = product_id?.product_id ?? product_id?.product ?? product_id ?? {};
    const productName = getShopProductName({ product: productInfo, title });
    const productImage = imageUrl ?? getShopProductImageUrl({ product_id });
    const originalPrice = sale_price ?? salePrice ?? getShopProductPrice({ price, product_id });
    const finalPrice = originalPrice * (1 - discount / 100);
    const hasDiscount = discount > 0;

    // Mô tả đầy đủ cho screen reader
    const ariaLabel = hasDiscount
      ? t("product.card_aria_discount", {
          discount,
          originalPrice: formatPrice(originalPrice),
          price: formatPrice(finalPrice),
          productName,
        })
      : t("product.card_aria", {
          price: formatPrice(finalPrice),
          productName,
        });

    return (
      <ScrollReveal variant="fade-up" className="card-product" as="article">
        {/*
        <a href> thay thế div[role=link]:
        - Semantic HTML đúng chuẩn WCAG 4.1.2
        - Keyboard focusable mặc định (không cần tabIndex)
        - Enter/Space kích hoạt mặc định (không cần onKeyDown)
        - Screen reader đọc đúng "link"
      */}
        <a href={`/product/${id}`} className="card-product__link" aria-label={ariaLabel}>
          <div className="card-product__image">
            <LazyImage
              src={productImage}
              alt={productName}
              aspectRatio="4/3"
              wrapperClassName="card-product__lazy"
            />
          </div>

          <div className="card-product__body" aria-hidden="true">
            {/* aria-hidden vì aria-label trên <a> đã mô tả đầy đủ */}
            <p className="card-product__name">{productName}</p>

            <div className="card-product__price-row">
              <span className="card-product__price-sale">{formatPrice(finalPrice)}</span>
              {hasDiscount && (
                <span className="badge-discount" aria-hidden="true">
                  -{discount}%
                </span>
              )}
              {hasDiscount && (
                <span className="card-product__price-original" aria-hidden="true">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </a>
      </ScrollReveal>
    );
  }
);

ProductCard.displayName = "ProductCard";

ProductCard.propTypes = {
  discount: PropTypes.number,
  id: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  price: PropTypes.number,
  product_id: PropTypes.shape({
    image_url: PropTypes.string,
    product_id: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  sale_price: PropTypes.number,
  salePrice: PropTypes.number,
  title: PropTypes.string,
};

export default ProductCard;
