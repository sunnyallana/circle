import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
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
import PeopleIcon from "@mui/icons-material/People";

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

  const totalContacts = data?.data.totalElements || 0;

  return (
    <Layout>
      <Box className="animate-fade-in">
        {/* Header */}
        <Box
          sx={{
            mb: 6,
            pb: 4,
            borderBottom: "2px solid",
            borderImage: "linear-gradient(90deg, #4F46E5 0%, #F97316 100%) 1",
          }}
        >
          <Box className="flex justify-between items-start mb-4">
            <Box>
              <Box className="flex items-center gap-3 mb-2">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #F97316 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    color: "#1E293B",
                  }}
                >
                  My Contacts
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "#64748B",
                  ml: 7.5,
                }}
              >
                Manage and organize your network
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                boxShadow: "0 4px 6px -1px rgb(79 70 229 / 0.3)",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)",
                  boxShadow: "0 10px 15px -3px rgb(79 70 229 / 0.4)",
                },
              }}
            >
              Add Contact
            </Button>
          </Box>

          {/* Stats */}
          <Box className="flex items-center gap-3 ml-60">
            <Chip
              label={`${totalContacts} ${totalContacts === 1 ? "Contact" : "Contacts"}`}
              sx={{
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
                fontWeight: 600,
                borderRadius: "8px",
                height: 32,
              }}
            />
            {isSearchMode && (
              <Chip
                label={`Searching: "${searchQuery}"`}
                onDelete={() => setSearchQuery("")}
                sx={{
                  backgroundColor: "#FFF7ED",
                  color: "#F97316",
                  fontWeight: 600,
                  borderRadius: "8px",
                  height: 32,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box className="mb-6 flex gap-4 items-end">
          <Box className="flex-1">
            <ContactSearch value={searchQuery} onChange={setSearchQuery} />
          </Box>
          <FormControl sx={{ width: 160 }}>
            <InputLabel>Per Page</InputLabel>
            <Select
              value={size}
              onChange={(e) => handleSizeChange(e.target.value as number)}
              label="Per Page"
              sx={{
                borderRadius: "12px",
              }}
            >
              {PAGINATION.PAGE_SIZE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option} contacts
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Contact List */}
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

      {/* Modals */}
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
