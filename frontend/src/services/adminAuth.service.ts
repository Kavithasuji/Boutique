import api from "../api/axios";

export interface AdminLoginDto {
  email: string;
  password: string;
}

class AdminAuthService {
  async login(data: AdminLoginDto) {
    const response = await api.post("/admin-auth/login", data);

    return response.data;
  }

  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }

  // Category endpoints
  async getCategories() {
    const response = await api.get("/categories");
    return response.data;
  }

  async getCategory(id: string) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(data: FormData) {
    const response = await api.post("/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async updateCategory(id: string, data: FormData) {
    const response = await api.patch(`/categories/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
}

export default new AdminAuthService();