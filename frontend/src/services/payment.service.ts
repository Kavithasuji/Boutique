import api from "../api/axios";

export const createPaymentOrder = async () => {
  const { data } = await api.post("/payment/create-order");
  return data;
};

export const verifyPayment = async (data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {

  const response = await api.post(
    "/payment/verify",
    data
  );


  return response.data;
};