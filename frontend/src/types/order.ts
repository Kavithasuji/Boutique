export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface OrderItem {
  quantity: number;

  variant: {
    size: string;

    color: {
      color: string;
      imageUrl: string;
    };

    product: {
      name: string;
    };
  };
}

export interface Order {
  id: string;

  shippingName: string;

  shippingPhone: string;

  totalAmount: number;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  createdAt: string;

  items: OrderItem[];
}

export interface Pagination {
  page: number;

  limit: number;

  totalOrders: number;

  totalPages: number;

  hasNext: boolean;

  hasPrevious: boolean;
}

export interface OrdersResponse {
  success: boolean;

  orders: Order[];

  pagination: Pagination;
}
export interface OrderDetails extends Order {
  addressLine1: string;
  addressLine2: string | null;

  city: string;
  state: string;
  country: string;
  postalCode: string;

  user: {
    id: string;
    name: string;
    email: string;
  };

  payment: {
    id: string;
    transactionId: string;
    paymentMethod: string;
    amount: number;
    paymentStatus: PaymentStatus;
    createdAt: string;
  } | null;

  items: {
    quantity: number;
    price: number;

    variant: {
      size: string;

      color: {
        color: string;
        imageUrl: string;
      };

      product: {
        id: string;
        name: string;
      };
    };
  }[];
}

export interface OrderDetailsResponse {
  success: boolean;
  order: OrderDetails;
}