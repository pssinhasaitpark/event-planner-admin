import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
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
  fetchContactDetails,
  addContactDetail,
  updateContactDetail,
  deleteContactDetail,
} from "../../redux/slice/contactDetailsSlice";


import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';


const validationSchema = Yup.object({
  phone_no: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  location: Yup.string().required("Location is required"),
});

const ContactDetails = () => {
  const dispatch = useDispatch();
  const contactDetailsData =
    useSelector((state) => state.contactDetails.data) || [];
  const status = useSelector((state) => state.contactDetails.status);
  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
const [lightboxIndex, setLightboxIndex] = useState(0);

const handleImageClick = (index) => {
  setLightboxIndex(index);
  setLightboxOpen(true);
};

  const [initialValues, setInitialValues] = useState({
    phone_no: "",
    email: "",
    location: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactIdToDelete, setContactIdToDelete] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewContact, setPreviewContact] = useState(null);

  useEffect(() => {
    dispatch(fetchContactDetails());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (contactId) => {
    setContactIdToDelete(contactId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (contact) => {
    setPreviewContact(contact);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (contactIdToDelete) {
      await dispatch(deleteContactDetail(contactIdToDelete));
      dispatch(fetchContactDetails());
    }
    setDeleteDialogOpen(false);
    setContactIdToDelete(null);
  };

  const handleEditClick = (contact) => {
    setInitialValues({
      phone_no: contact.phone_no,
      email: contact.email,
      location: contact.location,
    });
    setSelectedContactId(contact._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const resetForm = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedContactId(null);
    setInitialValues({
      phone_no: "",
      email: "",
      location: "",
    });
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
        Contact Details
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setInitialValues({
              phone_no: "",
              email: "",
              location: "",
            });
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Contact
        </Button>
      </Box>

      {contactDetailsData && contactDetailsData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactDetailsData.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.phone_no}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.location}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(contact)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(contact)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(contact._id)}
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
        </>
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ my: 4, textAlign: "center" }}
        >
          No contact details available. Please add a new contact.
        </Typography>
      )}

      <Dialog open={openModal} onClose={resetForm} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? "Edit Contact" : "Add New Contact"}</DialogTitle>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            if (editMode) {
              await dispatch(
                updateContactDetail({
                  id: selectedContactId,
                  contactData: values,
                })
              );
            } else {
              await dispatch(addContactDetail(values));
            }
            resetForm();
            setOpenModal(false);
            setEditMode(false);
            setSelectedContactId(null);
            dispatch(fetchContactDetails());
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="phone_no"
                  label="Phone"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="phone_no" />}
                  error={touched.phone_no && !!errors.phone_no}
                />
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="email" />}
                  error={touched.email && !!errors.email}
                />
                <Field
                  as={TextField}
                  name="location"
                  label="Location"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="location" />}
                  error={touched.location && !!errors.location}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={resetForm}>Cancel</Button>
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this contact?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteContact} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Preview Contact Details</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewContact && (
            <>
            <Box sx={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
              <Typography variant="h6">Phone: {previewContact.phone_no}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Email: {previewContact.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Location: {previewContact.location}
              </Typography>
              <Divider sx={{ my: 2 }} />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
     
    </Container>
  );
};

export default ContactDetails;
