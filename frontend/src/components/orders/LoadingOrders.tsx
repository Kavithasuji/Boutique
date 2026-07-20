const LoadingOrders = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Order ID",
              "Customer",
              "Phone",
              "Items",
              "Total",
              "Payment",
              "Status",
              "Update",
              "Date",
              "Action",
            ].map((heading) => (
              <th
                key={heading}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="border-t">
              {Array.from({ length: 10 }).map((_, cell) => (
                <td key={cell} className="px-6 py-4">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingOrders;