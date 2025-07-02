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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchAwards,
  saveAward,
  updateAward,
  deleteAward,
} from "../../redux/slice/awardsSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const Awards = () => {
  const dispatch = useDispatch();
  const { data: awardsData, status } = useSelector((state) => state.awards) || {
    data: [],
    status: "idle",
  };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAwardId, setSelectedAwardId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [awardIdToDelete, setAwardIdToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewAward, setPreviewAward] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewAward.images);
    setLightboxOpen(true);
  };

  useEffect(() => {
    dispatch(fetchAwards());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (awardId) => {
    setAwardIdToDelete(awardId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (award) => {
    setPreviewAward(award);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteAward = async () => {
    if (awardIdToDelete) {
      await dispatch(deleteAward(awardIdToDelete));
      dispatch(fetchAwards());
    }
    setDeleteDialogOpen(false);
    setAwardIdToDelete(null);
  };

  const handleEditClick = (award) => {
    setInitialValues({
      title: award.title,
      description: award.description,
      images: award.images || [],
    });
    setSelectedAwardId(award._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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

  const paginatedAwards = awardsData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
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
        Awards
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setInitialValues({
              title: "",
              description: "",
              images: [],
            });
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Award
        </Button>
      </Box>

      {awardsData && awardsData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAwards.map((award, index) => (
                  <TableRow key={award._id}>
                    <TableCell>{award.title}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: award.description
                            ? `${award.description.substring(0, 50)}...`
                            : "No description available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {award.images && award.images.length > 0 && (
                        <Avatar
                          src={award.images[0]}
                          variant="rounded"
                          sx={{
                            width: 100,
                            height: 70,
                            borderRadius: 1,
                            // cursor: "pointer",
                          }}
                          // onClick={() => handleImageClick(index)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(award)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(award)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(award._id)}
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
              count={Math.ceil(awardsData.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
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
          No awards available. Please add a new award.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>{editMode ? "Edit Award" : "Add New Award"}</DialogTitle>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            values.images.forEach((image) => formData.append("images", image));

            if (editMode) {
              await dispatch(
                updateAward({ awardId: selectedAwardId, data: formData })
              );
            } else {
              await dispatch(saveAward(formData));
            }

            resetForm();
            setOpenModal(false);
            setEditMode(false);
            setSelectedAwardId(null);
            setInitialValues({
              title: "",
              description: "",
              images: [],
            });
            dispatch(fetchAwards());
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
                    onChange={(content) =>
                      setFieldValue("description", content)
                    }
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Award Images
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const files = event.target.files;
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
                <ErrorMessage
                  name="images"
                  component="div"
                  style={{ color: "red" }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
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
          <Typography>Are you sure you want to delete this award?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteAward}
            color="error"
            variant="contained"
          >
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
        <DialogTitle>Preview Award</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewAward && (
            <>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <Typography variant="h6">
                  Title: {previewAward.title}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box >
                  <Typography variant="h6" sx={{ marginRight: 1 }}>
                    Description:
                  </Typography>
                  <div
                    style={{ display: "inline", fontSize: "16px" }}
                    dangerouslySetInnerHTML={{
                      __html: previewAward.description,
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Images:</Typography>

                {previewAward.images && previewAward.images.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {previewAward.images.map((image, index) => (
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
                          sx={{
                            width: 100,
                            height: 70,
                            borderRadius: 1,
                            cursor: "pointer",
                          }}
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
          slides={lightboxImages.map((image) => ({ src: image }))}
          index={lightboxIndex}
        />
      )}
    </Container>
  );
};

export default Awards;
