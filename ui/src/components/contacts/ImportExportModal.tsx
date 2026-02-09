import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tab,
  Tabs,
  Alert,
  LinearProgress,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import {
  useImportContactsFromJson,
  useImportContactsFromCsv,
  useExportContactsAsJson,
  useExportContactsAsCsv,
} from "../../hooks/useContacts";

interface ImportExportModalProps {
  open: boolean;
  onClose: () => void;
}

type TabValue = "import" | "export";
type FileType = "json" | "csv" | null;

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  open,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabValue>("import");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>(null);
  const [importStatus, setImportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [importedCount, setImportedCount] = useState<number>(0);

  const importJson = useImportContactsFromJson();
  const importCsv = useImportContactsFromCsv();
  const exportJson = useExportContactsAsJson();
  const exportCsv = useExportContactsAsCsv();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const extension = file.name.split(".").pop()?.toLowerCase();
      setFileType(
        extension === "json" || extension === "csv" ? extension : null,
      );
      setImportStatus("idle");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (!selectedFile || !fileType) return;

    setImportStatus("idle");

    try {
      let result;
      if (fileType === "json") {
        result = await importJson.mutateAsync(selectedFile);
      } else {
        result = await importCsv.mutateAsync(selectedFile);
      }

      setImportedCount(result.data.length);
      setImportStatus("success");

      // Reset after 2 seconds and close
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Import failed:", error);
      setImportStatus("error");
    }
  };

  const handleExportJson = async () => {
    try {
      await exportJson.mutateAsync();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleExportCsv = async () => {
    try {
      await exportCsv.mutateAsync();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileType(null);
    setImportStatus("idle");
    setImportedCount(0);
    onClose();
  };

  const isImporting = importJson.isPending || importCsv.isPending;
  const isExporting = exportJson.isPending || exportCsv.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #4F46E5 0%, #F97316 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Import / Export Contacts
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => {
            setActiveTab(newValue);
            setSelectedFile(null);
            setFileType(null);
            setImportStatus("idle");
          }}
          sx={{
            px: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            },
          }}
        >
          <Tab
            icon={<UploadFileIcon />}
            iconPosition="start"
            label="Import"
            value="import"
          />
          <Tab
            icon={<DownloadIcon />}
            iconPosition="start"
            label="Export"
            value="export"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ py: 4 }}>
        {activeTab === "import" ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload a JSON or CSV file to import contacts into your account.
              All contacts from the file will be added to your existing
              contacts.
            </Typography>

            {/* Dropzone */}
            <Paper
              {...getRootProps()}
              sx={{
                p: 4,
                border: "2px dashed",
                borderColor: isDragActive ? "#4F46E5" : "#E2E8F0",
                backgroundColor: isDragActive ? "#EEF2FF" : "#F8FAFC",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "center",
                "&:hover": {
                  borderColor: "#4F46E5",
                  backgroundColor: "#EEF2FF",
                },
              }}
            >
              <input {...getInputProps()} />
              <UploadFileIcon sx={{ fontSize: 64, color: "#94A3B8", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {isDragActive
                  ? "Drop file here"
                  : "Drag & drop file here, or click to browse"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports .json and .csv files
              </Typography>
            </Paper>

            {/* Selected File Display */}
            {selectedFile && (
              <Box sx={{ mt: 3 }}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {fileType === "json" ? (
                        <DescriptionIcon
                          sx={{ color: "#4F46E5", fontSize: 40 }}
                        />
                      ) : (
                        <TableChartIcon
                          sx={{ color: "#F97316", fontSize: 40 }}
                        />
                      )}
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={fileType?.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor:
                            fileType === "json" ? "#EEF2FF" : "#FFF7ED",
                          color: fileType === "json" ? "#4F46E5" : "#F97316",
                          fontWeight: 600,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedFile(null);
                          setFileType(null);
                          setImportStatus("idle");
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Import Progress */}
            {isImporting && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  Importing contacts...
                </Typography>
              </Box>
            )}

            {/* Import Status */}
            {importStatus === "success" && (
              <Alert
                icon={<CheckCircleIcon />}
                severity="success"
                sx={{ mt: 3 }}
              >
                Successfully imported {importedCount} contact
                {importedCount !== 1 ? "s" : ""}!
              </Alert>
            )}

            {importStatus === "error" && (
              <Alert icon={<ErrorIcon />} severity="error" sx={{ mt: 3 }}>
                Failed to import contacts. Please check your file format and try
                again.
              </Alert>
            )}

            {/* Format Examples */}
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: 600, color: "#64748B" }}
              >
                File Format Examples
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Paper
                  sx={{
                    flex: 1,
                    p: 2,
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#4F46E5" }}
                  >
                    JSON Format
                  </Typography>
                  <pre
                    style={{
                      fontSize: "0.75rem",
                      margin: "8px 0 0 0",
                      overflow: "auto",
                    }}
                  >
                    {`[{
  "firstName": "John",
  "lastName": "Doe",
  "title": "Manager",
  "emails": [{
    "email": "john@example.com",
    "type": "WORK"
  }],
  "phones": [{
    "phoneNumber": "+1234567890",
    "type": "PERSONAL"
  }]
}]`}
                  </pre>
                </Paper>
                <Paper
                  sx={{
                    flex: 1,
                    p: 2,
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#F97316" }}
                  >
                    CSV Format
                  </Typography>
                  <pre
                    style={{
                      fontSize: "0.75rem",
                      margin: "8px 0 0 0",
                      overflow: "auto",
                    }}
                  >
                    {`First Name,Last Name,Title,Emails,Phones
John,Doe,Manager,"john@example.com (WORK)","123-456-7890 (PERSONAL)"`}
                  </pre>
                </Paper>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Export all your contacts to a JSON or CSV file. You can use these
              files to backup your data or import them into other applications.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper
                sx={{
                  p: 3,
                  border: "2px solid #E2E8F0",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#4F46E5",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DescriptionIcon sx={{ fontSize: 40, color: "#4F46E5" }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Export as JSON
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Download contacts in JSON format with full details
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportJson}
                    disabled={isExporting}
                    sx={{
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)",
                      },
                    }}
                  >
                    {exportJson.isPending ? "Exporting..." : "Export JSON"}
                  </Button>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  border: "2px solid #E2E8F0",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#F97316",
                    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TableChartIcon sx={{ fontSize: 40, color: "#F97316" }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Export as CSV
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Download contacts in CSV format for spreadsheets
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportCsv}
                    disabled={isExporting}
                    sx={{
                      background:
                        "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
                      },
                    }}
                  >
                    {exportCsv.isPending ? "Exporting..." : "Export CSV"}
                  </Button>
                </Box>
              </Paper>
            </Box>

            {isExporting && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  Preparing your export...
                </Typography>
              </Box>
            )}

            {(exportJson.isSuccess || exportCsv.isSuccess) && (
              <Alert
                icon={<CheckCircleIcon />}
                severity="success"
                sx={{ mt: 3 }}
              >
                Export completed successfully! Your download should start
                automatically.
              </Alert>
            )}

            {(exportJson.isError || exportCsv.isError) && (
              <Alert icon={<ErrorIcon />} severity="error" sx={{ mt: 3 }}>
                Failed to export contacts. Please try again.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
        {activeTab === "import" ? (
          <>
            <Button onClick={handleClose} disabled={isImporting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={!selectedFile || !fileType || isImporting}
              sx={{
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)",
                },
              }}
            >
              {isImporting ? "Importing..." : "Import Contacts"}
            </Button>
          </>
        ) : (
          <Button onClick={handleClose}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
