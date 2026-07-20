import { useState } from "react";
import { Pencil } from "lucide-react";

import type { Inventory } from "../../types/inventory";

import { getInventoryById } from "../../services/inventoryService";

import StockBadge from "./StockBadge";
import UpdateInventoryModal from "./UpdateInventoryModal";

interface InventoryTableProps {
  inventory: Inventory[];
  refreshInventory: () => Promise<void>;
}

const InventoryTable = ({
  inventory,
  refreshInventory,
}: InventoryTableProps) => {
  const [selectedInventory, setSelectedInventory] =
    useState<Inventory | null>(null);

  const [loadingInventory, setLoadingInventory] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const handleEdit = async (id: string) => {
    try {
      setLoadingInventory(true);

      const response = await getInventoryById(id);

      setSelectedInventory(response.inventory);

      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingInventory(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Product
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold">
                SKU
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold">
                Category
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold">
                Color
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold">
                Size
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold">
                Stock
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-3 text-center text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.variant.color.imageUrl}
                      alt={item.variant.product.name}
                      className="h-12 w-12 rounded object-cover"
                    />

                    <span className="font-medium">
                      {item.variant.product.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {item.sku}
                </td>

                <td className="px-6 py-4">
                  {item.variant.product.category.name}
                </td>

                <td className="px-6 py-4">
                  {item.variant.color.color}
                </td>

                <td className="px-6 py-4">
                  {item.variant.size}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {item.stock}
                </td>

                <td className="px-6 py-4">
                  <StockBadge
                    stock={item.stock}
                    lowStockAlert={item.lowStockAlert}
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleEdit(item.id)}
                      disabled={loadingInventory}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInventory && (
        <UpdateInventoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInventory(null);
          }}
          inventory={selectedInventory}
          refreshInventory={refreshInventory}
        />
      )}
    </>
  );
};

export default InventoryTable;