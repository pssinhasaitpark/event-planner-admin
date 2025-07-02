import React, { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Modal,
  TextField,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination, // Import TablePagination
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSupportSpeakData,
  createSupportSpeaker,
  updateSupportSpeaker,
  deleteSupportSpeaker,
} from "../../redux/slice/supportSpeakSlice";
import { Delete as DeleteIcon, Edit } from "@mui/icons-material";
import { SlideshowLightbox } from "lightbox.js-react";
const SupportSpeak = () => {
  const dispatch = useDispatch();
  const supportSpeakData = useSelector((state) => state.supportSpeak) || {};
  const { supportSpeakers, status, error } = supportSpeakData;

  const [open, setOpen] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    post: "",
    location: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchSupportSpeakData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const handleOpen = (speaker = null) => {
    setCurrentSpeaker(speaker);
    if (speaker) {
      setFormData({
        name: speaker.name,
        post: speaker.post,
        location: speaker.location,
        images: speaker.images,
      });
      setImagePreviews(speaker.images.map((img) => img.url));
    } else {
      setFormData({ name: "", post: "", location: "", images: [] });
      setImagePreviews([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSpeaker(null);
    setImagePreviews([]); // Clear previews on close
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file))); // Create previews for new images
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      images: formData.images.map((file) => file), // Keep the file objects for upload
    };
    if (currentSpeaker) {
      dispatch(
        updateSupportSpeaker({
          id: currentSpeaker._id,
          supportSpeakData: dataToSubmit,
        })
      );
    } else {
      dispatch(createSupportSpeaker(dataToSubmit));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setSpeakerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (speakerToDelete) {
      dispatch(deleteSupportSpeaker(speakerToDelete));
      setDeleteDialogOpen(false);
      setSpeakerToDelete(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Slice the supportSpeakers array for pagination
  const paginatedSpeakers = supportSpeakers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  if (status.loading || showLoader)
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

  if (error)
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Support Speak
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#e0752d",
          "&:hover": { backgroundColor: "#F68633" },
          textTransform: "none",
          mb: 2,
        }}
        onClick={() => handleOpen()}
      >
        Add Speaker
      </Button>
      {status === "loading" ? (
        <CircularProgress />
      ) : paginatedSpeakers && paginatedSpeakers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Post</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSpeakers?.map((speaker) => (
                <TableRow key={speaker._id}>
                  <TableCell>{speaker.name}</TableCell>
                  <TableCell>{speaker.post}</TableCell>
                  <TableCell>{speaker.location}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {(speaker.images || []).map((image) => (
                        <SlideshowLightbox>
                          <img
                            key={image._id}
                            src={image.url}
                            alt={speaker.name}
                            style={{ width: "100px", height: "auto" }}
                          />
                        </SlideshowLightbox>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button
                      // variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleOpen(speaker)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      // variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ marginLeft: 1 }}
                      onClick={() => handleDelete(speaker._id)}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Post</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={12} align="center">
                No Support Speakers Found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={supportSpeakers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* Modal for Adding/Editing Speaker */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {currentSpeaker ? "Edit Speaker" : "Add Speaker"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Post"
              name="post"
              value={formData.post}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              style={{ marginTop: 16 }}
            />
            <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
              {imagePreviews.map((preview, index) => (
                <Avatar
                  key={index}
                  src={preview}
                  alt={`preview-${index}`}
                  sx={{ width: 40, height: 40 }}
                />
              ))}
            </Stack>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#e0752d",
                "&:hover": { backgroundColor: "#F68633" },
                textTransform: "none",
                mt: 2,
              }}
            >
              {currentSpeaker ? "Update" : "Create"}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this speaker? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error}
      />
    </Box>
  );
};

export default SupportSpeak;
