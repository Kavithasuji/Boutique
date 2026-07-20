import type { RecentOrder } from '../../types/dashboard';

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-700';

    case 'PROCESSING':
      return 'bg-blue-100 text-blue-700';

    case 'SHIPPED':
      return 'bg-purple-100 text-purple-700';

    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';

    case 'CANCELLED':
      return 'bg-red-100 text-red-700';

    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const RecentOrders = ({
  orders,
}: RecentOrdersProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-gray-900">
          Recent Orders
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest 5 customer orders
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b">

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Customer
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Items
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Total
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500"
                >
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b transition hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {order.customer}
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="px-4 py-4">
                    {order.items}
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    ₹{order.total.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-gray-500">
                    {new Date(
                      order.createdAt,
                    ).toLocaleDateString()}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentOrders;