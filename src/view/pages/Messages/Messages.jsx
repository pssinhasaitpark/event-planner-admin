import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  deleteMessageData,
} from "../../redux/slice/messageSlice";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

function Messages() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.message);
  const [showLoader, setShowLoader] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Delete dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  // Expanded message state
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (id) => {
    setSelectedMessageId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMessageId(null);
  };

  const handleDelete = async () => {
    if (selectedMessageId) {
      try {
        await dispatch(deleteMessageData(selectedMessageId)).unwrap();
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete the message. Please try again.");
      }
      handleCloseDialog();
    }
  };

  const displayMessages = messages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress sx={{ color: "#F68633" }} />
      </Box>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: 0, borderRadius: 0, overflow: "hidden" }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Messages
      </Typography>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell sx={{ fontWeight: "bold" }}>S. No.</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayMessages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ p: 2 }}>
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            displayMessages?.map((msg, index) => (
              <TableRow
                key={msg._id}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: expandedRows[msg._id] ? "none" : 3,
                        WebkitBoxOrient: "vertical",
                        display: "-webkit-box",
                      }}
                    >
                      {msg.message}
                    </Typography>
                    {msg.message.length > 100 && (
                      <Typography
                        onClick={() => toggleExpand(msg._id)}
                        sx={{
                          color: "primary.main",
                          ml: 1,
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "10px",
                        }}
                      >
                        {expandedRows[msg._id] ? "Show Less" : "Show More"}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDialog(msg._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="center" width="100%" mt={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={messages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this message?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default Messages;
