import { useEffect, useState } from "react";

import type { Inventory } from "../../types/inventory";

import { updateInventory } from "../../services/inventoryService";

interface UpdateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Inventory;
  refreshInventory: () => Promise<void>;
}

const UpdateInventoryModal = ({
  isOpen,
  onClose,
  inventory,
  refreshInventory,
}: UpdateInventoryModalProps) => {
  const [stock, setStock] = useState(0);
  const [lowStockAlert, setLowStockAlert] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inventory) {
      setStock(inventory.stock);
      setLowStockAlert(inventory.lowStockAlert);
    }
  }, [inventory]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateInventory(inventory.id, {
        stock,
        lowStockAlert,
      });

      await refreshInventory();

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Update Inventory
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Modify stock information for this product variant.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Product
            </label>

            <input
              disabled
              value={inventory.variant.product.name}
              className="w-full rounded-lg border bg-gray-100 px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                SKU
              </label>

              <input
                disabled
                value={inventory.sku}
                className="w-full rounded-lg border bg-gray-100 px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>

              <input
                disabled
                value={inventory.variant.product.category.name}
                className="w-full rounded-lg border bg-gray-100 px-4 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Color
              </label>

              <input
                disabled
                value={inventory.variant.color.color}
                className="w-full rounded-lg border bg-gray-100 px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Size
              </label>

              <input
                disabled
                value={inventory.variant.size}
                className="w-full rounded-lg border bg-gray-100 px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Stock Quantity
            </label>

            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) =>
                setStock(Number(e.target.value))
              }
              className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Low Stock Alert
            </label>

            <input
              type="number"
              min={0}
              value={lowStockAlert}
              onChange={(e) =>
                setLowStockAlert(Number(e.target.value))
              }
              className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Inventory"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInventoryModal;