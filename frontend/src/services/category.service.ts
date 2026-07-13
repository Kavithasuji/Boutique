import axios from "../api/axios";

export const createCategory = async (
  data: FormData
) => {
  const response = await axios.post(
    "/createcategories",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};