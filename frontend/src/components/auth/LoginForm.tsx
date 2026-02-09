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
import LoginIcon from "@mui/icons-material/Login";

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
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Paper elevation={3} className="p-8 w-full max-w-md">
        <Box className="text-center mb-6">
          <LoginIcon className="text-blue-600 text-6xl mb-2" />
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-800"
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" className="text-gray-600 mt-2">
            Sign in to manage your contacts
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
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
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            className="mt-6 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <Box className="text-center mt-4">
            <Typography variant="body2" className="text-gray-600">
              Don't have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate(ROUTES.REGISTER)}
                className="text-blue-600 hover:text-blue-800"
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
