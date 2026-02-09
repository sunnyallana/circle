export const API_BASE_URL = "/api";

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "user_data",
} as const;

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  CONTACTS: "/contacts",
  PROFILE: "/profile",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
} as const;
