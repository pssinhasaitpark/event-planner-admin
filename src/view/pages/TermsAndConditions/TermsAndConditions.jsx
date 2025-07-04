import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
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
  Tabs,
  Tab,
  Pagination,
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
import JoditEditor from "jodit-react";
import {
  fetchPolicyDetails,
  savePolicyDetails,
  updatePolicyDetails,
  deletePolicyDetails,
} from "../../redux/slice/policySlice";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const validationSchema = Yup.object({
  type: Yup.string().required("Type is required"),
  content: Yup.string().required("Content is required"),
});

const truncateText = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const TermsAndConditions = () => {
  const dispatch = useDispatch();
  const { data: policyDetailsData, status } = useSelector(
    (state) => state.policy
  ) || { data: [], status: "idle" };
  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedPolicyForView, setSelectedPolicyForView] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyIdToDelete, setPolicyIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedType, setSelectedType] = useState("about");

  useEffect(() => {
    dispatch(fetchPolicyDetails(selectedType));
  }, [dispatch, selectedType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewClick = (policy) => {
    setSelectedPolicyForView(policy);
    setOpenViewModal(true);
  };

  const handleEditClick = (policy) => {
    setSelectedPolicy(policy);
    setSelectedPolicyId(policy._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (policyId) => {
    setPolicyIdToDelete(policyId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePolicy = async () => {
    if (policyIdToDelete) {
      await dispatch(deletePolicyDetails(policyIdToDelete));
      dispatch(fetchPolicyDetails(selectedType));
    }
    setDeleteDialogOpen(false);
    setPolicyIdToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedPolicy(null);
    setSelectedPolicyId(null);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedPolicyForView(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedType(newValue);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPolicies = Array.isArray(policyDetailsData)
    ? policyDetailsData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

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
      maxWidth="lg"
      sx={{
        padding: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Terms and Conditions
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Tabs value={selectedType} onChange={handleTabChange} centered>
          <Tab label="Privacy Policy" value="privacy" />
          <Tab label="About Us" value="about" />
          <Tab label="Terms and Conditions" value="terms" />
        </Tabs>
      </Box>
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setSelectedPolicy(null);
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Policy
        </Button>
      </Box>
      {currentPolicies.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", width: "33%", padding: 2 }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", width: "33%", padding: 2 }}
                  >
                    Content
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", width: "33%", padding: 2 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPolicies.map((policy) => (
                  <TableRow
                    key={policy._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ width: "33%", padding: 2 }}>
                      {policy.type}
                    </TableCell>
                    <TableCell sx={{ width: "33%", padding: 2 }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: truncateText(policy.content, 50),
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: "33%", padding: 2 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          onClick={() => handleViewClick(policy)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(policy)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(policy._id)}
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
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Pagination
              count={Math.ceil(policyDetailsData.length / itemsPerPage)}
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
          No policies available. Please add a new policy.
        </Typography>
      )}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px", padding: 20 },
        }}
      >
        <DialogTitle sx={{ padding: 3 }}>
          {editMode ? "Edit Policy" : "Add New Policy"}
        </DialogTitle>
        <Formik
          initialValues={{
            type: selectedPolicy?.type || selectedType,
            content: selectedPolicy?.content || "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            if (editMode) {
              await dispatch(
                updatePolicyDetails({
                  policyId: selectedPolicyId,
                  data: values,
                })
              );
            } else {
              await dispatch(savePolicyDetails(values));
            }
            resetForm();
            handleCloseModal();
            dispatch(fetchPolicyDetails(selectedType));
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent sx={{ padding: 3 }}>
                <FormControl
                  fullWidth
                  sx={{ mt: 2 }}
                  error={touched.type && !!errors.type}
                >
                  <InputLabel>Type</InputLabel>
                  <Field as={Select} name="type" label="Type">
                    <MenuItem value="privacy">Privacy Policy</MenuItem>
                    <MenuItem value="about">About Us</MenuItem>
                    <MenuItem value="terms">Terms and Conditions</MenuItem>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Content
                  </Typography>
                  <JoditEditor
                    value={values.content}
                    onChange={(content) => setFieldValue("content", content)}
                  />
                  <ErrorMessage
                    name="content"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ padding: 3 }}>
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
        sx={{ padding: 3 }}
      >
        <DialogTitle sx={{ padding: 3 }}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Typography>Are you sure you want to delete this policy?</Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeletePolicy}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
        fullWidth
        maxWidth="md"
        sx={{ padding: 2 }}
      >
        <DialogTitle sx={{ padding: 2 }}>View Policy</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <Box sx={{ padding: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Type:</strong> {selectedPolicyForView?.type}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              Content:
            </Typography>
            <Box
              sx={{
                padding: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                backgroundColor: "#fafafa",
                marginTop: 1,
              }}
            >
              <Typography
                component="div"
                sx={{ padding: 1 }}
                dangerouslySetInnerHTML={{
                  __html: selectedPolicyForView?.content,
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleCloseViewModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TermsAndConditions;
