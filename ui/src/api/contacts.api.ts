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

  // Import/Export functions
  importContactsFromJson: async (
    file: File,
  ): Promise<ApiResponse<Contact[]>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      "/contacts/import/json",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  importContactsFromCsv: async (
    file: File,
  ): Promise<ApiResponse<Contact[]>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      "/contacts/import/csv",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  exportContactsAsJson: async (): Promise<Blob> => {
    const response = await axiosInstance.get("/contacts/export/json", {
      responseType: "blob",
    });
    return response.data;
  },

  exportContactsAsCsv: async (): Promise<Blob> => {
    const response = await axiosInstance.get("/contacts/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },
};
