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
      placeholder="Search by name, email, or phone..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "#4F46E5" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "white",
          "&:hover": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4F46E5",
            },
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4F46E5",
              borderWidth: "2px",
            },
          },
        },
      }}
    />
  );
};
