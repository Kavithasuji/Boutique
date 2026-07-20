
export interface DashboardStats {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  lowStockProducts: number;
}

export interface SalesOverview {
  date: string;
  revenue: number;
}

export interface OrderStatus {
  PENDING: number;
  PROCESSING: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
}

export interface TopCategory {
  id: string;
  name: string;
  products: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  status: string;
  items: number;
  total: number;
  createdAt: string;
}

export interface DashboardResponse {
  success: boolean;

  stats: DashboardStats;

  salesOverview: SalesOverview[];

  orderStatus: OrderStatus;

  topCategories: TopCategory[];

  recentOrders: RecentOrder[];
}