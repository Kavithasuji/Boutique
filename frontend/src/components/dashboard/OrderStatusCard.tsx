import  type { OrderStatus } from '../../types/dashboard';

interface OrderStatusCardProps {
  status: OrderStatus;
}

const OrderStatusCard = ({
  status,
}: OrderStatusCardProps) => {
  const items = [
    {
      label: 'Pending',
      value: status.PENDING,
      color: 'bg-yellow-500',
    },
    {
      label: 'Processing',
      value: status.PROCESSING,
      color: 'bg-blue-500',
    },
    {
      label: 'Shipped',
      value: status.SHIPPED,
      color: 'bg-purple-500',
    },
    {
      label: 'Delivered',
      value: status.DELIVERED,
      color: 'bg-green-500',
    },
    {
      label: 'Cancelled',
      value: status.CANCELLED,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Order Status
      </h2>

      <div className="space-y-4">

        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
          >
            <div className="flex items-center gap-3">

              <div
                className={`h-3 w-3 rounded-full ${item.color}`}
              />

              <span className="text-gray-700">
                {item.label}
              </span>

            </div>

            <span className="text-lg font-bold text-gray-900">
              {item.value}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
};

export default OrderStatusCard;