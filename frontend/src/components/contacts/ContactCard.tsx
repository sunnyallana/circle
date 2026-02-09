import React from "react";
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
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent>
        <Box className="flex justify-between items-start mb-3">
          <Box>
            <Typography variant="h6" className="font-bold text-gray-800">
              {contact.firstName} {contact.lastName}
            </Typography>
            {contact.title && (
              <Box className="flex items-center gap-1 mt-1">
                <WorkIcon className="text-gray-500" fontSize="small" />
                <Typography variant="body2" className="text-gray-600">
                  {contact.title}
                </Typography>
              </Box>
            )}
          </Box>

          <Box>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(contact)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(contact)}
                className="text-red-600 hover:bg-red-50"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {contact.emails.length > 0 && (
          <Box className="mb-2">
            <Box className="flex items-center gap-1 mb-1">
              <EmailIcon className="text-gray-500" fontSize="small" />
              <Typography
                variant="caption"
                className="text-gray-600 font-semibold"
              >
                Emails:
              </Typography>
            </Box>
            {contact.emails.map((email, index) => (
              <Box key={index} className="flex items-center gap-2 ml-6 mb-1">
                <Chip
                  label={email.type}
                  size="small"
                  className="bg-blue-100 text-blue-800"
                />
                <Typography variant="body2" className="text-gray-700">
                  {email.email}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {contact.phones.length > 0 && (
          <Box>
            <Box className="flex items-center gap-1 mb-1">
              <PhoneIcon className="text-gray-500" fontSize="small" />
              <Typography
                variant="caption"
                className="text-gray-600 font-semibold"
              >
                Phones:
              </Typography>
            </Box>
            {contact.phones.map((phone, index) => (
              <Box key={index} className="flex items-center gap-2 ml-6 mb-1">
                <Chip
                  label={phone.type}
                  size="small"
                  className="bg-green-100 text-green-800"
                />
                <Typography variant="body2" className="text-gray-700">
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
