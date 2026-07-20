import { X } from "lucide-react";
import type { OrderDetails } from "../../types/order";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderDetailsModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold">
              Order Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-6 p-6">

          {/* Customer */}
          <div className="rounded-lg border p-5">
            <h3 className="mb-4 text-lg font-semibold">
              Customer Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="font-medium">
                  {order.user.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-medium">
                  {order.user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="font-medium">
                  {order.shippingPhone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Order Status
                </p>

                <OrderStatusBadge
                  status={order.orderStatus}
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-lg border p-5">
            <h3 className="mb-4 text-lg font-semibold">
              Shipping Address
            </h3>

            <div className="space-y-2">
              <p>{order.shippingName}</p>

              <p>{order.addressLine1}</p>

              {order.addressLine2 && (
                <p>{order.addressLine2}</p>
              )}

              <p>
                {order.city}, {order.state}
              </p>

              <p>
                {order.country} - {order.postalCode}
              </p>
            </div>
          </div>

                 {/* Products */}
          <div className="rounded-lg border p-5">
            <h3 className="mb-4 text-lg font-semibold">
              Ordered Products
            </h3>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center"
                >
                  <img
                    src={item.variant.color.imageUrl}
                    alt={item.variant.product.name}
                    className="h-24 w-24 rounded-lg border object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">
                      {item.variant.product.name}
                    </h4>

                    <div className="mt-2 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                      <p>
                        <span className="font-medium">
                          Color:
                        </span>{" "}
                        {item.variant.color.color}
                      </p>

                      <p>
                        <span className="font-medium">
                          Size:
                        </span>{" "}
                        {item.variant.size}
                      </p>

                      <p>
                        <span className="font-medium">
                          Quantity:
                        </span>{" "}
                        {item.quantity}
                      </p>

                      <p>
                        <span className="font-medium">
                          Price:
                        </span>{" "}
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Subtotal
                    </p>

                    <p className="text-lg font-bold">
                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-lg border p-5">
            <h3 className="mb-4 text-lg font-semibold">
              Payment Information
            </h3>

            {order.payment ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Transaction ID
                  </p>

                  <p className="font-medium break-all">
                    {order.payment.transactionId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <p className="font-medium capitalize">
                    {order.payment.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Payment Status
                  </p>

                  <p className="font-medium">
                    {order.payment.paymentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Amount Paid
                  </p>

                  <p className="font-semibold">
                    ₹{Number(order.payment.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                No payment information available.
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border p-5">
            <h3 className="mb-4 text-lg font-semibold">
              Order Summary
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Total Items
                </span>

                <span className="font-medium">
                  {order.items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Total Amount
                </span>

                <span className="text-lg font-bold">
                  ₹{Number(order.totalAmount).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Ordered On
                </span>

                <span className="font-medium">
                  {new Date(
                    order.createdAt,
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t pt-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-black px-6 py-2 text-white transition hover:bg-gray-800"
            >
              Close
            </button>
          </div>
          {/* Summary */}

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;