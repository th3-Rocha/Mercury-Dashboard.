import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// Importe suas interfaces do types.ts
import {
  RegisterData,
  LoginData,
  AuthResponse,
  ValidateTokenResponse,
  LogoutResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  Company,
  UpdateCompanyData,
  ApiResponse,
  Truck,
  CreateTruckData,
  UpdateTruckData,
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
  Recipient,
  CreateRecipientData,
  UpdateRecipientData,
  Shipment,
  CreateShipmentData,
  UpdateShipmentData,
  BalanceEvent,
  CreateBalanceEventData,
  UpdateBalanceEventData,
} from "./types";

// Defina a interface UpdateCompanyData no types.ts, mas vou mockar aqui para o exemplo

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isHandlingUnauthorized = false;

function handleUnauthorized() {
  Cookies.remove("access_token", { path: "/" });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));

    const current = window.location.pathname;
    if (current.startsWith("/login") || current === "/") {
      isHandlingUnauthorized = false;
      return;
    }

    if (isHandlingUnauthorized) return;
    isHandlingUnauthorized = true;
    window.location.replace("/login");
  }
}

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

// --- TIPAGEM PADRÃO OURO ---

function handleAxiosError(error: unknown): ApiResponse<never> {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Erro na requisição",
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: false,
    error: "Ocorreu um erro desconhecido",
  };
}

