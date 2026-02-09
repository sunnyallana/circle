// User types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

// Contact types
export interface ContactEmail {
  id?: number;
  email: string;
  type: EmailType;
}

export interface ContactPhone {
  id?: number;
  phoneNumber: string;
  type: PhoneType;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  title?: string;
  emails: ContactEmail[];
  phones: ContactPhone[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactRequest {
  firstName: string;
  lastName: string;
  title?: string;
  emails: ContactEmail[];
  phones: ContactPhone[];
}

export enum EmailType {
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  OTHER = "OTHER",
}

export enum PhoneType {
  WORK = "WORK",
  HOME = "HOME",
  PERSONAL = "PERSONAL",
  OTHER = "OTHER",
}

// Pagination types
export interface PageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
