import { useEffect, useState } from "react";

import { getInventory } from "../../services/inventoryService";

import type { GetInventoryParams } from "../../services/inventoryService";

import type {
  Inventory,
  Pagination as PaginationType,
} from "../../types/inventory";


import InventorySearchBar from "../../components/inventory/InventorySearchBar";
import CategoryFilter from "../../components/inventory/CategoryFilter";
import InventoryTable from "../../components/inventory/InventoryTable";
import Pagination from "../../components/inventory/Pagination";
import LoadingInventory from "../../components/inventory/LoadingInventory";
import EmptyInventory from "../../components/inventory/EmptyInventory";

const Inventory = () => {
  const [inventory, setInventory] = useState<
    Inventory[]
  >([]);

  const [pagination, setPagination] =
    useState<PaginationType | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] = useState(1);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const params: GetInventoryParams = {
        page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search;
      }

      if (category) {
        params.category = category;
      }

      const data = await getInventory(
        params,
      );

      setInventory(data.inventory);

      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, category]);

  const handleSearch = () => {
    setPage(1);

    fetchInventory();
  };

  const handleCategoryChange = (
    value: string,
  ) => {
    setCategory(value);

    setPage(1);
  };

  return (
    <div className="p-6">

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Inventory
        </h1>

        <p className="mt-1 text-gray-500">
          Manage inventory and stock.
        </p>

      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">

        <div className="flex-1">
          <InventorySearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
          />
        </div>

        <CategoryFilter
          value={category}
          onChange={
            handleCategoryChange
          }
        />

      </div>

      {loading ? (
        <LoadingInventory />
      ) : inventory.length === 0 ? (
        <EmptyInventory />
      ) : (
        <>
          <InventoryTable
            inventory={inventory}
            refreshInventory={
              fetchInventory
            }
          />

          {pagination && (
            <div className="mt-6">
              <Pagination
                currentPage={
                  pagination.page
                }
                totalPages={
                  pagination.totalPages
                }
                hasNext={
                  pagination.hasNext
                }
                hasPrevious={
                  pagination.hasPrevious
                }
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Inventory;