export async function getData<R>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.get<R>(endpoint, config);
    return { success: true, data: response.data };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function postData<T, R>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.post<R>(endpoint, data, config);
    return { success: true, data: response.data, message: "Sucesso" };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function putData<T, R>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.put<R>(endpoint, data, config);
    return { success: true, data: response.data, message: "Atualizado" };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function deleteData<R>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> {
  try {
    const response = await api.delete<R>(endpoint, config);
    return { success: true, data: response.data, message: "Removido" };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export const getCompanyData = async () => {
  return getData<Company>("/company");
};

export const updateCompany = async (data: UpdateCompanyData) => {
  return putData<UpdateCompanyData, Company>("/company", data);
};

export const registerUser = async (data: RegisterData) => {
  return postData<RegisterData, AuthResponse>("/auth/register", data);
};

export const loginUser = async (data: LoginData) => {
  return postData<LoginData, AuthResponse>("/auth/login", data);
};

export const logoutUser = async () => {

  return postData<unknown, LogoutResponse>("/auth/logout", {});
};

export const validateToken = async () => {
  return getData<ValidateTokenResponse>("/auth/validate");
};

export const resetPassword = async (data: ResetPasswordData) => {
  return postData<ResetPasswordData, ResetPasswordResponse>(
    "/reset-password",
    data
  );
};

// --- TRUCKS ENDPOINTS ---

export const getTrucks = async () => {
  return getData<Truck[]>("/trucks");
};

export const getTruck = async (id: string) => {
  return getData<Truck>(`/trucks/${id}`);
};

export const createTruck = async (data: CreateTruckData) => {
  return postData<CreateTruckData, Truck>("/trucks", data);
};

export const updateTruck = async (id: string, data: UpdateTruckData) => {
  return putData<UpdateTruckData, Truck>(`/trucks/${id}`, data);
};

export const deleteTruck = async (id: string) => {
  return deleteData<Truck>(`/trucks/${id}`);
};

// --- EMPLOYEES ENDPOINTS ---

export const getEmployees = async () => {
  return getData<Employee[]>("/employees");
};

export const getEmployee = async (id: string) => {
  return getData<Employee>(`/employees/${id}`);
};

export const createEmployee = async (data: CreateEmployeeData) => {
  return postData<CreateEmployeeData, Employee>("/employees", data);
};

export const updateEmployee = async (id: string, data: UpdateEmployeeData) => {
  return putData<UpdateEmployeeData, Employee>(`/employees/${id}`, data);
};

export const deleteEmployee = async (id: string) => {
  return deleteData<Employee>(`/employees/${id}`);
};

// --- RECIPIENTS ENDPOINTS ---

export const getRecipients = async () => {
  return getData<Recipient[]>("/recipients");
};

export const getRecipient = async (id: string) => {
  return getData<Recipient>(`/recipients/${id}`);
};

export const createRecipient = async (data: CreateRecipientData) => {
  return postData<CreateRecipientData, Recipient>("/recipients", data);
};

export const updateRecipient = async (id: string, data: UpdateRecipientData) => {
  return putData<UpdateRecipientData, Recipient>(`/recipients/${id}`, data);
};

export const deleteRecipient = async (id: string) => {
  return deleteData<Recipient>(`/recipients/${id}`);
};

// --- SHIPMENTS ENDPOINTS ---

export const getShipments = async () => {
  return getData<Shipment[]>("/shipments");
};

export const getShipment = async (id: string) => {
  return getData<Shipment>(`/shipments/${id}`);
};

export const createShipment = async (data: CreateShipmentData) => {
  // Sanitize the data to ensure proper types
  const sanitizedData: CreateShipmentData = {
    startAddress: String(data.startAddress),
    startLat: Number(data.startLat),
    startLng: Number(data.startLng),
    deliveryAddress: String(data.deliveryAddress),
    deliveryLat: Number(data.deliveryLat),
    deliveryLng: Number(data.deliveryLng),
    cargoType: data.cargoType,
    weight: Number(data.weight),
    estimatedProfit: Number(data.estimatedProfit),
    startDate: String(data.startDate),
    status: String(data.status),
    currentLat: Number(data.currentLat),
    currentLng: Number(data.currentLng),
    employeeId: String(data.employeeId),
    truckId: String(data.truckId),
    recipientId: String(data.recipientId),
  };
  return postData<CreateShipmentData, Shipment>("/shipments", sanitizedData);
};

export const updateShipment = async (id: string, data: UpdateShipmentData) => {
  const sanitizedData: UpdateShipmentData = {};

  if (data.status !== undefined) {
    sanitizedData.status = String(data.status);
  }
  if (data.currentLat !== undefined && !isNaN(data.currentLat)) {
    sanitizedData.currentLat = Number(data.currentLat);
  }
  if (data.currentLng !== undefined && !isNaN(data.currentLng)) {
    sanitizedData.currentLng = Number(data.currentLng);
  }
  if (data.gasSpent !== undefined && !isNaN(data.gasSpent)) {
    sanitizedData.gasSpent = Number(data.gasSpent);
  }
  if (data.estimatedProfit !== undefined && !isNaN(data.estimatedProfit)) {
    sanitizedData.estimatedProfit = Number(data.estimatedProfit);
  }
  if (data.endDate !== undefined) {
    sanitizedData.endDate = data.endDate;
  }

  return putData<UpdateShipmentData, Shipment>(`/shipments/${id}`, sanitizedData);
};

export const deleteShipment = async (id: string) => {
  return deleteData<Shipment>(`/shipments/${id}`);
};

// ============================================
// SHIPMENT EVENTS API
// ============================================

export interface CreateShipmentEventDto {
  shipmentId: string;
  latitude: number;
  longitude: number;
  description: string;
  recordedAt: Date;
}

export interface UpdateShipmentEventDto {
  latitude?: number;
  longitude?: number;
  description?: string;
}

export const createShipmentEvent = async (data: CreateShipmentEventDto) => {
  const sanitizedData = {
    shipmentId: String(data.shipmentId),
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    description: String(data.description),
    recordedAt: data.recordedAt instanceof Date ? data.recordedAt : new Date(data.recordedAt),
  };
  return postData<CreateShipmentEventDto, any>("/shipment-events", sanitizedData);
};

export const getShipmentEventsByShipmentId = async (shipmentId: string) => {
  return getData<any>(`/shipment-events/shipment/${shipmentId}`);
};

export const getShipmentEvent = async (eventId: string) => {
  return getData<any>(`/shipment-events/${eventId}`);
};

export const updateShipmentEvent = async (id: string, data: UpdateShipmentEventDto) => {
  const sanitizedData: UpdateShipmentEventDto = {};

  if (data.latitude !== undefined && !isNaN(data.latitude)) {
    sanitizedData.latitude = Number(data.latitude);
  }
  if (data.longitude !== undefined && !isNaN(data.longitude)) {
    sanitizedData.longitude = Number(data.longitude);
  }
  if (data.description !== undefined) {
    sanitizedData.description = String(data.description);
  }

  return putData<UpdateShipmentEventDto, any>(`/shipment-events/${id}`, sanitizedData);
};

export const deleteShipmentEvent = async (id: string) => {
  return deleteData<any>(`/shipment-events/${id}`);
};

// ============================================
// BALANCE EVENTS API
// ============================================

export const getBalanceEvents = async () => {
  return getData<BalanceEvent[]>("/balance-events/company");
};

export const getBalanceEvent = async (id: string) => {
  return getData<BalanceEvent>(`/balance-events/${id}`);
};

export const createBalanceEvent = async (data: CreateBalanceEventData) => {
  return postData<CreateBalanceEventData, BalanceEvent>("/balance-events", data);
};

export const updateBalanceEvent = async (id: string, data: UpdateBalanceEventData) => {
  return putData<UpdateBalanceEventData, BalanceEvent>(`/balance-events/${id}`, data);
};

export const deleteBalanceEvent = async (id: string) => {
  return deleteData<BalanceEvent>(`/balance-events/${id}`);
};

export default api;
