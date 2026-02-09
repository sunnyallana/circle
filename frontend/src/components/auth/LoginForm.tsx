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

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      await login(data);
      navigate(ROUTES.CONTACTS);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <Box
      className="flex items-center justify-center min-h-screen relative overflow-hidden"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
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
          background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
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
        <Box className="text-center mb-8">
          {/* Logo */}
          <Box className="relative inline-flex mb-4">
            <CircleIcon sx={{ fontSize: 64, color: "#4F46E5", opacity: 0.9 }} />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              background: "linear-gradient(135deg, #4F46E5 0%, #F97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
            }}
          >
            Welcome to Circle
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748B", fontWeight: 500 }}
          >
            Connect with your network
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            className="mb-6"
            sx={{ borderRadius: "12px" }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("username")}
            label="Email or Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
            autoComplete="username"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <TextField
            {...register("password")}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 4,
              mb: 2,
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              boxShadow: "0 4px 6px -1px rgb(79 70 229 / 0.3)",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)",
                boxShadow: "0 10px 15px -3px rgb(79 70 229 / 0.4)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)",
              },
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <Box className="text-center mt-6">
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Don't have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate(ROUTES.REGISTER)}
                sx={{
                  color: "#4F46E5",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Join Circle
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
