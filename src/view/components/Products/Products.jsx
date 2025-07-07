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
  fetchRegistrationAndCertificates,
  saveRegistrationAndCertificates,
  updateRegistrationAndCertificates,
  deleteRegistrationAndCertificates,
} from "../../redux/slice/RegistrationAndCertificatesSlice";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const validationSchema = Yup.object({
  status: Yup.string().required("Status is required"),
  trustRegNumberAndDate: Yup.string().required("Trust Reg Number and Date is required"),
  reg12A: Yup.string().required("Reg 12A is required"),
  reg80G: Yup.string().required("Reg 80G is required"),
  pan: Yup.string().required("PAN is required"),
  tds: Yup.string().required("TDS is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const RegistrationAndCertificates = () => {
  const dispatch = useDispatch();
  const { data: registrationData, status } = useSelector(
    (state) => state.registrationAndCertificates
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registrationIdToDelete, setRegistrationIdToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewRegistration, setPreviewRegistration] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewRegistration.certificateImages);
    setLightboxOpen(true);
  };

  useEffect(() => {
    dispatch(fetchRegistrationAndCertificates());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (registrationId) => {
    setRegistrationIdToDelete(registrationId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (registration) => {
    setPreviewRegistration(registration);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteRegistration = async () => {
    if (registrationIdToDelete) {
      await dispatch(deleteRegistrationAndCertificates(registrationIdToDelete));
      dispatch(fetchRegistrationAndCertificates());
    }
    setDeleteDialogOpen(false);
    setRegistrationIdToDelete(null);
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

  const paginatedRegistrationData = registrationData.slice(
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
        Registration and Certificates
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setCurrentRegistration(null);
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Registration
        </Button>
      </Box>

      {registrationData && registrationData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Trust Reg Number and Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reg 12A</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reg 80G</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>PAN</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>TDS</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Certificate Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRegistrationData.map((registration, index) => (
                  <TableRow key={registration._id}>
                    <TableCell>{registration.status}</TableCell>
                    <TableCell>{registration.trustRegNumberAndDate}</TableCell>
                    <TableCell>{registration.reg12A}</TableCell>
                    <TableCell>{registration.reg80G}</TableCell>
                    <TableCell>{registration.pan}</TableCell>
                    <TableCell>{registration.tds}</TableCell>
                    <TableCell>
                      {registration.certificateImages && registration.certificateImages.length > 0 && (
                        <Avatar
                          src={registration.certificateImages[0]}
                          variant="rounded"
                          sx={{ width: 100, height: 70, borderRadius: 1 }}
                          // onClick={() => handleImageClick(index)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(registration)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const itemToEdit = registrationData.find(
                              (item) => item._id === registration._id
                            );
                            setCurrentRegistration(itemToEdit);
                            setOpenModal(true);
                            setEditMode(true);
                            setSelectedRegistrationId(registration._id);
                          }}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(registration._id)}
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
              count={Math.ceil(registrationData.length / rowsPerPage)}
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
          No registrations available. Please add a new registration.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setCurrentRegistration(null);
        }}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>
          {editMode ? "Edit Registration" : "Add New Registration"}
        </DialogTitle>
        <Formik
          initialValues={
            editMode && currentRegistration
              ? {
                  status: currentRegistration.status || "",
                  trustRegNumberAndDate: currentRegistration.trustRegNumberAndDate || "",
                  reg12A: currentRegistration.reg12A || "",
                  reg80G: currentRegistration.reg80G || "",
                  pan: currentRegistration.pan || "",
                  tds: currentRegistration.tds || "",
                  images: currentRegistration.certificateImages || [],
                }
              : {
                  status: "",
                  trustRegNumberAndDate: "",
                  reg12A: "",
                  reg80G: "",
                  pan: "",
                  tds: "",
                  images: [],
                }
          }
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("status", values.status);
            formData.append("trustRegNumberAndDate", values.trustRegNumberAndDate);
            formData.append("reg12A", values.reg12A);
            formData.append("reg80G", values.reg80G);
            formData.append("pan", values.pan);
            formData.append("tds", values.tds);

            // Append only new files (not URLs)
            values.images.forEach((image) => {
              if (image instanceof File) {
                formData.append("images", image);
              }
            });

            if (editMode) {
              await dispatch(
                updateRegistrationAndCertificates({
                  registrationId: selectedRegistrationId,
                  data: formData,
                })
              );
            } else {
              await dispatch(saveRegistrationAndCertificates(formData));
            }

            resetForm();
            setOpenModal(false);
            setEditMode(false);
            setCurrentRegistration(null);
            setSelectedRegistrationId(null);
            dispatch(fetchRegistrationAndCertificates());
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="status"
                  label="Status"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="status" />}
                  error={touched.status && !!errors.status}
                />
                <Field
                  as={TextField}
                  name="trustRegNumberAndDate"
                  label="Trust Reg Number and Date"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="trustRegNumberAndDate" />}
                  error={touched.trustRegNumberAndDate && !!errors.trustRegNumberAndDate}
                />
                <Field
                  as={TextField}
                  name="reg12A"
                  label="Reg 12A"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="reg12A" />}
                  error={touched.reg12A && !!errors.reg12A}
                />
                <Field
                  as={TextField}
                  name="reg80G"
                  label="Reg 80G"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="reg80G" />}
                  error={touched.reg80G && !!errors.reg80G}
                />
                <Field
                  as={TextField}
                  name="pan"
                  label="PAN"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="pan" />}
                  error={touched.pan && !!errors.pan}
                />
                <Field
                  as={TextField}
                  name="tds"
                  label="TDS"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="tds" />}
                  error={touched.tds && !!errors.tds}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Certificate Images
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
                    setCurrentRegistration(null);
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
        <DialogContent >
          <Typography>
            Are you sure you want to delete this registration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteRegistration}
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
        <DialogTitle>Preview Registration</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewRegistration && (
            <>
             <Box sx={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
              
                <Typography variant="h6">Status: {previewRegistration.status}</Typography>
                 <Divider sx={{ my: 2 }} />
          
             
                <Typography variant="h6">Trust Reg Number and Date: {previewRegistration.trustRegNumberAndDate}</Typography>
                 <Divider sx={{ my: 2 }} />
    
             
                <Typography variant="h6">Reg 12A: {previewRegistration.reg12A}</Typography>
    
               <Divider sx={{ my: 2 }} />
             
                <Typography variant="h6">Reg 80G: {previewRegistration.reg80G}</Typography>
                <Divider sx={{ my: 2 }} />
         
              
                <Typography variant="h6">PAN: {previewRegistration.pan}</Typography>
              
               <Divider sx={{ my: 2 }} />
              
                <Typography variant="h6">TDS: {previewRegistration.tds}</Typography>
          
               <Divider sx={{ my: 2 }} />
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6">Certificate Images:</Typography>
                {previewRegistration.certificateImages && previewRegistration.certificateImages.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {previewRegistration.certificateImages.map((image, index) => (
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
                  <Typography variant="body1">No certificate images available.</Typography>
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

export default RegistrationAndCertificates;
