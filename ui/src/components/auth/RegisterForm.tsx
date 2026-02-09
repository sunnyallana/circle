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
import { Circle as CircleIcon } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .refine(
        (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
        "Phone must be in international format (e.g., +1234567890)",
      )
      .optional()
      .or(z.literal("")),
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
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <Box
      className="flex items-center justify-center min-h-screen relative overflow-hidden py-8"
      sx={{
        background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
          opacity: 0.15,
          filter: "blur(80px)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
          opacity: 0.2,
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <Paper
        elevation={0}
        className="p-10 w-full max-w-md relative z-10 animate-slide-up"
        sx={{
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
      >
        <Box className="text-center mb-6">
          {/* Logo */}
          <Box className="relative inline-flex mb-3">
            <CircleIcon sx={{ fontSize: 56, color: "#F97316", opacity: 0.9 }} />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              background: "linear-gradient(135deg, #F97316 0%, #4F46E5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
            }}
          >
            Join Circle
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748B", fontWeight: 500 }}
          >
            Create your account and start connecting
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            className="mb-4"
            sx={{ borderRadius: "12px" }}
          >
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
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              {...register("lastName")}
              label="Last Name"
              fullWidth
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Box>

          <TextField
            {...register("email")}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message || "Required if no phone number"}
            autoComplete="email"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <TextField
            {...register("phoneNumber")}
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.phoneNumber}
            helperText={
              errors.phoneNumber?.message ||
              "Format: +1234567890 (Required if no email)"
            }
            autoComplete="tel"
            placeholder="+1234567890"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              boxShadow: "0 4px 6px -1px rgb(249 115 22 / 0.3)",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
                boxShadow: "0 10px 15px -3px rgb(249 115 22 / 0.4)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)",
              },
            }}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <Box className="text-center mt-4">
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate(ROUTES.LOGIN)}
                sx={{
                  color: "#F97316",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-20px) scale(1.05);
            }
          }
        `}
      </style>
    </Box>
  );
};
