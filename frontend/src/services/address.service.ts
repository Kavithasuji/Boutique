import api from "../api/axios";

export interface CreateAddressDto {
  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  country: string;

  postalCode: string;

  isDefault?: boolean;
}

export interface Address {
  id: string;

  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  country: string;

  postalCode: string;

  isDefault: boolean;

  createdAt: string;
  updatedAt: string;
}

// Create Address
export const createAddress = async (
  data: CreateAddressDto,
) => {
  const response = await api.post("/addresses", data);

  return response.data;
};

// Get All Addresses
export const getAddresses = async () => {
  const response = await api.get("/addresses");

  return response.data;
};
// Checkout Summary
export const getCheckoutSummary = async () => {
  const response = await api.get("/checkout/summary");

  return response.data;
};