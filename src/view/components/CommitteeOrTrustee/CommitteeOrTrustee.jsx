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
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchCommitteeOrTrustee,
  saveCommitteeOrTrustee,
  updateCommitteeOrTrustee,
  deleteCommitteeOrTrustee,
} from "../../redux/slice/CommitteeOrTrusteeSlice";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  position: Yup.string().required("Position is required"),
  type: Yup.string().required("Type is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const CommitteeOrTrustee = () => {
  const dispatch = useDispatch();
  const { data: committeeData, status } = useSelector(
    (state) => state.committeeOrTrustee
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(null);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [committeeIdToDelete, setCommitteeIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewCommittee, setPreviewCommittee] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewCommittee.profileImage);
    setLightboxOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCommitteeOrTrustee());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (committee) => {
    setSelectedCommittee(committee);
    setSelectedCommitteeId(committee._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (committeeId) => {
    setCommitteeIdToDelete(committeeId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (committee) => {
    setPreviewCommittee(committee);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteCommittee = async () => {
    if (committeeIdToDelete) {
      await dispatch(deleteCommitteeOrTrustee(committeeIdToDelete));
      dispatch(fetchCommitteeOrTrustee());
    }
    setDeleteDialogOpen(false);
    setCommitteeIdToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedCommittee(null);
    setSelectedCommitteeId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommittees = committeeData.slice(
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
        Committee or Trustee Details
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setSelectedCommittee(null);
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Committee
        </Button>
      </Box>

      {committeeData && committeeData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Profile Image
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCommittees.map((committee) => (
                  <TableRow key={committee._id}>
                    <TableCell>{committee.name}</TableCell>
                    <TableCell>{committee.position}</TableCell>
                    <TableCell>{committee.type}</TableCell>
                    <TableCell>
                      {committee.profileImage &&
                        committee.profileImage.length > 0 && (
                          <Avatar
                            src={committee.profileImage[0]}
                            variant="rounded"
                            sx={{ width: 100, height: 70, borderRadius: 1 }}
                          />
                        )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(committee)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(committee)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(committee._id)}
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
              count={Math.ceil(committeeData.length / itemsPerPage)}
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
          No committees available. Please add a new committee.
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
        <DialogTitle>{editMode ? "Edit Committee" : "Add New Committee"}</DialogTitle>
        <Formik
          initialValues={{
            name: selectedCommittee?.name || "",
            position: selectedCommittee?.position || "",
            type: selectedCommittee?.type || "",
            images: selectedCommittee?.profileImage || [],
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("position", values.position);
            formData.append("type", values.type);

            // Handle both existing images (URLs) and new file uploads
            values.images.forEach((image) => {
              if (image instanceof File) {
                formData.append("images", image);
              } else if (typeof image === "string") {
                formData.append("existingImages", image);
              }
            });

            if (editMode) {
              await dispatch(
                updateCommitteeOrTrustee({
                  committeeId: selectedCommitteeId,
                  data: formData,
                })
              );
            } else {
              await dispatch(saveCommitteeOrTrustee(formData));
            }

            resetForm();
            handleCloseModal();
            dispatch(fetchCommitteeOrTrustee());
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
                <Field
                  as={TextField}
                  name="position"
                  label="Position"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="position" />}
                  error={touched.position && !!errors.position}
                />
                <Field
                  as={TextField}
                  name="type"
                  label="Type"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="type" />}
                  error={touched.type && !!errors.type}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Profile Images
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
          <Typography>
            Are you sure you want to delete this committee?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteCommittee} color="error" variant="contained">
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
        <DialogTitle>Preview Committee</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewCommittee && (
            <Box sx={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
              <Typography variant="h6">Name: {previewCommittee.name}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Position: {previewCommittee.position}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Type: {previewCommittee.type}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Profile Image:
              </Typography>
              {previewCommittee.profileImage &&
                previewCommittee.profileImage.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {previewCommittee.profileImage.map((image, index) => (
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
                        sx={{ width: 100, height: 70, borderRadius: 1, cursor: "pointer" }}
                        onClick={() => handleImageClick(index)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1">No profile image available.</Typography>
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
          slides={lightboxImages.map((image) => ({ src: image }))}
          index={lightboxIndex}
        />
      )}
    </Container>
  );
};

export default CommitteeOrTrustee;
