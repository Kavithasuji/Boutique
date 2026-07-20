import { MdNotificationsNone } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const TopNavbar = () => {
  const adminName = localStorage.getItem("adminName") || "Admin";
  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      {/* Left */}
      <div>
   
      </div>
      {/* Right */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <MdNotificationsNone
            size={28}
            className="text-gray-600"
          />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <FaUserCircle
            size={42}
            className="text-[#D72638]"
          />
          <div className="text-right">
            <p className="font-semibold">{adminName}</p>
            <p className="text-sm text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;