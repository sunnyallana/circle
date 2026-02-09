import React from "react";
import { Box, Container } from "@mui/material";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Navbar />
      <Container maxWidth="xl" className="py-8">
        {children}
      </Container>
    </Box>
  );
};
