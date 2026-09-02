import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardHeader, CardBody } from "@material-tailwind/react/components/Card";
import { Input } from "@material-tailwind/react/components/Input";
import { Typography } from "@material-tailwind/react/components/Typography";
import { Chip } from "@material-tailwind/react/components/Chip";
import { IconButton } from "@material-tailwind/react/components/IconButton";
import { Tooltip } from "@material-tailwind/react/components/Tooltip";
import Pagination from "../shared/pagination.component";
import Tablist from "../shared/list_tab.component";
import { allorder_tab } from "../../constants/tab.constant";
import TableHeader from "../shared/header_table";
import { order } from "../../constants/head_table.constant";
import { useI18n } from "../../i18n";
import { ORDER_STATUS } from "../../constants/status.constant";
import { useCurrency } from "../../currency";
import { useDeleteOrderMutation, useGetOrdersByUserQuery } from "../../apis/order.api";
import Loading from "../shared/loading.component";
import { getResponseItems } from "../../utils/shop_product.util";

const ORDER_STATUS_LABEL_KEYS = {
  CANCELLED: "order.status_cancelled",
  COMPLETED: "order.status_completed",
  CONFIRMED: "order.status_confirmed",
  DELIVERING: "order.status_delivering",
  ON_HOLD: "order.status_on_hold",
  NOT_CONFIRMED: "order.status_on_hold",
};

const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.CANCELLED]: "red",
  [ORDER_STATUS.COMPLETED]: "green",
  [ORDER_STATUS.CONFIRMED]: "cyan",
  [ORDER_STATUS.DELIVERING]: "blue",
  [ORDER_STATUS.NOT_CONFIRMED]: "blue-gray",
  [ORDER_STATUS.ON_HOLD]: "blue-gray",
};

const ORDER_STATUS_ALIASES = {
  PAID: ORDER_STATUS.CONFIRMED,
  PENDING: ORDER_STATUS.ON_HOLD,
};
const PAGE_SIZE = 10;

/** Gets order status color. */
const getOrderStatusColor = (status) => ORDER_STATUS_COLORS[status] ?? "red";
const normalizeOrderStatus = (status) =>
  ORDER_STATUS_ALIASES[status] ?? status ?? ORDER_STATUS.ON_HOLD;
const getOrderCode = (orderItem) => orderItem.order_code ?? orderItem.orderCode ?? orderItem.id;
const getOrderTotal = (orderItem) => Number(orderItem.total_price ?? orderItem.totalPrice ?? 0);
const getOrderDate = (orderItem) =>
  orderItem.created_at ?? orderItem.createdAt ?? orderItem.updated_at ?? "";
const formatOrderDate = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale).format(date);
};

/** Handles order. */
const Order = () => {
  const [tab, setTab] = React.useState("ALL");
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState(1);
  const { t } = useI18n();
  const { formatPrice, locale } = useCurrency();
  const { data, error, isLoading } = useGetOrdersByUserQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const orders = React.useMemo(
    () =>
      getResponseItems(data).map((orderItem) => ({
        date: formatOrderDate(getOrderDate(orderItem), locale),
        id: orderItem.id,
        key: orderItem.id ?? getOrderCode(orderItem),
        status: normalizeOrderStatus(orderItem.payment_status ?? orderItem.paymentStatus),
        sum: formatPrice(getOrderTotal(orderItem)),
        title: String(getOrderCode(orderItem) ?? ""),
      })),
    [data, formatPrice, locale]
  );
  const filteredOrders = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return orders.filter((orderItem) => {
      const matchesTab = tab === "ALL" || orderItem.status === tab;
      const matchesSearch = !keyword || orderItem.title.toLowerCase().includes(keyword);
      return matchesTab && matchesSearch;
    });
  }, [orders, search, tab]);
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pageRows = filteredOrders.slice((active - 1) * PAGE_SIZE, active * PAGE_SIZE);

  React.useEffect(() => {
    setActive(1);
  }, [search, tab]);

  if (isLoading) return <Loading />;

  /** Gets order status label. */
  const getOrderStatusLabel = (status) =>
    t(ORDER_STATUS_LABEL_KEYS[status] ?? "order.status_unknown");
  /** Handles cancel order. */
  const handleCancelOrder = (id) => {
    if (id) deleteOrder(id);
  };
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {t("order.list_title")}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <div className="w-full md:w-72">
              <Input
                label={t("common.search")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
        <Tablist TABS={allorder_tab} tab={tab} setTab={setTab} />
      </CardHeader>
      <CardBody className="overflow-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <TableHeader TABLE_HEAD={order} />
          <tbody>
            {error && (
              <tr>
                <td colSpan={order.length + 1} className="p-4 text-center text-sm text-red-700">
                  {t("notification.error_message")}
                </td>
              </tr>
            )}
            {!error && pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={order.length + 1}
                  className="p-4 text-center text-sm text-blue-gray-500"
                >
                  {t("table.empty")}
                </td>
              </tr>
            )}
            {!error &&
              pageRows.map(({ date, id, key, status, sum, title }, index) => {
                const isLast = index === pageRows.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={key}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {title}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {sum}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={getOrderStatusLabel(status)}
                          color={getOrderStatusColor(status)}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {date}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content={t("order.cancel_order")}>
                        <IconButton
                          variant="text"
                          color="red"
                          disabled={[ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(
                            status
                          )}
                          onClick={() => handleCancelOrder(id)}
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </CardBody>
      <Pagination page={pageCount} active={active} setActive={setActive} />
    </Card>
  );
};
export default Order;
