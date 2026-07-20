import api from "../api/axios";
import type { OrdersResponse, Order, OrderStatus ,OrderDetailsResponse } from "../types/order";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface OrderDetailsResponse {
  success: boolean;
  order: Order;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  order: Order;
}

// -----------------------------
// Get All Orders
// -----------------------------
export const getOrders = async (
  params: GetOrdersParams,
): Promise<OrdersResponse> => {
  const response = await api.get(
    "/admin/orders",
    {
      params,
    },
  );

  return response.data;
};

// -----------------------------
// Get Single Order
// -----------------------------
// export const getOrderById = async (
//   id: string,
// ): Promise<OrderDetailsResponse> => {
//   const response = await api.get(
//     `/admin/orders/${id}`,
//   );

//   return response.data;
// };

// -----------------------------
// Update Order Status
// -----------------------------
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
): Promise<UpdateOrderStatusResponse> => {
  const response = await api.patch(
    `/admin/orders/${id}/status`,
    {
      status,
    },
  );

  return response.data;
};
export const getOrderById = async (
  id: string,
): Promise<OrderDetailsResponse> => {
  const response = await api.get(`/admin/orders/${id}`);

  return response.data;
};