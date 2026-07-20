import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdCategory,
  MdInventory,
  MdShoppingBag,
  MdPeople,
  MdAssessment,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import logo from "../../assets/logo/cupi.webp";
const Sidebar = () => {
  const navigate = useNavigate();

  const adminName = localStorage.getItem("adminName") || "Administrator";
  const adminEmail = localStorage.getItem("adminEmail");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard size={22} />,
      path: "/admin/dashboard",
    },
    {
      name: "Products",
      icon: <FaBoxOpen size={20} />,
      path: "/admin/products",
    },
    {
      name: "Categories",
      icon: <MdCategory size={22} />,
      path: "/admin/categories",
    },
    {
      name: "Inventory",
      icon: <MdInventory size={22} />,
      path: "/admin/inventory",
    },
    {
      name: "Orders",
      icon: <MdShoppingBag size={22} />,
      path: "/admin/orders",
    },
    // {
    //   name: "Customers",
    //   icon: <MdPeople size={22} />,
    //   path: "/admin/customers",
    // },
    // {
    //   name: "Reports",
    //   icon: <MdAssessment size={22} />,
    //   path: "/admin/reports",
    // },
    // {
    //   name: "Settings",
    //   icon: <MdSettings size={22} />,
    //   path: "/admin/settings",
    // },
  ];

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Cupidanza"
            className="w-12 h-12 rounded-xl object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold text-[#111111]">
              Cupidanza
            </h1>

            <p className="text-xs uppercase tracking-[3px] text-[#D72638] font-semibold">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <p className="text-xs uppercase tracking-[2px] text-gray-400 font-semibold mb-4">
          Main Menu
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[#D72638] text-white shadow-lg"
                    : "text-gray-600 hover:bg-red-50 hover:text-[#D72638]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
                  )}

                  <span>{item.icon}</span>

                  <span className="font-medium text-[15px]">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Admin Card */}
      <div className="border-t border-gray-100 p-5">
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            {/* <div className="w-12 h-12 rounded-full bg-[#D72638] flex items-center justify-center text-white text-lg font-bold">
              {adminName.charAt(0)}
            </div> */}

            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {adminName}
              </h4>

              <p className="text-sm text-gray-500 truncate">
                {adminEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-[#D72638] py-3 text-white font-semibold hover:bg-[#c41f30] transition"
          >
            <MdLogout size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;