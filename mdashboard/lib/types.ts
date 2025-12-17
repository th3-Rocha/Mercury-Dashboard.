// ============================================
// ENUMS
// ============================================

export enum CargoType {
  LIQUID = "LIQUID",
  SOLID = "SOLID",
}

export enum ShipmentStatus {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNING = "RETURNING",
}

export enum SubscriptionPlan {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}
export enum BalanceEventType {
  VEHICLE_MAINTENANCE = "VEHICLE_MAINTENANCE",
  FUEL = "FUEL",
  FOOD = "FOOD",
  TOLL = "TOLL",
  INSURANCE = "INSURANCE",
  TAX = "TAX",
  SALARY = "SALARY",
  MARKETING = "MARKETING",
  SOFTWARE = "SOFTWARE",
  UTILITIES = "UTILITIES",
  OTHER_EXPENSE = "OTHER_EXPENSE",
  FREIGHT_INCOME = "FREIGHT_INCOME",
  ASSET_SALE = "ASSET_SALE",
  OTHER_INCOME = "OTHER_INCOME",
}


// ============================================
// BASE MODELS
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
}

export interface Company {
  id: string;
  tradeName: string;
  legalName: string;
  taxId: string;
  balance: string | number;
  supportEmail: string;
  mainPhone: string;
  subscriptionPlan: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  employees?: Employee[];
  trucks?: Truck[];
  shipments?: Shipment[];
  recipients?: Recipient[];
  balanceEvents?: BalanceEvent[];
}

export interface BalanceEvent {
  id: string;
  amount: number;
  description: string;
  type: BalanceEventType;
  occurredAt: string;
  companyId: string;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  cnh: string;
  cnhExpiration: string;
  cpf: string;
  salary: string | number;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  shipments?: Shipment[];
}

export interface Truck {
  id: string;
  licensePlate: string;
  maxPayload: number;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  shipments?: Shipment[];
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  fullAddress: string;
  createdAt: string;
  updatedAt: string;
  shipments?: Shipment[];
}

export interface Shipment {
  id: string;
  status: ShipmentStatus;
  startLat: number;
  startLng: number;
  startAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryAddress: string;
  currentLat?: number | null;
  currentLng?: number | null;
  cargoType: CargoType;
  weight: number;
  gasSpent: string | number;
  estimatedProfit: string | number;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  employeeId: string;
  employee?: Employee;
  truckId: string;
  truck?: Truck;
  recipientId: string;
  recipient?: Recipient;
  events?: ShipmentEvent[];
}

export interface ShipmentEvent {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  recordedAt: string;
  shipmentId: string;
  shipment?: Shipment;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Point = {
  lat: number;
  lng: number;
};

// ============================================
// AUTH TYPES
// ============================================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
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

// ============================================
// CREATE/UPDATE TYPES
// ============================================

export interface CreateCompanyData {
  tradeName: string;
  legalName: string;
  taxId: string;
  supportEmail: string;
  mainPhone: string;
  subscriptionPlan?: SubscriptionPlan;
}

export interface UpdateCompanyData {
  tradeName?: string;
  legalName?: string;
  supportEmail?: string;
  mainPhone?: string;
  subscriptionPlan?: SubscriptionPlan;
}

export interface CreateEmployeeData {
  name: string;
  cnh: string;
  cnhExpiration: string;
  cpf: string;
  salary: number;
}

export interface UpdateEmployeeData {
  name?: string;
  cnh?: string;
  cnhExpiration?: string;
  cpf?: string;
  salary?: number;
}

export interface CreateTruckData {
  licensePlate: string;
  maxPayload: number;
}

export interface UpdateTruckData {
  licensePlate?: string;
  maxPayload?: number;
}

export interface CreateRecipientData {
  name: string;
  email: string;
  phone: string;
  fullAddress: string;
}

export interface UpdateRecipientData {
  name?: string;
  email?: string;
  phone?: string;
  fullAddress?: string;
}

export interface CreateShipmentData {
  startLat: number;
  startLng: number;
  startAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryAddress: string;
  cargoType: CargoType;
  weight: number;
  estimatedProfit: number;
  startDate: string;
  status: string;
  currentLat: number;
  currentLng: number;
  employeeId: string;
  truckId: string;
  recipientId: string;
}

export interface UpdateShipmentData {
  status?: string;
  startLat?: number;
  startLng?: number;
  startAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryAddress?: string;
  cargoType?: CargoType;
  weight?: number;
  currentLat?: number;
  currentLng?: number;
  gasSpent?: number;
  estimatedProfit?: number;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  truckId?: string;
  recipientId?: string;
}

export interface CreateShipmentEventData {
  latitude: number;
  longitude: number;
  description: string;
  shipmentId: string;
}

export interface CreateBalanceEventData {
  amount: number;
  description: string;
  type: BalanceEventType;
  occurredAt: string;
}

export interface UpdateBalanceEventData {
  amount?: number;
  description?: string;
  type?: BalanceEventType;
  occurredAt?: string;
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface CompanyContextType {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  fetchCompany: () => Promise<void>;
  updateCompany: (data: UpdateCompanyData) => Promise<void>;
  clearCompany: () => Promise<void>;
}

export interface TrucksContextType {
  trucks: Truck[] | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshTrucks: () => Promise<void>;
  addTruck: (data: CreateTruckData) => Promise<void>;
  updateTruck: (id: string, data: UpdateTruckData) => Promise<void>;
  removeTruck: (id: string) => Promise<void>;
}

export interface EmployeesContextType {
  employees: Employee[] | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshEmployees: () => Promise<void>;
  addEmployee: (data: CreateEmployeeData) => Promise<void>;
  updateEmployee: (id: string, data: UpdateEmployeeData) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
}

export interface RecipientsContextType {
  recipients: Recipient[] | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshRecipients: () => Promise<void>;
  addRecipient: (data: CreateRecipientData) => Promise<void>;
  updateRecipient: (id: string, data: UpdateRecipientData) => Promise<void>;
  removeRecipient: (id: string) => Promise<void>;
}

export interface ShipmentsContextType {
  shipments: Shipment[] | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshShipments: () => Promise<void>;
  addShipment: (data: CreateShipmentData) => Promise<void>;
  updateShipment: (id: string, data: UpdateShipmentData) => Promise<void>;
  removeShipment: (id: string) => Promise<void>;
  addShipmentEvent: (shipmentId: string, eventData: { latitude: number; longitude: number; description: string; recordedAt: Date }) => Promise<ShipmentEvent>;
  deleteShipmentEvent: (shipmentId: string, eventId: string) => Promise<void>;
  loadShipmentEvents: (shipmentId: string) => Promise<ShipmentEvent[]>;
}

export interface BalanceContextType {
  balanceEvents: BalanceEvent[] | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshBalanceEvents: () => Promise<void>;
  addBalanceEvent: (data: CreateBalanceEventData) => Promise<void>;
  updateBalanceEvent: (id: string, data: UpdateBalanceEventData) => Promise<void>;
  removeBalanceEvent: (id: string) => Promise<void>;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// FILTER/QUERY TYPES
// ============================================

export interface ShipmentFilters {
  status?: ShipmentStatus;
  employeeId?: string;
  truckId?: string;
  recipientId?: string;
  startDate?: string;
  endDate?: string;
  cargoType?: CargoType;
}

export interface EmployeeFilters {
  name?: string;
  cnh?: string;
  cpf?: string;
}

export interface TruckFilters {
  licensePlate?: string;
}

export interface RecipientFilters {
  name?: string;
  email?: string;
}
