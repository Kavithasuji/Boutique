import axios from "../api/axios";

const buildProductFormData = (data: FormData) => {
  const formData = new FormData();

  for (const [key, value] of data.entries()) {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
};

export const getProducts = async () => {
  const response = await axios.get("/products");
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};

export const getProductCategories = async () => {
  const response = await axios.get("/products/categories");
  return response.data;
};

export const createProduct = async (data: FormData) => {
  const response = await axios.post("/products", buildProductFormData(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id: string, data: FormData) => {
  const response = await axios.patch(
    `/products/${id}`,
    buildProductFormData(data),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (slug: string) => {
  const response = await axios.get(`/products/category/${slug}`);
  return response.data;
};
export const getProductBySlug = async (slug: string) => {
  const response = await axios.get(`/products/slug/${slug}`);
  return response.data;
};
