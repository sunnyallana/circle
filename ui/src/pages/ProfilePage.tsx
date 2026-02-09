import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { Layout } from "../components/layout/Layout";
import { UserProfile } from "../components/profile/UserProfile";

export const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h4" className="font-bold mb-6">
          My Profile
        </Typography>
        <UserProfile />
      </Container>
    </Layout>
  );
};
