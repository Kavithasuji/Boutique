
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { authService } from "../services/auth.service";
import logo from "../assets/logo/cupi.webp";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] =
    useState(false);

  const [countdown, setCountdown] =
    useState(0);

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

  useEffect(() => {
    let interval: ReturnType<
      typeof setInterval
    >;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput =
        document.getElementById(
          `otp-${index + 1}`
        );

      nextInput?.focus();
    }

    setError("");
    setSuccess("");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      const prevInput =
        document.getElementById(
          `otp-${index - 1}`
        );

      prevInput?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent
  ) => {
    e.preventDefault();

    const pastedData =
      e.clipboardData
        .getData("text")
        .slice(0, 6);

    const newOtp = [...otp];

    pastedData
      .split("")
      .forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });

    setOtp(newOtp);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP"
      );
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response =
        await authService.verifyOtp(
          email,
          otpValue
        );

      setSuccess(response.message);

      setTimeout(() => {
        navigate("/set-password");
      }, 2000);

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
          "OTP verification failed. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setError("");
    setResendLoading(true);

    try {
      const response =
        await authService.resendOtp(email);

      setSuccess(response.message);

      setCountdown(60);

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

    } catch (err: any) {

      setError(
        err.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );

    } finally {

      setResendLoading(false);

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

              <FaShieldAlt className="text-white" />

            </div>

            <h2 className="text-2xl font-light text-white">
              Verify OTP
            </h2>

            <p className="mt-2 text-sm text-gray-300">
              Enter the 6-digit verification code sent to
            </p>

            <p className="mt-1 text-sm font-semibold text-[#ff5b67]">
              {email}
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
            className="space-y-5"
          >

            {/* OTP */}

            <div>

              <label className="mb-3 block text-center text-sm font-medium uppercase tracking-wider text-white">
                Verification Code
              </label>

              <div className="flex justify-center gap-3">

                {otp.map((digit, index) => (

                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        index,
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={handlePaste}
                    className="h-12 w-12 rounded-sm border border-white/20 bg-white text-center text-xl font-bold text-gray-800 outline-none transition focus:border-[#d72638] focus:ring-2 focus:ring-[#d72638]"
                  />

                ))}

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-sm bg-[#d72638] text-base font-semibold uppercase tracking-[3px] text-white transition hover:bg-[#b81f2f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

            <div className="text-center">

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={
                  resendLoading ||
                  countdown > 0
                }
                className="text-sm font-semibold text-[#ff5b67] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendLoading
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend OTP"}
              </button>

            </div>

            <div className="flex items-center">

              <div className="h-px flex-1 bg-white/20"></div>

              <span className="px-4 text-xs uppercase tracking-[5px] text-gray-400">
                Cupidanza
              </span>

              <div className="h-px flex-1 bg-white/20"></div>

            </div>

            <div className="text-center">

              <p className="text-sm leading-7 text-gray-300">
                Verify your email address to activate
                your Cupidanza account and continue
                creating your secure password.
              </p>

            </div>

            <div className="text-center">

              <span className="text-sm text-gray-300">
                Wrong email?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-[#ff5b67] transition hover:text-white"
                >
                  Go Back
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

export default VerifyOtp;
