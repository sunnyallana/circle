import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import ContactsIcon from "@mui/icons-material/Contacts";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

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
      className="bg-gradient-to-r from-blue-600 to-blue-800"
    >
      <Toolbar>
        <ContactsIcon className="mr-2" />
        <Typography variant="h6" component="div" className="flex-grow">
          Contact Management
        </Typography>

        <Box className="flex items-center gap-2">
          <Button
            color="inherit"
            onClick={() => navigate(ROUTES.CONTACTS)}
            className={isActive(ROUTES.CONTACTS) ? "bg-blue-700" : ""}
            startIcon={<ContactsIcon />}
          >
            Contacts
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate(ROUTES.PROFILE)}
            className={isActive(ROUTES.PROFILE) ? "bg-blue-700" : ""}
            startIcon={<PersonIcon />}
          >
            Profile
          </Button>

          <Box className="flex items-center gap-2 ml-4">
            <Avatar className="bg-blue-900">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Avatar>
            <Typography variant="body2" className="hidden md:block">
              {user?.firstName} {user?.lastName}
            </Typography>
          </Box>

          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
