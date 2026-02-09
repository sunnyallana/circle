import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "../../api/auth.api";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setError("");
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        reset();
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleClose = () => {
    reset();
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="bg-blue-600 text-white">
        <Typography variant="h6">Change Password</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="mt-4">
          {success && (
            <Alert severity="success" className="mb-4">
              Password changed successfully!
            </Alert>
          )}

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <TextField
            {...register("currentPassword")}
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            autoComplete="current-password"
          />

          <TextField
            {...register("newPassword")}
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            autoComplete="new-password"
          />

          <TextField
            {...register("confirmPassword")}
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
        </DialogContent>

        <DialogActions className="p-4">
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
