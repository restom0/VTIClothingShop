import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";
import UserInfo from "../components/shop/user_info.component";
import Order from "../components/shop/order.component";
import ProductSeen from "../components/shop/seen_product.component";
import ProductLove from "../components/shop/wishlist.component";
import ProductRating from "../components/shop/rating_product.component";
import Voucher from "../components/shop/voucer.component";
const account_menu = [
  {
    label: "Trang cá nhân",
    icon: UserCircleIcon,
    link: "/profile",
  },
  {
    label: "Tin nhắn",
    icon: InboxArrowDownIcon,
    link: "/inbox",
  },
  {
    label: "FAQs",
    icon: LifebuoyIcon,
    link: "/help-center",
  },
  {
    label: "Đăng xuất",
    icon: PowerIcon,
    link: "/login",
  },
];

const footer_menu = [
  {
    title: "Sản phẩm",
    items: [
      {
        label: "Trang chủ",
        link: "/",
      },
      {
        label: "Sản phẩm",
        link: "/product",
      },
      {
        label: "Thương hiệu",
        link: "/brand",
      },
      {
        label: "Danh mục",
        link: "/category",
      },
      {
        label: "Giỏ hàng",
        link: "/cart",
      },
      {
        label: "Thanh toán",
        link: "/checkout",
      },
    ],
  },
  {
    title: "Công ty",
    items: [
      {
        label: "Về chúng tôi",
        link: "/about-us",
      },
      {
        label: "Liên hệ",
        link: "/contact",
      },
      {
        label: "Tuyển dụng",
        link: "/career",
      },
      {
        label: "Điều khoản",
        link: "/terms",
      },
      {
        label: "Chính sách",
        link: "/policy",
      },
      {
        label: "FAQs",
        link: "/faqs",
      },
    ],
  },
  {
    title: "Chăm sóc khách hàng",
    items: [
      {
        label: "Liên hệ",
        link: "/contact",
      },
      {
        label: "Hướng dẫn đạt hàng",
        link: "/terms",
      },
      {
        label: "Phương thức vận chuyển",
        link: "/policy",
      },
      {
        label: "FAQs",
        link: "/faqs",
      },
    ],
  },
];
const profile_menu = [
  {
    label: "Thông tin tài khoản",
    link: <UserInfo />,
  },
  {
    label: "Đơn hàng",
    link: <Order />,
  },
  {
    label: "Sản phẩm đã xem",
    link: <ProductSeen />,
  },
  {
    label: "Sản phẩm yêu thích",
    link: <ProductLove />,
  },
  {
    label: "Đánh giá của bạn",
    link: <ProductRating />,
  },
  {
    label: "Mã giảm giá",
    link: <Voucher />,
  },
];
const report_items = ["doanh thu", "thương hiệu", "danh mục", "sản phẩm"];
const filter_items = [
  { value: "ALL", label: "Tất cả" },
  { value: "PRODUCT", label: "Sản phẩm" },
  { value: "BRAND", label: "Thương hiệu" },
  { value: "CATEGORY", label: "Danh mục" },
  { value: "COLOR", label: "Màu sắc" },
  { value: "SIZE", label: "Kích thước" },
  { value: "MATERIAL", label: "Chất liệu" },
];
export { account_menu, profile_menu, footer_menu, report_items, filter_items };
