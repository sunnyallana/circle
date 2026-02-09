import { useEffect } from "react";
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
import { Contact, ContactRequest, EmailType, PhoneType } from "../../types";
import { useUpdateContact } from "../../hooks/useContacts";
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

interface UpdateContactModalProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
}

export const UpdateContactModal: React.FC<UpdateContactModalProps> = ({
  open,
  contact,
  onClose,
}) => {
  const updateContact = useUpdateContact();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
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

  useEffect(() => {
    if (contact) {
      reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        title: contact.title || "",
        emails: contact.emails.map((e) => ({ email: e.email, type: e.type })),
        phones: contact.phones.map((p) => ({
          phoneNumber: p.phoneNumber,
          type: p.type,
        })),
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: ContactFormData) => {
    if (!contact) return;

    try {
      await updateContact.mutateAsync({
        id: contact.id,
        contact: data as ContactRequest,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-blue-600 text-white">
        <Typography variant="h6">Update Contact</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="mt-4">
          {updateContact.isError && (
            <Alert severity="error" className="mb-4">
              Failed to update contact. Please try again.
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
          />

          <Box className="mb-4">
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="subtitle1" className="font-semibold">
                Email Addresses
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => appendEmail({ email: "", type: EmailType.WORK })}
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
                  <IconButton onClick={() => removeEmail(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

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
                  <IconButton onClick={() => removePhone(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions className="p-4">
          <Button onClick={onClose} disabled={updateContact.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateContact.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {updateContact.isPending ? "Updating..." : "Update Contact"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
