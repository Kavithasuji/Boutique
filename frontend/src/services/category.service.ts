import axios from "../api/axios";

export const createCategory = async (data: FormData) => {
  const response = await axios.post("/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get("/categories");
  return response.data;
};

export const getCategory = async (id: string) => {
  const response = await axios.get(`/categories/${id}`);
  return response.data;
};

export const updateCategory = async (id: string, data: FormData) => {
  const response = await axios.patch(`/categories/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await axios.delete(`/categories/${id}`);
  return response.data;
};