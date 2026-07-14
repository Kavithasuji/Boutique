import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import adminAuthService from "../services/adminAuth.service";
import logo from "../assets/logo/cupi.webp";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await adminAuthService.login({
        email,
        password,
      });

      const { access_token, user } = response;

      localStorage.setItem("adminToken", access_token);
      localStorage.setItem("adminId", user.id);
      localStorage.setItem("adminName", user.name);
      localStorage.setItem("adminEmail", user.email);
      localStorage.setItem("adminRole", user.role);

      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error(error);

      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#faf9f7]">
      {/* LEFT SIDE */}

      <div className="relative hidden lg:flex overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1400&auto=format&fit=crop"
          alt="Luxury Boutique"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl overflow-hidden">
              <img
                src={logo}
                alt="Cupidanza"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-wide">Cupidanza</h1>
              <p className="uppercase tracking-[4px] text-sm text-red-200">
                Boutique
              </p>
            </div>
          </div>
          <div className="max-w-lg">
            <h2 className="text-6xl font-bold leading-tight">
              Luxury Fashion
              <br />
              Management
            </h2>
            <p className="mt-8 text-lg leading-8 text-gray-200">
              Manage products, categories, inventory, orders and customers from
              one beautiful dashboard.
            </p>
          </div>
          <div className="text-sm text-gray-300">© 2026 Cupidanza Boutique</div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="h-20 w-20 rounded-3xl shadow-lg overflow-hidden">
              <img
                src="/assets/"
                alt="Cupidanza"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="mt-5 text-4xl font-bold">Cupidanza</h1>
            <p className="text-gray-500 tracking-[3px] uppercase text-sm">
              Admin Panel
            </p>
          </div>
          {/* Login Card */}
          <div className="rounded-3xl bg-white border border-gray-100 shadow-2xl p-10 backdrop-blur-xl animate-[fadeIn_.6s_ease]">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-[#D72638] to-[#ff5d6c] flex items-center justify-center shadow-lg">
                <FaLock className="text-white text-3xl" />
              </div>
            </div>
            <h2 className="mt-8 text-center text-4xl font-bold text-[#111111]">
              Welcome Back
            </h2>

            <p className="text-center text-gray-500 mt-3 mb-10">
              Sign in to your admin account
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@cupidanza.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 rounded-2xl border border-gray-300 px-5 outline-none transition-all focus:border-[#D72638] focus:ring-4 focus:ring-[#D72638]/20"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-2 block">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 rounded-2xl border border-gray-300 px-5 outline-none transition-all focus:border-[#D72638] focus:ring-4 focus:ring-[#D72638]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#D72638] to-[#ff4f61] text-white font-semibold text-lg shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
