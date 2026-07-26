import { ROUTES } from "../../../constants/routes.constant";
import React, { useEffect } from "react";
import "./NavbarWithSublist.css";
import { Navbar } from "@material-tailwind/react/components/Navbar";
import { Collapse } from "@material-tailwind/react/components/Collapse";
import { Button } from "@material-tailwind/react/components/Button";
import { IconButton } from "@material-tailwind/react/components/IconButton";
import { List, ListItem } from "@material-tailwind/react/components/List";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react/components/Menu";
import { Input } from "@material-tailwind/react/components/Input";
import { Tooltip } from "@material-tailwind/react/components/Tooltip";
import {
  Bars3Icon,
  ChevronDownIcon,
  CircleStackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Divider } from "@mui/material";
import { useGetBrandsQuery } from "../../../apis/brand.api";
import { useGetCategoriesQuery } from "../../../apis/category.api";
import { useGetCartQuery } from "../../../apis/order.api";
import LanguageSwitcher from "../LanguageSwitcher";
import SkeletonBlock from "../SkeletonBlock";
import ThemeSwitcher from "../ThemeSwitcher";
import SeasonSwitcher from "../SeasonSwitcher";
import useDelayedLoading from "../../../hooks/useDelayedLoading.hook";
import { useCurrency } from "../../../currency";
import { useDemoMode } from "../../../demo/demoMode";
import { useI18n } from "../../../i18n";
import { ACTION_ROW_CLASSNAME } from "../../../styles/classNames";
import { STORAGE_KEYS } from "../../../constants/storage.constant";
import {
  NAV_SKELETON_DELAY_MS,
  NAV_SKELETON_WIDTHS,
  getCartLabels,
  getCartRoute,
  getCartTooltipRows,
  getCartTotal,
  getDropdownColumnCount,
  getMenuItems,
  getNavbarLabels,
} from "./navbar.helpers";

/** Checks whether auth token. */
const hasAuthToken = () => Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN));
const RTK_QUERY_REDUCER_PATHS = [
  "brandApi",
  "categoryApi",
  "userApi",
  "importedProductApi",
  "AccountApi",
  "voucherApi",
  "chatApi",
  "CommentApi",
  "InputSaleApi",
  "onSaleProductApi",
  "OrderApi",
  "OrderItemApi",
  "ProductApi",
  "logApi",
  "StatApi",
];

/** Resets cached RTK Query data after data source changes. */
export const resetRtkQueryCache = (dispatch) => {
  RTK_QUERY_REDUCER_PATHS.forEach((reducerPath) =>
    dispatch({ type: `${reducerPath}/resetApiState` })
  );
};

/** Checks whether desktop resize should close the mobile nav. */
export const shouldCloseNavOnDesktop = (width) => width >= 960;

/** Saves the active cart order id for later cart updates. */
export const saveCartOrderId = (cart, storage = localStorage) => {
  if (cart) storage.setItem(STORAGE_KEYS.ORDER_ID, cart.object.id);
};

/** Navigates to cart or login based on authentication state. */
export const goToNavbarCart = (navigate, hasToken) => navigate(getCartRoute(hasToken));

/** Creates the mobile nav toggle handler. */
export const createToggleNavHandler = (setOpenNav) => () => setOpenNav((current) => !current);

/** Handles search SVG. */
const SearchSVG = () => (
  <svg width="13" height="14" viewBox="0 0 14 15" fill="none">
    <path
      d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
      fill="var(--color-border-strong)"
    />
    <path
      d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Handles nav skeleton. */
export const NavSkeleton = () => (
  <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
    {NAV_SKELETON_WIDTHS.map((width) => (
      <SkeletonBlock
        as="li"
        key={width}
        className="skeleton-nav-item list-none"
        style={{ width }}
      />
    ))}
  </List>
);

/** Handles nav menu items. */
const NavMenuItems = ({ items, type }) =>
  items.map(({ name: itemName, id }) => (
    <a href={`/${type}/${id}`} key={id}>
      <MenuItem className="flex items-center gap-3 rounded-lg">
        <span className="nav-menu-link-label">{itemName}</span>
      </MenuItem>
    </a>
  ));

NavMenuItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  type: PropTypes.string.isRequired,
};

/** Handles nav list menu. */
export const NavListMenu = ({ name, type, data }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const items = getMenuItems(data);

  if (!items.length) return null;

  const cols = getDropdownColumnCount(items);
  /** Renders items. */
  const renderItems = () => <NavMenuItems items={items} type={type} />;

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover
      >
        <MenuHandler>
          <div>
            <ListItem
              className="nav-list-item"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => {
                setIsMobileMenuOpen((cur) => !cur);
                navigate(`/${type}`);
              }}
            >
              {name}
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${isMenuOpen ? "rotate-180" : ""}`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${isMobileMenuOpen ? "rotate-180" : ""}`}
              />
            </ListItem>
          </div>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className={`grid grid-cols-${cols} gap-y-2 outline-none`}>{renderItems()}</ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems()}</Collapse>
      </div>
    </React.Fragment>
  );
};

