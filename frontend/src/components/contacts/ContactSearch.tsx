import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface ContactSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ContactSearch: React.FC<ContactSearchProps> = ({
  value,
  onChange,
}) => {
  return (
    <TextField
      fullWidth
      placeholder="Search contacts by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon className="text-gray-400" />
          </InputAdornment>
        ),
      }}
      className="bg-white"
    />
  );
};
