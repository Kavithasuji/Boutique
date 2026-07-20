
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo/cupi.webp";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
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

        <h1
          className="mb-10 text-center text-5xl font-light uppercase tracking-[10px] text-white"
          style={{
            fontFamily:
              "'Montserrat', sans-serif",
          }}
        >
          CUPIDANZA
        </h1>

        <p className="-mt-6 mb-10 text-center text-lg uppercase tracking-[8px] text-red-300">
          Fashion Store
        </p>

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

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#d72638]">

              <FaLock className="text-xl text-white" />

            </div>

            <h2 className="text-4xl font-light text-white">
              Welcome Back
            </h2>

            <p className="mt-3 text-gray-300">
              Sign in to your Cupidanza account
            </p>

          </div>

          {error && (
            <div className="mb-6 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="h-14 w-full rounded-sm border-none bg-white px-5 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#d72638]"
              />

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white">
                Password
              </label>

              <div className="relative">
                                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
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
              disabled={loading}
              className="mt-2 h-14 w-full rounded-sm bg-[#d72638] text-lg font-semibold uppercase tracking-[3px] text-white transition duration-300 hover:bg-[#b71f31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex items-center py-2">

              <div className="h-px flex-1 bg-white/20"></div>

              <span className="px-4 text-sm uppercase tracking-[4px] text-gray-400">
                CUPIDANZA
              </span>

              <div className="h-px flex-1 bg-white/20"></div>

            </div>

            <div className="text-center">

              <h3 className="text-lg font-semibold uppercase tracking-[3px] text-white">
                Luxury Fashion Store
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-300">
                Discover premium fashion collections,
                elegant ethnic wear, modern styles,
                and timeless outfits crafted for every occasion.
              </p>

            </div>

            <div className="text-center">

              <span className="text-sm text-gray-300">
                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-[#ff5b67] transition hover:text-white"
                >
                  Create Account
                </Link>

              </span>

            </div>

          </form>

        </div>

        <div className="mt-8 text-center">
                    <p className="text-sm uppercase tracking-[3px] text-gray-300">
            Cupidanza Fashion Store
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Elegant Fashion • Premium Quality • Timeless Style
          </p>

          <p className="mt-4 text-xs text-gray-600">
            © 2026 Cupidanza Boutique. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;