NavListMenu.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({
    object: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }),
};

/** Handles nav list view. */
export const NavListView = ({ brands, categories, labels }) => (
  <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
    <a href={ROUTES.PRODUCT}>
      <ListItem className="nav-list-item">{labels.productList}</ListItem>
    </a>
    <NavListMenu name={labels.brands} type="brand" data={brands} />
    <NavListMenu name={labels.categories} type="category" data={categories} />
    <a href={ROUTES.ABOUT_US}>
      <ListItem className="nav-list-item">{labels.aboutUs}</ListItem>
    </a>
    <a href={ROUTES.CONTACT}>
      <ListItem className="nav-list-item">{labels.contact}</ListItem>
    </a>
  </List>
);

NavListView.propTypes = {
  brands: PropTypes.object,
  categories: PropTypes.object,
  labels: PropTypes.shape({
    productList: PropTypes.string.isRequired,
    brands: PropTypes.string.isRequired,
    categories: PropTypes.string.isRequired,
    aboutUs: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
  }).isRequired,
};

/** Handles nav list. */
const NavList = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data: brands, error: err1, isLoading: loading1 } = useGetBrandsQuery();
  const { data: categories, error: err2, isLoading: loading2 } = useGetCategoriesQuery();
  const isNavLoading = loading1 || loading2;
  const shouldShowSkeleton = useDelayedLoading(isNavLoading, NAV_SKELETON_DELAY_MS);

  if (err1 || err2) {
    navigate(ROUTES.ERROR);
    return null;
  }

  if (isNavLoading) return shouldShowSkeleton ? <NavSkeleton /> : null;

  return <NavListView brands={brands} categories={categories} labels={getNavbarLabels(t)} />;
};

/** Handles cart tooltip view. */
export const CartTooltipView = ({ formatPrice, labels, rows, total }) => (
  <div className="nav-tooltip-panel">
    <div className="flex-between mb-3">
      <span className="font-semibold">{labels.cart}</span>
      <span className="nav-tooltip-muted">{labels.itemCount}</span>
    </div>
    <Divider />
    <div className="grid grid-cols-1 gap-3 my-3">
      {rows.map(({ id, imageUrl, title, quantity, unitPrice, lineTotal }) => (
        <div key={id} className="grid grid-cols-5 gap-3 items-center">
          <img
            src={imageUrl}
            alt={title ? `${labels.productImageAlt}: ${title}` : labels.productImageAlt}
            className="w-12 h-12 object-cover rounded mx-auto"
          />
          <span className="text-xs font-medium col-span-1 text-center">{title}</span>
          <span className="text-xs text-center">{quantity}x</span>
          <span className="text-xs text-center">{formatPrice(unitPrice)}</span>
          <span className="nav-tooltip-line-total">{formatPrice(lineTotal)}</span>
        </div>
      ))}
    </div>
    <Divider />
    <div className="flex-between mt-3">
      <span className="font-semibold">{labels.total}</span>
      <span className="nav-tooltip-total-value">{formatPrice(total)}</span>
    </div>
  </div>
);

CartTooltipView.propTypes = {
  formatPrice: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    cart: PropTypes.string.isRequired,
    itemCount: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired,
    productImageAlt: PropTypes.string.isRequired,
  }).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      unitPrice: PropTypes.number.isRequired,
      lineTotal: PropTypes.number.isRequired,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
};

/** Handles cart tooltip. */
const CartTooltip = ({ cart }) => {
  const { t } = useI18n();
  const { formatPrice } = useCurrency();
  const rows = getCartTooltipRows(cart);

  return (
    <CartTooltipView
      formatPrice={formatPrice}
      labels={getCartLabels(t, rows.length)}
      rows={rows}
      total={getCartTotal(cart)}
    />
  );
};

CartTooltip.propTypes = {
  cart: PropTypes.object,
};

/** Handles demo mode button. */
const DemoModeButton = ({ fullWidth = false, isDemoMode, labels, onDemoModeToggle }) => {
  const buttonLabel = isDemoMode ? labels.demoModeOn : labels.demoMode;
  const ariaLabel = isDemoMode ? labels.disableDemoMode : labels.enableDemoMode;

  return (
    <Tooltip content={ariaLabel}>
      <Button
        type="button"
        size="sm"
        variant={isDemoMode ? "filled" : "outlined"}
        color={isDemoMode ? "green" : "blue-gray"}
        className="nav-demo-toggle normal-case"
        onClick={onDemoModeToggle}
        aria-pressed={isDemoMode}
        aria-label={ariaLabel}
        fullWidth={fullWidth}
      >
        <CircleStackIcon className="h-4 w-4" />
        <span>{buttonLabel}</span>
      </Button>
    </Tooltip>
  );
};

DemoModeButton.propTypes = {
  fullWidth: PropTypes.bool,
  isDemoMode: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    demoMode: PropTypes.string.isRequired,
    demoModeOn: PropTypes.string.isRequired,
    enableDemoMode: PropTypes.string.isRequired,
    disableDemoMode: PropTypes.string.isRequired,
  }).isRequired,
  onDemoModeToggle: PropTypes.func.isRequired,
};

