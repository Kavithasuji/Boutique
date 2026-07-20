
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { authService } from "../services/auth.service";
import logo from "../assets/logo/cupi.webp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response =
        await authService.forgotPassword(email);

      setSuccess(response.message);
      setEmail("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 py-3">

        <h1
          className="mb-1 text-center text-3xl font-light uppercase tracking-[8px] text-white"
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          CUPIDANZA
        </h1>

        <p className="mb-4 text-center text-xs uppercase tracking-[6px] text-red-300">
          Fashion Store
        </p>

        <div className="w-full max-w-lg rounded-sm bg-black/75 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-md">

          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
              <img
                src={logo}
                alt="Cupidanza"
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>

          <div className="mb-6 text-center">

            {/* <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#d72638]">
              <FaEnvelope className="text-white" />
            </div> */}

            <h2 className="text-2xl font-light text-white">
              Forgot Password
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Enter your registered email to receive a
              password reset link.
            </p>

          </div>
                    {error && (
            <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your registered email"
                value={email}
                onChange={handleChange}
                className="h-11 w-full rounded-sm bg-white px-4 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#d72638]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-sm bg-[#d72638] text-base font-semibold uppercase tracking-[3px] text-white transition duration-300 hover:bg-[#b81f2f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sending Reset Link..."
                : "Send Reset Link"}
            </button>

            <div className="flex items-center">
              <div className="h-px flex-1 bg-white/20"></div>

              <span className="px-4 text-xs uppercase tracking-[5px] text-gray-400">
                Cupidanza
              </span>

              <div className="h-px flex-1 bg-white/20"></div>
            </div>

            <div className="text-center">
              <p className="text-sm leading-7 text-gray-300">
                We'll email you a secure password reset
                link. Follow the instructions to create
                a new password and regain access to your
                Cupidanza account.
              </p>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-300">
                Remember your password?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-[#ff5b67] transition hover:text-white"
                >
                  Back to Sign In
                </Link>
              </span>
            </div>

          </form>

        </div>

        <div className="mt-4 text-center">

          <p className="text-sm uppercase tracking-[3px] text-gray-300">
            CUPIDANZA FASHION STORE
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Luxury Fashion • Premium Quality • Timeless Elegance
          </p>

          <p className="mt-4 text-xs text-gray-500">
            © 2026 Cupidanza Boutique. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
