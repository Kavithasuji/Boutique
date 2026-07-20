import { PackageX } from "lucide-react";

const EmptyInventory = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-16">
      <PackageX
        size={64}
        className="mb-4 text-gray-400"
      />

      <h2 className="text-xl font-semibold text-gray-800">
        No Inventory Found
      </h2>

      <p className="mt-2 max-w-md text-center text-gray-500">
        We couldn't find any inventory matching your current search or
        selected category.
      </p>
    </div>
  );
};

export default EmptyInventory;