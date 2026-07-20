import axios from "axios";


const API = "http://localhost:3000";

export const searchProducts = async (keyword: string) => {
  const response = await axios.get(
    `${API}/search`,
    {
      params: {
        q: keyword,
      },
    }
  );

  return response.data;
};