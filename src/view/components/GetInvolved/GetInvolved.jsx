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
  fetchGetInvolved,
  saveGetInvolved,
  updateGetInvolved,
  deleteGetInvolved,
} from "../../redux/slice/getInvolvedSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  type: Yup.string().required("Type is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const GetInvolved = () => {
  const dispatch = useDispatch();
  const { data: getInvolvedData, status } = useSelector(
    (state) => state.getInvolved
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);
  const [currentGetInvolved, setCurrentGetInvolved] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGetInvolvedId, setSelectedGetInvolvedId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [getInvolvedIdToDelete, setGetInvolvedIdToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewGetInvolved, setPreviewGetInvolved] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewGetInvolved.images);
    setLightboxOpen(true);
  };

  useEffect(() => {
    dispatch(fetchGetInvolved());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (getInvolvedId) => {
    setGetInvolvedIdToDelete(getInvolvedId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (getInvolved) => {
    setPreviewGetInvolved(getInvolved);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteGetInvolved = async () => {
    if (getInvolvedIdToDelete) {
      await dispatch(deleteGetInvolved(getInvolvedIdToDelete));
      dispatch(fetchGetInvolved());
    }
    setDeleteDialogOpen(false);
    setGetInvolvedIdToDelete(null);
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

  const paginatedGetInvolvedData = getInvolvedData.slice(
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
        Get Involved
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
          Add New Get Involved
        </Button>
      </Box>

      {getInvolvedData && getInvolvedData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedGetInvolvedData.map((getInvolved, index) => (
                  <TableRow key={getInvolved._id}>
                    <TableCell>{getInvolved.name}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getInvolved.description
                            ? `${getInvolved.description.substring(0, 50)}...`
                            : "No description available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>{getInvolved.type}</TableCell>
                    <TableCell>
                      {getInvolved.images && getInvolved.images.length > 0 && (
                        <Avatar
                          src={getInvolved.images[0]}
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
                          onClick={() => handlePreviewClick(getInvolved)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const itemToEdit = getInvolvedData.find(
                              (item) => item._id === getInvolved._id
                            );
                            setCurrentGetInvolved(itemToEdit);
                            setOpenModal(true);
                            setEditMode(true);
                            setSelectedGetInvolvedId(getInvolved._id);
                          }}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(getInvolved._id)}
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
              count={Math.ceil(getInvolvedData.length / rowsPerPage)}
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
          No get involved details available. Please add a new one.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setCurrentGetInvolved(null);
        }}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>
          {editMode ? "Edit Get Involved" : "Add New Get Involved"}
        </DialogTitle>
        <Formik
          initialValues={
            editMode && currentGetInvolved
              ? {
                  name: currentGetInvolved.name || "",
                  description: currentGetInvolved.description || "",
                  type: currentGetInvolved.type || "",
                  images: currentGetInvolved.images || [],
                }
              : {
                  name: "",
                  description: "",
                  type: "",
                  images: [],
                }
          }
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("type", values.type);

            // Append only new files (not URLs)
            values.images.forEach((image) => {
              if (image instanceof File) {
                formData.append("images", image);
              }
            });

            if (editMode) {
              await dispatch(
                updateGetInvolved({
                  getInvolvedId: selectedGetInvolvedId,
                  data: formData,
                })
              );
            } else {
              await dispatch(saveGetInvolved(formData));
            }

            resetForm();
            setOpenModal(false);
            setEditMode(false);
            setCurrentGetInvolved(null);
            setSelectedGetInvolvedId(null);
            dispatch(fetchGetInvolved());
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="name" />}
                  error={touched.name && !!errors.name}
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
                <FormControl
                  fullWidth
                  sx={{ mt: 2 }}
                  error={touched.type && !!errors.type}
                >
                  <InputLabel>Type</InputLabel>
                  <Field as={Select} name="type" label="Type">
                    <MenuItem value="Seva_Karyakarta">Seva Karyakarta</MenuItem>
                    <MenuItem value="Honorary_Seva_Karyakarta">
                      Honorary Seva Karyakarta
                    </MenuItem>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Get Involved Images
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
                            typeof image === "string"
                              ? image
                              : URL.createObjectURL(image)
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
                <Button
                  onClick={() => {
                    setOpenModal(false);
                    setCurrentGetInvolved(null);
                  }}
                >
                  Cancel
                </Button>
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
          <Typography>
            Are you sure you want to delete this get involved detail?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteGetInvolved}
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
        <DialogTitle>Preview Get Involved</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewGetInvolved && (
            <>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <Typography variant="h6">
                  Name: {previewGetInvolved.name}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box  alignItems="center">
                  <Typography variant="h6" sx={{ marginRight: 1 }}>
                    Description:
                  </Typography>
                  <div
                    style={{ fontSize: "18px" }}
                    dangerouslySetInnerHTML={{
                      __html: previewGetInvolved.description,
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  Type: {previewGetInvolved.type}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ pt: 2 }}>
                  <Typography variant="h6">Images:</Typography>
                  {previewGetInvolved.images &&
                  previewGetInvolved.images.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                      {previewGetInvolved.images.map((image, index) => (
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
                    <Typography variant="body1">
                      No images available.
                    </Typography>
                  )}
                </Box>
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

export default GetInvolved;
