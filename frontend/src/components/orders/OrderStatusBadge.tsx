import type { OrderStatus } from "../../types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 border border-yellow-200",

  PROCESSING:
    "bg-blue-100 text-blue-800 border border-blue-200",

  SHIPPED:
    "bg-purple-100 text-purple-800 border border-purple-200",

  DELIVERED:
    "bg-green-100 text-green-800 border border-green-200",

  CANCELLED:
    "bg-red-100 text-red-800 border border-red-200",
};

const OrderStatusBadge = ({
  status,
}: OrderStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

export default OrderStatusBadge;