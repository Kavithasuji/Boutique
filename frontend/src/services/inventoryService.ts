import api from "../api/axios";

import type {
  InventoryResponse,
  InventoryDetailsResponse,
} from "../types/inventory";

export interface GetInventoryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface UpdateInventoryDto {
  stock: number;
  lowStockAlert: number;
}

// -----------------------------
// Get Inventory List
// -----------------------------
export const getInventory = async (
  params: GetInventoryParams,
): Promise<InventoryResponse> => {
  const response = await api.get(
    "/admin/inventory",
    {
      params,
    },
  );

  return response.data;
};

// -----------------------------
// Get Single Inventory
// -----------------------------
export const getInventoryById = async (
  id: string,
): Promise<InventoryDetailsResponse> => {
  const response = await api.get(
    `/admin/inventory/${id}`,
  );

  return response.data;
};

// -----------------------------
// Update Inventory
// -----------------------------
export const updateInventory = async (
  id: string,
  data: UpdateInventoryDto,
): Promise<InventoryDetailsResponse> => {
  const response = await api.patch(
    `/admin/inventory/${id}`,
    data,
  );

  return response.data;
};