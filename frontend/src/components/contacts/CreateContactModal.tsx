import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContactRequest, EmailType, PhoneType } from "../../types";
import { useCreateContact } from "../../hooks/useContacts";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().optional(),
  emails: z
    .array(
      z.object({
        email: z.string().email("Invalid email"),
        type: z.nativeEnum(EmailType),
      }),
    )
    .min(1, "At least one email is required"),
  phones: z
    .array(
      z.object({
        phoneNumber: z.string().min(1, "Phone number is required"),
        type: z.nativeEnum(PhoneType),
      }),
    )
    .min(1, "At least one phone is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface CreateContactModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateContactModal: React.FC<CreateContactModalProps> = ({
  open,
  onClose,
}) => {
  const createContact = useCreateContact();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      title: "",
      emails: [{ email: "", type: EmailType.WORK }],
      phones: [{ phoneNumber: "", type: PhoneType.PERSONAL }],
    },
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: "emails",
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "phones",
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createContact.mutateAsync(data as ContactRequest);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create contact:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-blue-600 text-white">
        <Typography variant="h6">Create New Contact</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="mt-4">
          {createContact.isError && (
            <Alert severity="error" className="mb-4">
              Failed to create contact. Please try again.
            </Alert>
          )}

          <Box className="grid grid-cols-2 gap-4 mb-4">
            <TextField
              {...register("firstName")}
              label="First Name"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              {...register("lastName")}
              label="Last Name"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Box>

          <TextField
            {...register("title")}
            label="Title (optional)"
            fullWidth
            className="mb-4"
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {/* Emails Section */}
          <Box className="mb-4">
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="subtitle1" className="font-semibold">
                Email Addresses
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => appendEmail({ email: "", type: EmailType.WORK })}
                className="text-blue-600"
              >
                Add Email
              </Button>
            </Box>

            {emailFields.map((field, index) => (
              <Box key={field.id} className="flex gap-2 mb-2">
                <TextField
                  {...register(`emails.${index}.email`)}
                  label="Email"
                  fullWidth
                  error={!!errors.emails?.[index]?.email}
                  helperText={errors.emails?.[index]?.email?.message}
                />
                <TextField
                  {...register(`emails.${index}.type`)}
                  select
                  label="Type"
                  className="w-40"
                  defaultValue={EmailType.WORK}
                >
                  {Object.values(EmailType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                {emailFields.length > 1 && (
                  <IconButton
                    onClick={() => removeEmail(index)}
                    className="text-red-600"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {errors.emails && typeof errors.emails.message === "string" && (
              <Typography variant="caption" className="text-red-600">
                {errors.emails.message}
              </Typography>
            )}
          </Box>

          {/* Phones Section */}
          <Box>
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="subtitle1" className="font-semibold">
                Phone Numbers
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() =>
                  appendPhone({ phoneNumber: "", type: PhoneType.PERSONAL })
                }
                className="text-blue-600"
              >
                Add Phone
              </Button>
            </Box>

            {phoneFields.map((field, index) => (
              <Box key={field.id} className="flex gap-2 mb-2">
                <TextField
                  {...register(`phones.${index}.phoneNumber`)}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phones?.[index]?.phoneNumber}
                  helperText={errors.phones?.[index]?.phoneNumber?.message}
                />
                <TextField
                  {...register(`phones.${index}.type`)}
                  select
                  label="Type"
                  className="w-40"
                  defaultValue={PhoneType.PERSONAL}
                >
                  {Object.values(PhoneType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                {phoneFields.length > 1 && (
                  <IconButton
                    onClick={() => removePhone(index)}
                    className="text-red-600"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {errors.phones && typeof errors.phones.message === "string" && (
              <Typography variant="caption" className="text-red-600">
                {errors.phones.message}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions className="p-4">
          <Button onClick={handleClose} disabled={createContact.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createContact.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createContact.isPending ? "Creating..." : "Create Contact"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
