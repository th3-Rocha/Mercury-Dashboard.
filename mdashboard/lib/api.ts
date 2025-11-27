import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  RegisterData,
  LoginData,
  AuthResponse,
  ValidateTokenResponse,
  LogoutResponse,
  ResetPasswordData,
  ResetPasswordResponse,
} from "./types";
import Cookies from "js-cookie";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
    }
    return Promise.reject(error);
  }
);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function postData<T, R = any>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.post<R>(endpoint, data, config);
    return {
      success: true,
      data: response.data,
      message: "Request successful",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Template genérico para GET
export async function getData<R = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.get<R>(endpoint, config);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Template genérico para PUT
export async function putData<T, R = any>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.put<R>(endpoint, data, config);
    return {
      success: true,
      data: response.data,
      message: "Update successful",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

// Template genérico para DELETE
export async function deleteData<R = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.delete<R>(endpoint, config);
    return {
      success: true,
      data: response.data,
      message: "Delete successful",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

import { CompanyContextType } from "./types";
export const getCompanyData = async () => {
  return getData<{ data: CompanyContextType }>("/company");
};

export const registerUser = async (data: RegisterData) => {
  return postData<RegisterData, AuthResponse>("/register", data);
};

export const logoutUser = async () => {
  return postData<{}, LogoutResponse>("/logout", {});
};

export const loginUser = async (data: LoginData) => {
  return postData<LoginData, AuthResponse>("/login", data);
};

export const validateToken = async () => {
  return getData<ValidateTokenResponse>("/validate");
};

export const resetPassword = async (data: ResetPasswordData) => {
  return postData<ResetPasswordData, ResetPasswordResponse>(
    "/reset-password",
    data
  );
};

export default api;
