import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { Contact } from "../../types";
import { useDeleteContact } from "../../hooks/useContacts";
import WarningIcon from "@mui/icons-material/Warning";

interface DeleteContactModalProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
}

export const DeleteContactModal: React.FC<DeleteContactModalProps> = ({
  open,
  contact,
  onClose,
}) => {
  const deleteContact = useDeleteContact();

  const handleDelete = async () => {
    if (!contact) return;

    try {
      await deleteContact.mutateAsync(contact.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="bg-red-600 text-white flex items-center gap-2">
        <WarningIcon />
        <Typography variant="h6">Confirm Delete</Typography>
      </DialogTitle>

      <DialogContent className="mt-4">
        {deleteContact.isError && (
          <Alert severity="error" className="mb-4">
            Failed to delete contact. Please try again.
          </Alert>
        )}

        <Typography variant="body1">
          Are you sure you want to delete the contact{" "}
          <strong>
            {contact.firstName} {contact.lastName}
          </strong>
          ?
        </Typography>
        <Typography variant="body2" className="text-gray-600 mt-2">
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onClose} disabled={deleteContact.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={deleteContact.isPending}
        >
          {deleteContact.isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
