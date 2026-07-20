import axios from "../api/axios";

export interface Category {
  id: string;
  name: string;
}



export interface CategoryResponse {
  success: boolean;
  category: Category;
}

export const createCategory = async (data: FormData) => {
  const response = await axios.post("/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get("/categories");
  return response.data;
};

export const getCategory = async (
  id: string,
): Promise<CategoryResponse> => {
  const response = await axios.get(`/categories/${id}`);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: FormData,
) => {
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