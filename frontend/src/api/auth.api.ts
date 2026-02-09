import axiosInstance from "./axios.config";
import {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthResponse,
  User,
  ApiResponse,
} from "../types/index";

export const authApi = {
  login: async (
    credentials: LoginRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  register: async (
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  changePassword: async (
    passwordData: ChangePasswordRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.put(
      "/auth/change-password",
      passwordData,
    );
    return response.data;
  },
};
