import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import TopNavbar from "../components/admin/TopNavbar";

const AdminLayout = () => {
  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Fixed Sidebar */}
      <aside
        className="
          fixed
          left-0
          top-0
          h-screen
          w-64
          z-40
        "
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Fixed Top Navbar */}
        <header
          className="
            fixed
            top-0
            left-64
            right-0
            z-30
            bg-white
            shadow-sm
          "
        >
          <TopNavbar />
        </header>

        {/* Scrollable Page Content */}
        <main
          className="
            flex-1
            overflow-y-auto
            pt-20
            p-6
            h-screen
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;