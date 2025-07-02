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
  MenuItem,
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchGallery,
  saveGalleryImages,
  saveGalleryVideos,
  deleteGalleryItem,
  updateGalleryItem,
} from "../../redux/slice/GallerySlice";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  mediaType: Yup.string().required("Media Type is required"),
  mediaUrls: Yup.array().min(1, "At least one media file is required").max(10, "Maximum 10 media files are allowed"),
});

const Gallery = () => {
  const dispatch = useDispatch();
  const { data: galleryData, status } = useSelector(
    (state) => state.gallery
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [galleryIdToDelete, setGalleryIdToDelete] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewGalleryItem, setPreviewGalleryItem] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (galleryItem) => {
    setOpenModal(true);
    setEditMode(true);
    setSelectedGalleryId(galleryItem._id);
  };

  const handleDeleteClick = (galleryId) => {
    setGalleryIdToDelete(galleryId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGalleryItem = async () => {
    if (galleryIdToDelete) {
      await dispatch(deleteGalleryItem(galleryIdToDelete));
      dispatch(fetchGallery());
    }
    setDeleteDialogOpen(false);
    setGalleryIdToDelete(null);
  };

  const resetForm = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedGalleryId(null);
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("mediaType", values.mediaType);
    formData.append("category", values.category);

    values.mediaUrls.forEach((media) => {
      if (values.mediaType === "photo") {
        formData.append("images", media);
      } else {
        formData.append("videos", media);
      }
    });

    try {
      if (editMode) {
        await dispatch(
          updateGalleryItem({ galleryId: selectedGalleryId, data: formData })
        );
      } else {
        if (values.mediaType === "photo") {
          await dispatch(saveGalleryImages(formData));
        } else {
          await dispatch(saveGalleryVideos(formData));
        }
      }
      resetForm();
      setOpenModal(false);
      setEditMode(false);
      setSelectedGalleryId(null);
      dispatch(fetchGallery());
    } catch (error) {
      console.error("Error saving/updating gallery item:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreviewClick = (galleryItem) => {
    setPreviewGalleryItem(galleryItem);
    setPreviewDialogOpen(true);
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewGalleryItem.mediaUrls);
    setLightboxOpen(true);
  };

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
        Gallery
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Gallery Item
        </Button>
      </Box>

      {galleryData && galleryData.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Media</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {galleryData.map((galleryItem) => (
                <TableRow key={galleryItem._id}>
                  <TableCell>{galleryItem.title}</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: galleryItem.description
                          ? `${galleryItem.description.substring(0, 50)}...`
                          : "No description available.",
                      }}
                    />
                  </TableCell>
                  <TableCell>{galleryItem.category}</TableCell>
                  <TableCell>
                    {galleryItem.mediaUrls && galleryItem.mediaUrls.length > 0 && (
                      <Avatar
                        src={galleryItem.mediaUrls[0]}
                        variant="rounded"
                        sx={{ width: 100, height: 70, borderRadius: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewClick(galleryItem)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(galleryItem)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(galleryItem._id)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ my: 4, textAlign: "center" }}
        >
          No gallery items available. Please add a new gallery item.
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
        <DialogTitle>{editMode ? "Edit Gallery Item" : "Add New Gallery Item"}</DialogTitle>
        <Formik
          initialValues={{
            title: editMode ? galleryData.find(item => item._id === selectedGalleryId)?.title : "",
            description: editMode ? galleryData.find(item => item._id === selectedGalleryId)?.description : "",
            mediaType: editMode ? galleryData.find(item => item._id === selectedGalleryId)?.mediaType : "photo",
            category: editMode ? galleryData.find(item => item._id === selectedGalleryId)?.category : "",
            mediaUrls: editMode ? galleryData.find(item => item._id === selectedGalleryId)?.mediaUrls || [] : [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  label="Title"
                  name="title"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="title" component="div" style={{ color: "red" }} />}
                  error={!!values.title}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <JoditEditor
                    value={values.description}
                    onChange={(content) => setFieldValue("description", content)}
                  />
                  <ErrorMessage name="description" component="div" style={{ color: "red" }} />
                </Box>
                <Field
                  as={TextField}
                  label="Category"
                  name="category"
                  fullWidth
                  sx={{ mt: 2 }}
                  select
                  helperText={<ErrorMessage name="category" component="div" style={{ color: "red" }} />}
                  error={!!values.category}
                >
                  <MenuItem value="Projects">Projects</MenuItem>
                  <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                  <MenuItem value="News">News</MenuItem>
                </Field>
                <Field
                  as={TextField}
                  label="Media Type"
                  name="mediaType"
                  fullWidth
                  sx={{ mt: 2 }}
                  select
                  helperText={<ErrorMessage name="mediaType" component="div" style={{ color: "red" }} />}
                  error={!!values.mediaType}
                >
                  <MenuItem value="photo">Photo</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                </Field>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Media
                </Typography>
                <input
                  type="file"
                  accept={values.mediaType === "photo" ? "image/*" : "video/*"}
                  onChange={(event) => {
                    const files = event.target.files;
                    const selectedMedia = [...values.mediaUrls, ...files];
                    if (selectedMedia.length > 10) {
                      alert("You can upload a maximum of 10 media files.");
                      return;
                    }
                    setFieldValue("mediaUrls", selectedMedia);
                  }}
                  style={{ marginTop: "10px", display: "block" }}
                  multiple
                />
                <ErrorMessage name="mediaUrls" component="div" style={{ color: "red" }} />
                {values.mediaUrls.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Selected Media:</Typography>
                    {values.mediaUrls.map((media, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          mt: 1,
                          mr: 2,
                        }}
                      >
                        <Avatar
                          src={
                            media instanceof File ? URL.createObjectURL(media) : media
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
                            const newMediaUrls = values.mediaUrls.filter((_, i) => i !== index);
                            setFieldValue("mediaUrls", newMediaUrls);
                          }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={resetForm} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#023e8a",
                    "&:hover": { backgroundColor: "#023e8a" },
                    textTransform: "none",
                  }}
                >
                  {editMode ? "Update" : "Submit"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this gallery item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteGalleryItem} color="error" variant="contained">
            Delete
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
        <DialogTitle>Preview Gallery Item</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewGalleryItem && (
            <Box sx={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
              <Typography variant="h6">Title: {previewGalleryItem.title}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Category: {previewGalleryItem.category}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Description:
              </Typography>
              <div
                dangerouslySetInnerHTML={{ __html: previewGalleryItem.description }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Media:
              </Typography>
              {previewGalleryItem.mediaUrls && previewGalleryItem.mediaUrls.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {previewGalleryItem.mediaUrls.map((media, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        mt: 1,
                        mr: 2,
                      }}
                    >
                      <Avatar
                        src={media}
                        variant="rounded"
                        sx={{ width: 100, height: 70, borderRadius: 1, cursor: "pointer" }}
                        onClick={() => handleImageClick(index)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1">No media available.</Typography>
              )}
            </Box>
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
          slides={lightboxImages.map(image => ({ src: image }))}
          index={lightboxIndex}
        />
      )}
    </Container>
  );
};

export default Gallery;
