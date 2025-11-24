import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  LoginData,
  RegisterData,
  logoutUser,
  resetPassword,
  ResetPasswordData,
} from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { isAuthenticated, isChecking, user, setUser, setIsAuthenticated } =
    useAuthContext();

  const router = useRouter();

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(data);

      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        router.push("/dashboard");
        return { success: true };
      } else {
        const errorMessage = response.error || "Login failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await registerUser(data);

      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        router.push("/register/success");
        return { success: true };
      } else {
        const errorMessage = response.error || "Registration failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await resetPassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data?.message || "Password changed successfully",
        };
      } else {
        const errorMessage = response.error || "Failed to change password";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    login,
    register,
    logout,
    changePassword,
    isLoading,
    error,
    clearError,
    isAuthenticated,
    isChecking,
    user,
  };
}
