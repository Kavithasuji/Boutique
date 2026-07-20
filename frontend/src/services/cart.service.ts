import api from "../api/axios";

export interface AddCartDto {
  variantId: string;
  quantity: number;
}

export const addToCart = async (data: AddCartDto) => {
  const response = await api.post("/cart", data);

  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};
// Update Cart Quantity
export const updateCartQuantity = async (
  cartId: string,
  quantity: number,
) => {
  const response = await api.patch(`/cart/${cartId}`, {
    quantity,
  });

  return response.data;
};

// Remove Cart Item
export const removeCartItem = async (cartId: string) => {
  const response = await api.delete(`/cart/${cartId}`);

  return response.data;
};


export const getMyOrders = async () => {
  const { data } = await api.get("/orders");

  return data;
};