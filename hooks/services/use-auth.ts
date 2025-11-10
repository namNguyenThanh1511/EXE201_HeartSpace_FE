//login hook
import { use, useState } from "react";
import { useAuthStore } from "@/store/zustand/auth-store";
import { AuthService, LoginCredentials, RegisterCredentials } from "@/services/api/auth-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const { login, logout, setToken, isAuthenticated, setUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Login function
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(credentials);
      if (response.isSuccess) {
        setToken(response.data.accessToken); //call setToken to store auth-token in cookie and apiService ( zustand store)
        toast.success("Login successful!");
        const { user } = useAuthStore.getState();
        console.log(user);
        setUser(user); //set user info in zustand store
        if (user?.role === "Consultant") {
          router.push("/consultant/dashboard/appointments"); // Redirect to consultant dashboard
        } else if (user?.role === "Admin") {
          router.push("/admin/dashboard"); // Redirect to admin dashboard
        } else {
          router.push("/"); // Redirect to home or dashboard
        }
      } else {
        setError(response.message || "Login failed");
        toast.error(response.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      toast.error("An error occurred during login");
    }
    setLoading(false);
  };
  // Register function
  const handleRegister = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(credentials);
      if (response.isSuccess) {
        toast.success("Registration successful! Please log in.");
        router.push("/login"); // Redirect to login page
      } else {
        setError(response.message || "Registration failed");
        toast.error(response.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };
  // Logout function
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login"); // Redirect to login page
  };
  return {
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated,
  };
}
