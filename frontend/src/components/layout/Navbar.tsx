import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import ContactsIcon from "@mui/icons-material/Contacts";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Circle as CircleIcon } from "@mui/icons-material";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="circle-gradient"
      sx={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo */}
        <Box className="flex items-center gap-2 flex-grow">
          <Box className="relative">
            <CircleIcon sx={{ fontSize: 32, color: "white", opacity: 0.9 }} />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Circle
          </Typography>
        </Box>

        {/* Navigation */}
        <Box className="flex items-center gap-2">
          <Button
            color="inherit"
            onClick={() => navigate(ROUTES.CONTACTS)}
            startIcon={<ContactsIcon />}
            sx={{
              color: "white",
              backgroundColor: isActive(ROUTES.CONTACTS)
                ? "rgba(255, 255, 255, 0.15)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Contacts
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate(ROUTES.PROFILE)}
            startIcon={<PersonIcon />}
            sx={{
              color: "white",
              backgroundColor: isActive(ROUTES.PROFILE)
                ? "rgba(255, 255, 255, 0.15)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Profile
          </Button>

          {/* User Info */}
          <Box
            className="flex items-center gap-3 ml-4 pl-4"
            sx={{ borderLeft: "1px solid rgba(255, 255, 255, 0.2)" }}
          >
            <Box className="hidden md:flex flex-col items-end">
              <Typography
                variant="body2"
                sx={{ color: "white", fontWeight: 600, lineHeight: 1.2 }}
              >
                {user?.firstName} {user?.lastName}
              </Typography>
              <Chip
                label="Active"
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  backgroundColor: "rgba(249, 115, 22, 0.9)",
                  color: "white",
                  fontWeight: 600,
                  mt: 0.5,
                }}
              />
            </Box>
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 700,
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Avatar>
          </Box>

          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Logout"
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
