import axios from "../api/axios";
import type { DashboardResponse } from '../types/dashboard';

class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await axios.get<DashboardResponse>(
      '/admin/dashboard',
    );

    return response.data;
  }
}

export default new DashboardService();