/** Handles navbar view. */
export const NavbarView = ({
  cart,
  isDemoMode,
  labels,
  onCartClick,
  onDemoModeToggle,
  onToggleNav,
  openNav,
}) => (
  <Navbar
    className="mx-auto max-w-screen-3xl rounded-none px-4 py-2 sticky top-0 z-50"
    aria-label={labels.mainAria}
    as="nav"
  >
    <div className="flex-between">
      <a href={ROUTES.HOME} className="navbar-brand mr-4 lg:ml-2">
        <span className="brand-highlight">VTI</span> Shop
      </a>

      <div className="hidden lg:block">
        <NavList />
      </div>

      <div className="hidden items-center gap-3 lg:flex">
        <DemoModeButton
          isDemoMode={isDemoMode}
          labels={labels}
          onDemoModeToggle={onDemoModeToggle}
        />

        <div className="relative flex w-60">
          <Input
            type="text"
            placeholder={`${labels.search}...`}
            className="!border !border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:!border-gray-900"
            labelProps={{ className: "hidden" }}
            containerProps={{ className: "min-w-0" }}
          />
          <button
            type="button"
            className="!absolute right-2 top-1/2 -translate-y-1/2 btn-ghost p-1 rounded"
            aria-label={labels.search}
          >
            <SearchSVG />
          </button>
        </div>

        <SeasonSwitcher />
        <ThemeSwitcher />
        <LanguageSwitcher />

        <Tooltip
          placement="bottom-end"
          className="bg-white text-black shadow-lg p-4 rounded-lg"
          content={<CartTooltip cart={cart} />}
        >
          <button
            type="button"
            className="btn-ghost p-2 rounded-lg"
            onClick={onCartClick}
            aria-label={labels.cart}
          >
            <ShoppingCartIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>

      {/* aria-expanded + aria-controls: WCAG 4.1.2 — Name, Role, Value */}
      <IconButton
        variant="text"
        color="blue-gray"
        className="lg:hidden"
        onClick={onToggleNav}
        aria-expanded={openNav}
        aria-controls="mobile-nav"
        aria-label={openNav ? labels.closeMenu : labels.openMenu}
      >
        {openNav ? (
          <XMarkIcon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Bars3Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        )}
      </IconButton>
    </div>

    {/* id="mobile-nav" khớp với aria-controls trên toggle button */}
    <Collapse open={openNav} id="mobile-nav">
      <NavList />
      <div className={ACTION_ROW_CLASSNAME}>
        <DemoModeButton
          fullWidth
          isDemoMode={isDemoMode}
          labels={labels}
          onDemoModeToggle={onDemoModeToggle}
        />
        <SeasonSwitcher />
        <ThemeSwitcher />
        <LanguageSwitcher />
        <a href={ROUTES.LOGIN} className="flex-1">
          <Button variant="gradient" size="sm" color="blue-gray" fullWidth>
            {labels.login}
          </Button>
        </a>
      </div>
    </Collapse>
  </Navbar>
);

NavbarView.propTypes = {
  cart: PropTypes.object,
  isDemoMode: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    search: PropTypes.string.isRequired,
    cart: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    mainAria: PropTypes.string.isRequired,
    openMenu: PropTypes.string.isRequired,
    closeMenu: PropTypes.string.isRequired,
    demoMode: PropTypes.string.isRequired,
    demoModeOn: PropTypes.string.isRequired,
    enableDemoMode: PropTypes.string.isRequired,
    disableDemoMode: PropTypes.string.isRequired,
  }).isRequired,
  onCartClick: PropTypes.func.isRequired,
  onDemoModeToggle: PropTypes.func.isRequired,
  onToggleNav: PropTypes.func.isRequired,
  openNav: PropTypes.bool.isRequired,
};

/** Handles navbar with sublist. */
const NavbarWithSublist = () => {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useI18n();
  const [isDemoMode, setIsDemoMode] = useDemoMode();

  React.useEffect(() => {
    /** Closes value. */
    const close = () => shouldCloseNavOnDesktop(window.innerWidth) && setOpenNav(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const { data: cart } = useGetCartQuery(undefined, {
    skip: !hasAuthToken(),
  });

  useEffect(() => {
    saveCartOrderId(cart);
  }, [cart]);

  /** Handles go to cart. */
  const goToCart = () => goToNavbarCart(navigate, hasAuthToken());
  /** Handles demo mode toggle. */
  const toggleDemoMode = () => {
    const enabled = setIsDemoMode(!isDemoMode);
    resetRtkQueryCache(dispatch);
    if (enabled) navigate(ROUTES.PRODUCT);
  };

  return (
    <NavbarView
      cart={cart}
      isDemoMode={isDemoMode}
      labels={getNavbarLabels(t)}
      onCartClick={goToCart}
      onDemoModeToggle={toggleDemoMode}
      onToggleNav={createToggleNavHandler(setOpenNav)}
      openNav={openNav}
    />
  );
};

export default NavbarWithSublist;
