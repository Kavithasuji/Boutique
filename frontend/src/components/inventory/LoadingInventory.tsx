const LoadingInventory = () => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: 8 }).map((_, index) => (
              <th
                key={index}
                className="px-6 py-3"
              >
                <div className="h-4 animate-pulse rounded bg-gray-300" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 8 }).map((_, row) => (
            <tr key={row} className="border-t">
              {Array.from({ length: 8 }).map((_, col) => (
                <td
                  key={col}
                  className="px-6 py-4"
                >
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingInventory;