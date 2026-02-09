import axiosInstance from "./axios.config";
import {
  Contact,
  ContactRequest,
  PageRequest,
  PageResponse,
  ApiResponse,
} from "../types";

export const contactsApi = {
  getContacts: async (
    params: PageRequest,
  ): Promise<ApiResponse<PageResponse<Contact>>> => {
    const response = await axiosInstance.get("/contacts", { params });
    return response.data;
  },

  searchContacts: async (
    query: string,
    params: PageRequest,
  ): Promise<ApiResponse<PageResponse<Contact>>> => {
    const response = await axiosInstance.get("/contacts/search", {
      params: { query, ...params },
    });
    return response.data;
  },

  getContactById: async (id: number): Promise<ApiResponse<Contact>> => {
    const response = await axiosInstance.get(`/contacts/${id}`);
    return response.data;
  },

  createContact: async (
    contact: ContactRequest,
  ): Promise<ApiResponse<Contact>> => {
    const response = await axiosInstance.post("/contacts", contact);
    return response.data;
  },

  updateContact: async (
    id: number,
    contact: ContactRequest,
  ): Promise<ApiResponse<Contact>> => {
    const response = await axiosInstance.put(`/contacts/${id}`, contact);
    return response.data;
  },

  deleteContact: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/contacts/${id}`);
    return response.data;
  },
};
