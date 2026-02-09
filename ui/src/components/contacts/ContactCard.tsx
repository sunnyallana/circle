import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import { Contact } from "../../types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      className="circle-card h-full"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #4F46E5 0%, #F97316 100%)",
          borderRadius: "16px 16px 0 0",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Box className="flex justify-between items-start mb-4">
          <Box className="flex items-start gap-3">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "1.25rem",
                fontFamily: '"DM Sans", sans-serif',
                flexShrink: 0,
              }}
            >
              {contact.firstName[0]}
              {contact.lastName[0]}
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  color: "#1E293B",
                  fontSize: "1.125rem",
                  lineHeight: 1.3,
                }}
              >
                {contact.firstName} {contact.lastName}
              </Typography>
              {contact.title && (
                <Box className="flex items-center gap-1 mt-1">
                  <WorkIcon sx={{ fontSize: 16, color: "#64748B" }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", fontWeight: 500 }}
                  >
                    {contact.title}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Edit" arrow>
              <IconButton
                size="small"
                onClick={() => onEdit(contact)}
                sx={{
                  color: "#4F46E5",
                  "&:hover": {
                    backgroundColor: "#EEF2FF",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                size="small"
                onClick={() => onDelete(contact)}
                sx={{
                  color: "#F97316",
                  "&:hover": {
                    backgroundColor: "#FFF7ED",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {contact.emails.length > 0 && (
          <Box className="mb-3">
            <Box className="flex items-center gap-1 mb-2">
              <EmailIcon sx={{ fontSize: 18, color: "#4F46E5" }} />
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                }}
              >
                Emails
              </Typography>
            </Box>
            {contact.emails.map((email, index) => (
              <Box key={index} className="flex items-center gap-2 mb-1.5 ml-6">
                <Chip
                  label={email.type}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    backgroundColor: "#EEF2FF",
                    color: "#4F46E5",
                    borderRadius: "6px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  {email.email}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {contact.phones.length > 0 && (
          <Box>
            <Box className="flex items-center gap-1 mb-2">
              <PhoneIcon sx={{ fontSize: 18, color: "#F97316" }} />
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                }}
              >
                Phones
              </Typography>
            </Box>
            {contact.phones.map((phone, index) => (
              <Box key={index} className="flex items-center gap-2 mb-1.5 ml-6">
                <Chip
                  label={phone.type}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    backgroundColor: "#FFF7ED",
                    color: "#F97316",
                    borderRadius: "6px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  {phone.phoneNumber}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
