export interface Inventory {
  id: string;

  sku: string;

  stock: number;

  lowStockAlert: number;

  createdAt: string;

  updatedAt: string;

  variant: {
    id: string;

    size: string;

    color: {
      color: string;

      imageUrl: string;
    };

    product: {
      id: string;

      name: string;

      category: {
        id: string;

        name: string;
      };
    };
  };
}

export interface Pagination {
  page: number;

  limit: number;

  totalInventory: number;

  totalPages: number;

  hasNext: boolean;

  hasPrevious: boolean;
}

export interface InventoryResponse {
  success: boolean;

  inventory: Inventory[];

  pagination: Pagination;
}

export interface InventoryDetailsResponse {
  success: boolean;

  inventory: Inventory;
}