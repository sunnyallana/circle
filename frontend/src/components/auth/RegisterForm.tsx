import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phoneNumber: z.string().optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      navigate(ROUTES.CONTACTS);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <Paper elevation={3} className="p-8 w-full max-w-md">
        <Box className="text-center mb-6">
          <PersonAddIcon className="text-green-600 text-6xl mb-2" />
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-800"
          >
            Create Account
          </Typography>
          <Typography variant="body2" className="text-gray-600 mt-2">
            Join us to manage your contacts
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="grid grid-cols-2 gap-4">
            <TextField
              {...register("firstName")}
              label="First Name"
              fullWidth
              margin="normal"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />

            <TextField
              {...register("lastName")}
              label="Last Name"
              fullWidth
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Box>

          <TextField
            {...register("email")}
            label="Email (optional)"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
          />

          <TextField
            {...register("phoneNumber")}
            label="Phone Number (optional)"
            fullWidth
            margin="normal"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            autoComplete="tel"
          />

          <TextField
            {...register("password")}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="new-password"
          />

          <TextField
            {...register("confirmPassword")}
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            className="mt-6 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </Button>

          <Box className="text-center mt-4">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="text-green-600 hover:text-green-800"
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
