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
  Select,
  FormControl,
  InputLabel,
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchPageDetails,
  savePageDetails,
  updatePageDetails,
  deletePageDetails,
} from "../../redux/slice/PageDetailsSlice";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  pageName: Yup.string().required("Page Name is required"),
  type: Yup.string().required("Type is required"),
});

const PageDetails = () => {
  const dispatch = useDispatch();
  const { data: pageDetailsData, status } = useSelector(
    (state) => state.pageDetails
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageIdToDelete, setPageIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);


  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewPage.images);
    setLightboxOpen(true);
  };

  useEffect(() => {
    dispatch(fetchPageDetails());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (page) => {
    setSelectedPage(page);
    setSelectedPageId(page._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (pageId) => {
    setPageIdToDelete(pageId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (page) => {
    setPreviewPage(page);
    setPreviewDialogOpen(true);
  };

  const confirmDeletePage = async () => {
    if (pageIdToDelete) {
      await dispatch(deletePageDetails(pageIdToDelete));
      dispatch(fetchPageDetails());
    }
    setDeleteDialogOpen(false);
    setPageIdToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedPage(null);
    setSelectedPageId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPages = pageDetailsData.slice(indexOfFirstItem, indexOfLastItem);

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
        Page Details
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setSelectedPage(null);
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Page
        </Button>
      </Box>

      {pageDetailsData && pageDetailsData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Page Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPages.map((page) => (
                  <TableRow key={page._id}>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: page.description
                            ? `${page.description.substring(0, 50)}...`
                            : "No description available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>{page.pageName}</TableCell>
                    <TableCell>{page.type}</TableCell>
                    <TableCell>
                      {page.images && page.images.length > 0 && (
                        <Avatar
                          src={page.images[0]}
                          variant="rounded"
                          sx={{ width: 100, height: 70, borderRadius: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(page)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(page)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(page._id)}
                          sx={{ border: 0 }}
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
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil(pageDetailsData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ my: 4, textAlign: "center" }}
        >
          No pages available. Please add a new page.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>{editMode ? "Edit Page" : "Add New Page"}</DialogTitle>
        <Formik
          initialValues={{
            title: selectedPage?.title || "",
            description: selectedPage?.description || "",
            pageName: selectedPage?.pageName || "",
            type: selectedPage?.type || "",
            images: selectedPage?.images || [],
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("pageName", values.pageName);
            formData.append("type", values.type);

            // Handle both existing images (URLs) and new file uploads
            values.images.forEach((image) => {
              if (image instanceof File) {
                formData.append("images", image);
              } else if (typeof image === 'string') {
                formData.append("existingImages", image);
              }
            });

            if (editMode) {
              await dispatch(
                updatePageDetails({ pageId: selectedPageId, data: formData })
              );
            } else {
              await dispatch(savePageDetails(formData));
            }

            resetForm();
            handleCloseModal();
            dispatch(fetchPageDetails());
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="title"
                  label="Title"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="title" />}
                  error={touched.title && !!errors.title}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <JoditEditor
                    value={values.description}
                    onChange={(content) => setFieldValue("description", content)}
                  />
                  <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
                </Box>
                <Field
                  as={TextField}
                  name="pageName"
                  label="Page Name"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="pageName" />}
                  error={touched.pageName && !!errors.pageName}
                />
                <FormControl fullWidth sx={{ mt: 2 }} error={touched.type && !!errors.type}>
                  <InputLabel>Type</InputLabel>
                  <Field
                    as={Select}
                    name="type"
                    label="Type"
                  >
                    <MenuItem value="container">Container</MenuItem>
                    <MenuItem value="shortDescription">Short Description</MenuItem>
                  </Field>
                  <ErrorMessage name="type" component="div" style={{ color: 'red' }} />
                </FormControl>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Page Images
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const files = Array.from(event.target.files || []);
                    const selectedImages = [...values.images, ...files];

                    if (selectedImages.length > 10) {
                      alert("You can upload a maximum of 10 images.");
                      return;
                    }

                    setFieldValue("images", selectedImages);
                  }}
                  style={{ marginTop: "10px", display: "block" }}
                  multiple
                />
                {values.images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Selected Images:</Typography>
                    {values.images.map((image, index) => (
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
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : image
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
                            setFieldValue(
                              "images",
                              values.images.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
                <ErrorMessage name="images" component="div" style={{ color: 'red' }} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
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
          <Typography>Are you sure you want to delete this page?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeletePage} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        fullWidth
        PaperProps={{ style: { maxWidth: "1000px" } }}
      >
        <DialogTitle>Preview Page</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewPage && (
            <>
            <Box sx={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
              <Typography variant="h6">Title: {previewPage.title}</Typography>
               <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Page Name: {previewPage.pageName}
              </Typography>
               <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Type: {previewPage.type}
              </Typography>
               <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Description:
              </Typography>
               <Divider sx={{ my: 2 }} />
              <div
                dangerouslySetInnerHTML={{ __html: previewPage.description }}
              />
               <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Images:
              </Typography>
              {previewPage.images && previewPage.images.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {previewPage.images.map((image, index) => (
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
                        src={image}
                        variant="rounded"
                        sx={{ width: 100, height: 70, borderRadius: 1 , cursor: "pointer"}}
                        onClick={() => handleImageClick(index)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1">No images available.</Typography>
              )}
              </Box>
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
          slides={lightboxImages.map(image => ({ src: image }))}
          index={lightboxIndex}
        />
      )}
    </Container>
  );
};

export default PageDetails;
