
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { authService } from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo/cupi.webp";

const SetPassword = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail =
      sessionStorage.getItem(
        "registration_email"
      );

    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate("/register");
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const validatePassword = (
    password: string
  ) => {
    const minLength = 8;
    const hasUpperCase =
      /[A-Z]/.test(password);
    const hasLowerCase =
      /[a-z]/.test(password);
    const hasNumber =
      /\d/.test(password);
    const hasSpecialChar =
      /[@$!%*?&]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,

      errors: {
        length:
          password.length >= minLength,
        uppercase: hasUpperCase,
        lowercase: hasLowerCase,
        number: hasNumber,
        special: hasSpecialChar,
      },
    };
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    const validation =
      validatePassword(
        formData.password
      );

    if (!validation.isValid) {
      setError(
        "Password does not meet requirements"
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await authService.setPassword(
          email,
          formData.password,
          formData.confirmPassword
        );

      setSuccess(response.message);

      await login(
        email,
        formData.password,
        true
      );

      sessionStorage.removeItem(
        "registration_email"
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
          "Failed to set password. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  const validation =
    validatePassword(formData.password);

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
            fontFamily:
              "'Montserrat', sans-serif",
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

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#d72638]">

              <FaLock className="text-white" />

            </div>

            <h2 className="text-2xl font-light text-white">
              Set Password
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Create a secure password for your
              Cupidanza account.
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
            {/* Password */}

            <div>
              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 w-full rounded-sm bg-white px-4 pr-12 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#d72638]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d72638]"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-11 w-full rounded-sm bg-white px-4 pr-12 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#d72638]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d72638]"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}

            <div className="rounded-sm border border-white/10 bg-white/5 p-4">

              <p className="mb-3 text-sm font-medium text-white">
                Password Requirements
              </p>

              <ul className="space-y-2 text-xs">

                <li
                  className={`flex items-center ${
                    validation.errors.length
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <span className="mr-2">
                    {validation.errors.length
                      ? "✓"
                      : "✗"}
                  </span>
                  At least 8 characters
                </li>

                <li
                  className={`flex items-center ${
                    validation.errors.uppercase
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <span className="mr-2">
                    {validation.errors.uppercase
                      ? "✓"
                      : "✗"}
                  </span>
                  At least one uppercase letter
                </li>

                <li
                  className={`flex items-center ${
                    validation.errors.lowercase
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <span className="mr-2">
                    {validation.errors.lowercase
                      ? "✓"
                      : "✗"}
                  </span>
                  At least one lowercase letter
                </li>

                <li
                  className={`flex items-center ${
                    validation.errors.number
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <span className="mr-2">
                    {validation.errors.number
                      ? "✓"
                      : "✗"}
                  </span>
                  At least one number
                </li>

                <li
                  className={`flex items-center ${
                    validation.errors.special
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <span className="mr-2">
                    {validation.errors.special
                      ? "✓"
                      : "✗"}
                  </span>
                  At least one special character (@$!%*?&)
                </li>

              </ul>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-sm bg-[#d72638] text-base font-semibold uppercase tracking-[3px] text-white transition hover:bg-[#b81f2f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Setting Password..."
                : "Set Password"}
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
                Your password protects your account and
                enables secure access to the exclusive
                Cupidanza shopping experience.
              </p>
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

export default SetPassword;