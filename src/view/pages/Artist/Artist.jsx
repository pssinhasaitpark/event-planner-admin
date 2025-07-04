// Artist.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Avatar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Pagination,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArtists,
  saveArtistToBackend,
  updateArtist,
  deleteArtist,
} from "../../redux/slice/artistSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Artist = () => {
  const dispatch = useDispatch();
  const artistsData = useSelector((state) => state.artist.data) || [];
  const status = useSelector((state) => state.artist.status);
  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [newArtist, setNewArtist] = useState({
    name: "",
    description: "",
    images: null,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistIdToDelete, setArtistIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    description: "",
    images: "",
  });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewArtist, setPreviewArtist] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const imageUrl = import.meta.env.VITE_REACT_IMAGE_URL;

  useEffect(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const validateFields = () => {
    const errors = {
      name: "",
      description: "",
      images: "",
    };

    if (!newArtist.name) errors.name = "Name is required.";
    if (!newArtist.description) errors.description = "Description is required.";
    if (!newArtist.images) errors.images = "Image is required.";

    setValidationErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const handleArtistUpload = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("description", newArtist.description);
    formData.append("images", newArtist.images);

    try {
      await dispatch(saveArtistToBackend(formData));
      resetForm();
      dispatch(fetchArtists());
    } catch (error) {
      console.error("Error saving artist:", error);
      setErrorMessage(
        error.data || "An error occurred while saving the artist."
      );
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setNewArtist({
      ...newArtist,
      images: file,
    });
  };

  const handleEditClick = (artist) => {
    setNewArtist({
      name: artist.name || "",
      description: artist.description || "",
      images: artist.images || null,
    });
    setSelectedArtistId(artist._id);
    setEditMode(true);
    setOpenModal(true);
    setErrorMessage("");
    setValidationErrors({ name: "", description: "", images: "" });
  };

  const handleDeleteClick = (artistId) => {
    setArtistIdToDelete(artistId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteArtist = async () => {
    if (artistIdToDelete) {
      await dispatch(deleteArtist(artistIdToDelete));
      dispatch(fetchArtists());
    }
    setDeleteDialogOpen(false);
    setArtistIdToDelete(null);
  };

  const resetForm = () => {
    setNewArtist({ name: "", description: "", images: null });
    setOpenModal(false);
    setEditMode(false);
    setSelectedArtistId(null);
    setErrorMessage("");
    setValidationErrors({ name: "", description: "", images: "" });
  };

  const handleAddArtist = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("description", newArtist.description);
    formData.append("images", newArtist.images);

    try {
      await dispatch(saveArtistToBackend(formData));
      resetForm();
      dispatch(fetchArtists());
    } catch (error) {
      console.error("Error saving artist:", error);
      setErrorMessage(
        error.data || "An error occurred while saving the artist."
      );
    }
  };

  const handleUpdateArtist = async () => {
    if (!validateFields()) return;

    if (!selectedArtistId) {
      console.error("Error: Missing artistId");
      return;
    }

    const formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("description", newArtist.description);
    if (newArtist.images) formData.append("images", newArtist.images);

    try {
      await dispatch(
        updateArtist({ artistId: selectedArtistId, data: formData })
      );
      resetForm();
      dispatch(fetchArtists());
    } catch (error) {
      console.error("Error updating artist:", error);
      setErrorMessage(
        error.data || "An error occurred while updating the artist."
      );
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePreviewClick = (artist) => {
    setPreviewArtist(artist);
    setPreviewDialogOpen(true);
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtistsData = artistsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (status === "loading" || showLoader) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress sx={{ color: "#1e1871" }} />
      </Box>
    );
  }

  if (status === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {status}
      </Typography>
    );

  return (
    <Container
      maxWidth="false"
      sx={{
        "@media (min-width: 600px)": {
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        },
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Artists
      </Typography>
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setErrorMessage("");
            setValidationErrors({ name: "", description: "", images: "" });
          }}
          sx={{
            backgroundColor: " #121212",
            "&:hover": { backgroundColor: " #121212" },
            textTransform: "none",
          }}
        >
          Add New Artist
        </Button>
      </Box>
      {artistsData && artistsData.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              height: "60vh", // Fixed height for the table container
              overflowY: "auto", // Enable vertical scrolling if content overflows
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentArtistsData.map((artist) => (
                  <TableRow key={artist._id}>
                    <TableCell sx={{ width: "20%" }}>
                      {artist.name || "Unknown"}
                    </TableCell>
                    <TableCell sx={{ width: "40%" }}>
                      <Box display="flex" alignItems="center">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: artist.description
                              ? `${artist.description.substring(0, 50)}...`
                              : "No description available.",
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      {artist.image && (
                        <Avatar
                          src={`${imageUrl}${artist.image}`}
                          variant="rounded"
                          sx={{ width: 100, height: 70, borderRadius: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handlePreviewClick(artist)}
                          sx={{ color: "#121212" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(artist)}
                          sx={{ color: "#121212", ml: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(artist._id)}
                          sx={{ color: "error", ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil(artistsData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              sx={{
                // backgroundColor: "#121212",
                borderRadius: "8px",
                padding: "4px 8px",
                "& .MuiPaginationItem-root": {
                  color: "#121212", // page number text color
                  borderColor: "#333",
                },
                "& .Mui-selected": {
                  backgroundColor: "#333 !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        </>
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ my: 4, textAlign: "center" }}
        >
          No artists available. Please add a new artist.
        </Typography>
      )}
      <Dialog
        open={openModal}
        onClose={resetForm}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>{editMode ? "Edit Artist" : "Add New Artist"}</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <TextField
            label="Name"
            fullWidth
            sx={{ mt: 2 }}
            value={newArtist.name}
            onChange={(e) =>
              setNewArtist({ ...newArtist, name: e.target.value })
            }
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <JoditEditor
              value={newArtist.description}
              onChange={(content) =>
                setNewArtist({ ...newArtist, description: content })
              }
            />
            {validationErrors.description && (
              <Typography color="error" sx={{ mt: 1 }}>
                {validationErrors.description}
              </Typography>
            )}
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Upload Artist Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "10px", display: "block" }}
          />
          {validationErrors.images && (
            <Typography color="error" sx={{ mt: 1 }}>
              {validationErrors.images}
            </Typography>
          )}
          {newArtist.images && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Selected Image:</Typography>
              <Box
                sx={{ position: "relative", display: "inline-block", mt: 1 }}
              >
                <Avatar
                  src={
                    newArtist.images instanceof File
                      ? URL.createObjectURL(newArtist.images)
                      : newArtist.images
                  }
                  variant="rounded"
                  sx={{ width: 100, height: 70, borderRadius: 1 }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "white",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#ff5252" },
                  }}
                  onClick={() => {
                    setNewArtist({
                      ...newArtist,
                      images: null,
                    });
                  }}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            onClick={editMode ? handleUpdateArtist : handleAddArtist}
            variant="contained"
            sx={{
              backgroundColor: " #121212",
              "&:hover": { backgroundColor: " #121212" },
              textTransform: "none",
            }}
          >
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>Preview Artist</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewArtist && (
            <>
              {/* REMOVED THE BOX WITH BORDER - Content now flows naturally */}
              <Typography variant="h6">Name: {previewArtist.name}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">Description:</Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: previewArtist.description,
                }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">Image:</Typography>
              {previewArtist.image ? (
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      mt: 1,
                    }}
                  >
                    <Avatar
                      // src={previewArtist.image}
                      src={`${imageUrl}${previewArtist.image}`}
                      variant="rounded"
                      sx={{
                        width: 100,
                        height: 70,
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(0)}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1">No image available.</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
                    
          slides={previewArtist.image ? [{ src: `${imageUrl}${previewArtist.image}` }] : []}
          index={lightboxIndex}
        />
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this artist?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteArtist}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Artist;
