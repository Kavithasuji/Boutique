
import { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import adminAuthService from "../services/adminAuth.service";
import logo from "../assets/logo/cupi.webp";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
        
        
        "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center px-6">

        {/* Main Heading */}

        <h1
          className="mb-10 text-center text-5xl font-light uppercase tracking-[10px] text-white"
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
                  Admin

          
        </h1>

        <p className="-mt-6 mb-10 text-center text-lg uppercase tracking-[8px] text-red-300">
CUPIDANZA        </p>

        {/* Login Card */}

        <div className="w-full max-w-xl rounded-sm bg-black/75 p-12 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-md">

          {/* Logo */}

          <div className="mb-8 flex justify-center">

            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-2xl">

              <img
                src={logo}
                alt="Cupidanza"
                className="h-20 w-20 object-contain"
              />

            </div>

          </div>

          {/* Heading */}

          <div className="mb-8 text-center">


            <p className="mt-3 text-gray-300">
              Sign in to Cupidanza Fashion Store
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >


            <div>

              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="h-14 w-full rounded-sm border-none bg-white px-5 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#d72638]"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white">
                Password
              </label>

              <div className="relative">
                                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="h-14 w-full rounded-sm border-none bg-white px-5 pr-14 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#d72638]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 transition hover:text-[#d72638]"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            <div className="flex items-center justify-between">

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">

                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#d72638]"
                />

                Remember Me

              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#ff5b67] transition hover:text-white"
              >
                Forgot Password?
              </Link>


            </div>

            <button
              type="submit"
              className="mt-2 h-14 w-full rounded-sm bg-[#d72638] text-lg font-semibold uppercase tracking-widest text-white transition duration-300 hover:bg-[#b61e2e]"
            >
              Login
            </button>

          </form>

        </div>

        <div className="mt-8 text-center">
                    <p className="text-sm uppercase tracking-[3px] text-gray-300">
            Cupidanza Fashion Store
          </p>

          <p className="mt-2 text-xs text-gray-500">
            © 2026 Cupidanza Boutique. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
        