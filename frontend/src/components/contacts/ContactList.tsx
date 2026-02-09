import React from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Pagination,
} from "@mui/material";
import { Contact } from "../../types";
import { ContactCard } from "./ContactCard";

interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </Box>
    );
  }

  if (contacts.length === 0) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <Typography variant="h6" className="text-gray-500">
          No contacts found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {contacts.map((contact) => (
          <Grid item xs={12} sm={6} md={4} key={contact.id}>
            <ContactCard
              contact={contact}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={(_, page) => onPageChange(page - 1)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};
