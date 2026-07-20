import { useEffect, useState } from "react";

// 
import { getOrders } from "../../services/adminOrderService";
import type { GetOrdersParams } from "../../services/adminOrderService";
import type {
  Order,
  Pagination as PaginationType,
} from "../../types/order";
// import SearchBar from "../components/orders/SearchBar";
import SearchBar from "../../components/orders/SearchBar";
import StatusFilter from "../../components/orders/StatusFilter";
import OrderTable from "../../components/orders/OrderTable";
import Pagination from "../../components/orders/Pagination";
import LoadingOrders from "../../components/orders/LoadingOrders";
import EmptyOrders from "../../components/orders/EmptyOrders";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [pagination, setPagination] =
    useState<PaginationType | null>(null);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params: GetOrdersParams = {
        page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search;
      }

      if (status) {
        params.status = status;
      }

      const data = await getOrders(params);

      setOrders(data.orders);

      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = (value: string) => {
    setPage(1);
    setStatus(value);
  };

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Manage customer orders
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
          />
        </div>

        <StatusFilter
          value={status}
          onChange={handleStatusChange}
        />

      </div>

      {loading ? (
        <LoadingOrders />
      ) : orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          <OrderTable
            orders={orders}
            refreshOrders={fetchOrders}
          />

          {pagination && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                hasNext={pagination.hasNext}
                hasPrevious={pagination.hasPrevious}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Orders;