import { useEffect, useState } from 'react';

import dashboardService from '../../services/dashboardService';
import type { DashboardResponse } from '../../types/dashboard';

import StatCard from '../../components/dashboard/StatCard';
import SalesChart from '../../components/dashboard/SalesChart';
// import OrderStatusCard from '../../components/dashboard/OrderStatusCard';
import OrderStatusCard from '../../components/dashboard/OrderStatusCard';
import TopCategories from '../../components/dashboard/TopCategories';
import RecentOrders from '../../components/dashboard/RecentOrders';

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
} from 'lucide-react';

const Dashboard = () => {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const data =
        await dashboardService.getDashboard();

      setDashboard(data);
    } catch (err) {
      console.error(err);

      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Revenue"
          value={`₹${dashboard.stats.revenue.toLocaleString()}`}
          icon={DollarSign}
        />

        <StatCard
          title="Orders"
          value={dashboard.stats.orders}
          icon={ShoppingBag}
        />

        <StatCard
          title="Customers"
          value={dashboard.stats.customers}
          icon={Users}
        />

        <StatCard
          title="Products"
          value={dashboard.stats.products}
          icon={Package}
        />

        <StatCard
          title="Low Stock"
          value={dashboard.stats.lowStockProducts}
          icon={AlertTriangle}
        />

      </div>

      {/* Sales Chart */}

      <SalesChart
        data={dashboard.salesOverview}
      />

      {/* Bottom Grid */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <OrderStatusCard
          status={dashboard.orderStatus}
        />

        <TopCategories
          categories={dashboard.topCategories}
        />

      </div>

      {/* Recent Orders */}

      <RecentOrders
        orders={dashboard.recentOrders}
      />

    </div>
  );
};

export default Dashboard;