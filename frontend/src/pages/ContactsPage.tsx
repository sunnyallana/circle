import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Layout } from "../components/layout/Layout";
import { ContactList } from "../components/contacts/ContactList";
import { ContactSearch } from "../components/contacts/ContactSearch";
import { CreateContactModal } from "../components/contacts/CreateContactModal";
import { UpdateContactModal } from "../components/contacts/UpdateContactModal";
import { DeleteContactModal } from "../components/contacts/DeleteContactModal";
import { useContacts, useSearchContacts } from "../hooks/useContacts";
import { useDebounce } from "../hooks/useDebounce";
import { Contact } from "../types";
import { PAGINATION } from "../utils/constants";
import AddIcon from "@mui/icons-material/Add";

export const ContactsPage: React.FC = () => {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [size, setSize] = useState(PAGINATION.DEFAULT_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: contactsData, isLoading: isLoadingContacts } = useContacts({
    page,
    size,
    sortBy: "firstName",
    sortDir: "ASC",
  });

  const { data: searchData, isLoading: isSearching } = useSearchContacts(
    debouncedSearch,
    { page, size, sortBy: "firstName", sortDir: "ASC" },
  );

  const isSearchMode = debouncedSearch.length > 0;
  const data = isSearchMode ? searchData : contactsData;
  const isLoading = isSearchMode ? isSearching : isLoadingContacts;

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setUpdateModalOpen(true);
  };

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  return (
    <Layout>
      <Box>
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold">
            My Contacts
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Contact
          </Button>
        </Box>

        <Box className="mb-6 flex gap-4 items-end">
          <Box className="flex-1">
            <ContactSearch value={searchQuery} onChange={setSearchQuery} />
          </Box>
          <FormControl className="w-40">
            <InputLabel>Page Size</InputLabel>
            <Select
              value={size}
              onChange={(e) => handleSizeChange(e.target.value as number)}
              label="Page Size"
            >
              {PAGINATION.PAGE_SIZE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option} per page
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <ContactList
          contacts={data?.data.content || []}
          isLoading={isLoading}
          totalPages={data?.data.totalPages || 0}
          currentPage={page}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>

      <CreateContactModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <UpdateContactModal
        open={updateModalOpen}
        contact={selectedContact}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedContact(null);
        }}
      />

      <DeleteContactModal
        open={deleteModalOpen}
        contact={selectedContact}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedContact(null);
        }}
      />
    </Layout>
  );
};
