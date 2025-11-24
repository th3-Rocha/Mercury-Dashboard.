import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, LoginData, RegisterData } from "@/lib/api";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(data);

      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
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

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const clearError = () => {
    setError("");
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };
}
