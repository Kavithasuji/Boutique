import { PackageSearch } from "lucide-react";

const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
      <PackageSearch
        size={64}
        className="mb-4 text-gray-400"
      />

      <h2 className="text-xl font-semibold text-gray-800">
        No Orders Found
      </h2>

      <p className="mt-2 max-w-md text-gray-500">
        We couldn't find any orders matching your current
        search or filter. Try changing the search term or
        selecting a different status.
      </p>
    </div>
  );
};

export default EmptyOrders;