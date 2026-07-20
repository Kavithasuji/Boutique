import { Eye } from "lucide-react";

import { useState } from "react";

import {
  getOrderById,
  updateOrderStatus,
} from "../../services/adminOrderService";

import type {
  Order,
  OrderDetails,
  OrderStatus,
} from "../../types/order";

import OrderStatusBadge from "./OrderStatusBadge";
import OrderDetailsModal from "./OrderDetailsModal";

interface OrderTableProps {
  orders: Order[];
  refreshOrders: () => void;
}

const OrderTable = ({
  orders,
  refreshOrders,
}: OrderTableProps) => {
  const [selectedOrder, setSelectedOrder] =
    useState<OrderDetails | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [loadingOrder, setLoadingOrder] =
    useState(false);

  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus,
  ) => {
    try {
      await updateOrderStatus(orderId, status);

      refreshOrders();
    } catch (error) {
      console.error(error);

      alert("Failed to update order status.");
    }
  };

  const handleViewOrder = async (
    orderId: string,
  ) => {
    try {
      setLoadingOrder(true);

      const response =
        await getOrderById(orderId);

      setSelectedOrder(response.order);

      setIsModalOpen(true);
    } catch (error) {
      console.error(error);

      alert("Failed to load order.");
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">
                Order ID
              </th>

              <th className="px-6 py-4">
                Customer
              </th>

              <th className="px-6 py-4">
                Phone
              </th>

              <th className="px-6 py-4">
                Items
              </th>

              <th className="px-6 py-4">
                Total
              </th>

              <th className="px-6 py-4">
                Payment
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Update
              </th>

              <th className="px-6 py-4">
                Date
              </th>

              <th className="px-6 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  #
                  {order.id
                    .slice(-8)
                    .toUpperCase()}
                </td>

                <td className="px-6 py-4">
                  {order.shippingName}
                </td>

                <td className="px-6 py-4">
                  {order.shippingPhone}
                </td>

                <td className="px-6 py-4">
                  {order.items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0,
                  )}
                </td>

                <td className="px-6 py-4 font-semibold">
                  ₹
                  {Number(
                    order.totalAmount,
                  ).toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  {order.paymentStatus}
                </td>

                <td className="px-6 py-4">
                  <OrderStatusBadge
                    status={
                      order.orderStatus
                    }
                  />
                </td>

                <td className="px-6 py-4">
                  <select
                    value={
                      order.orderStatus
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target
                          .value as OrderStatus,
                      )
                    }
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  >
                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="PROCESSING">
                      Processing
                    </option>

                    <option value="SHIPPED">
                      Shipped
                    </option>

                    <option value="DELIVERED">
                      Delivered
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>
                  </select>
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    order.createdAt,
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() =>
                      handleViewOrder(
                        order.id,
                      )
                    }
                    disabled={
                      loadingOrder
                    }
                    className="inline-flex items-center justify-center rounded-md p-2 transition hover:bg-gray-100"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
};

export default OrderTable;