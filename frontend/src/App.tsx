import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.15)",
          },

          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;