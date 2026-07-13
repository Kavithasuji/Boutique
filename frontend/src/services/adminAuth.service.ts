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
}

export default new AdminAuthService();