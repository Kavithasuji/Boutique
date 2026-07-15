import api from "../api/axios";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  isEmailVerified: boolean;
  createdAt: string;
}

class AuthService {
  constructor() {
    // Request Interceptor
    api.interceptors.request.use(
      (config) => {
        const token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken =
              localStorage.getItem("refresh_token") ||
              sessionStorage.getItem("refresh_token");

            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);

              const { access_token, refresh_token } = response;

              if (localStorage.getItem("refresh_token")) {
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
              } else {
                sessionStorage.setItem("access_token", access_token);
                sessionStorage.setItem("refresh_token", refresh_token);
              }

              originalRequest.headers.Authorization = `Bearer ${access_token}`;

              return api(originalRequest);
            }
          } catch (refreshError) {
            await this.logout();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async register(name: string, email: string) {
    const response = await api.post("/customer-auth/register", {
      name,
      email,
    });

    return response.data;
  }

  async verifyOtp(email: string, otp: string) {
    const response = await api.post("/customer-auth/verify-otp", {
      email,
      otp,
    });

    return response.data;
  }

  async resendOtp(email: string) {
    const response = await api.post("/customer-auth/resend-otp", {
      email,
    });

    return response.data;
  }

  async setPassword(
    email: string,
    password: string,
    confirmPassword: string
  ) {
    const response = await api.post("/customer-auth/set-password", {
      email,
      password,
      confirmPassword,
    });

    return response.data;
  }

  async login(
    email: string,
    password: string,
    rememberMe = false
  ) {
    const response = await api.post<AuthResponse>(
      "/customer-auth/login",
      {
        email,
        password,
        rememberMe,
      }
    );

    const { access_token, refresh_token, user } = response.data;

    if (rememberMe) {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("refresh_token", refresh_token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await api.post(
      "/customer-auth/forgot-password",
      {
        email,
      }
    );

    return response.data;
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ) {
    const response = await api.post(
      "/customer-auth/reset-password",
      {
        token,
        password,
        confirmPassword,
      }
    );

    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await api.post<{
      access_token: string;
      refresh_token: string;
    }>("/customer-auth/refresh-token", {
      refreshToken,
    });

    return response.data;
  }

  async logout() {
    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (token) {
        await api.post("/customer-auth/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("user");
    }
  }

  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>(
      "/customer-auth/profile"
    );

    return response.data;
  }

  isAuthenticated(): boolean {
    return !!(
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token")
    );
  }

  getCurrentUser() {
    const user =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  }

  getAccessToken() {
    return (
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token")
    );
  }

  getRefreshToken() {
    return (
      localStorage.getItem("refresh_token") ||
      sessionStorage.getItem("refresh_token")
    );
  }
}

export const authService = new AuthService();