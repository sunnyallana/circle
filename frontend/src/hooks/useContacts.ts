import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsApi } from "../api/contacts.api";
import { ContactRequest, PageRequest } from "../types";

const QUERY_KEYS = {
  CONTACTS: "contacts",
  CONTACT: "contact",
  SEARCH: "search",
} as const;

export const useContacts = (params: PageRequest) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CONTACTS, params],
    queryFn: () => contactsApi.getContacts(params),
  });
};

export const useSearchContacts = (query: string, params: PageRequest) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH, query, params],
    queryFn: () => contactsApi.searchContacts(query, params),
    enabled: query.length > 0,
  });
};

export const useContact = (id: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CONTACT, id],
    queryFn: () => contactsApi.getContactById(id!),
    enabled: id !== null,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: ContactRequest) => contactsApi.createContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contact }: { id: number; contact: ContactRequest }) =>
      contactsApi.updateContact(id, contact),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTACT, variables.id],
      });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH] });
    },
  });
};
