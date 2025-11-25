export type Point = {
  lat: number;
  lng: number;
};

export type ShipmentStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Shipment {
  id?: string;
  tracking_code: string;
  origin_address: string;
  origin_location: Point;
  destination_address: string;
  destination_location: Point;
  current_location?: Point;

  total_cost: number;
  profit: number;
  fuel_spent: number;
  fuel_liters: number;

  status: ShipmentStatus;
  progress_percentage: number;
  distance_km: number;
  distance_completed_km: number;

  scheduled_date?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  max_delivery_date: string;

  notes?: string | null;
  cargo_details?: any;

  created_at?: string;
  updated_at?: string;
}

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
export type CompanyStatus = "trial" | "active" | "suspended";
export interface CompanyContextType {
  name: string;
  status: CompanyStatus;
  walletBalance: number;
  //   shipments: Shipment[];
}
