import React, { useState } from "react";
import { Paper, Typography, Box, Button, Avatar, Divider } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { ChangePasswordModal } from "./ChangePasswordModal";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (!user) return null;

  return (
    <Box>
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 bg-blue-600 text-4xl mb-4">
            {user.firstName[0]}
            {user.lastName[0]}
          </Avatar>
          <Typography variant="h4" className="font-bold text-gray-800">
            {user.firstName} {user.lastName}
          </Typography>
        </Box>

        <Divider className="my-6" />

        <Box className="space-y-4">
          <Box className="flex items-center gap-3">
            <PersonIcon className="text-gray-500" />
            <Box>
              <Typography variant="caption" className="text-gray-600">
                Full Name
              </Typography>
              <Typography variant="body1" className="font-medium">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
          </Box>

          {user.email && (
            <Box className="flex items-center gap-3">
              <EmailIcon className="text-gray-500" />
              <Box>
                <Typography variant="caption" className="text-gray-600">
                  Email Address
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}

          {user.phoneNumber && (
            <Box className="flex items-center gap-3">
              <PhoneIcon className="text-gray-500" />
              <Box>
                <Typography variant="caption" className="text-gray-600">
                  Phone Number
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {user.phoneNumber}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Divider className="my-6" />

        <Button
          variant="contained"
          fullWidth
          startIcon={<LockIcon />}
          onClick={() => setPasswordModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Change Password
        </Button>
      </Paper>

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </Box>
  );
};
