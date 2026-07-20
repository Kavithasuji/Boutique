import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import CustomerLogin from "../pages/CustomerLogin";
import AdminLogin from "../pages/AdminLogin";
import Profile from "../pages/Profile";
import Dashboard from "../pages/admin/Dashboard";
// import Inventory from "../pages/admin/Inventory";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import { Settings } from "lucide-react";
import CategoryProducts from "../pages/CategoryProducts";
import ProductDetails from "../pages/ProductDetails";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import SetPassword from "../pages/SetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
// import MyOrders from "../pages/MyOrders";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
// import MyOrders from "../pages/Order";
import MyOrders from "../pages/Order"
import Inventory from "../pages/admin/Inventory";

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
      {
        path: "product/:slug",
        element: <ProductDetails />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
       {
        path: "Checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
       {
        path: "orders",
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },
      
      
    ],
  },

  {
    path: "/login",
    element: <CustomerLogin />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
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
        path: "settings",
        element: <Settings />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
   
    
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
