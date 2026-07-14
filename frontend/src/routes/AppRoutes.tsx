import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import CustomerLogin from "../pages/CustomerLogin";
import AdminLogin from "../pages/AdminLogin";

import Dashboard from "../pages/admin/Dashboard";
import Inventory from "../pages/admin/Inventory";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import Reports from "../pages/admin/Reports";
import Categories from "../pages/admin/Categories";
import { Settings } from "lucide-react";
import Customers from "../pages/admin/Customers";
import CategoryProducts from "../pages/CategoryProducts";


const router = createBrowserRouter([
{
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },

    {
      path: "category/:slug",
      element: <CategoryProducts />,
    },
  ],
},

  {
    path: "/login",
    element: <CustomerLogin />,
  },

  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },

      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
       path: "customers",
       element: <Customers />,

      }
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;