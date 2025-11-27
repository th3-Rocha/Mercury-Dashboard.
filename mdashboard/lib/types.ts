export type Point = {
  lat: number;
  lng: number;
};

export type ShipmentStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: User;
}

export interface LogoutResponse {
  message: string;
}

export interface ResetPasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isChecking: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}
interface CompanyDataFromApi {
  name: string;
  hexColor: string;
  walletBalance: number;
}
export interface CompanyContextType {
  id?: string;
  name: string;
  status: CompanyStatus;
  walletBalance: number;
  hexColor: string;
  isLoading: boolean;
  fetchCompany: () => Promise<void>;
}
