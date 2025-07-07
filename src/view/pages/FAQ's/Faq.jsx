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
  Pagination,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchFaqs,
  saveFaq,
  updateFaq,
  deleteFaq,
} from "../../redux/slice/faqSlice";

const validationSchema = Yup.object({
  question: Yup.string().required("Question is required"),
  answer: Yup.string().required("Answer is required"),
});

const FAQ = () => {
  const dispatch = useDispatch();
  const { data: faqsData, status: faqsStatus } = useSelector(
    (state) => state.faqs
  ) || { data: [], status: "idle" };
  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqIdToDelete, setFaqIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [initialValues, setInitialValues] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (faqId) => {
    setFaqIdToDelete(faqId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFaq = async () => {
    if (faqIdToDelete) {
      await dispatch(deleteFaq(faqIdToDelete));
      dispatch(fetchFaqs());
    }
    setDeleteDialogOpen(false);
    setFaqIdToDelete(null);
  };

  const handleEditClick = (faq) => {
    setInitialValues({
      question: faq.question || "",
      answer: faq.answer || "",
    });
    setSelectedFaqId(faq._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaqsData = faqsData.slice(indexOfFirstItem, indexOfLastItem);

  if (faqsStatus === "loading" || showLoader) {
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

  if (faqsStatus === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {faqsStatus}
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
        FAQs
      </Typography>
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setInitialValues({
              question: "",
              answer: "",
            });
          }}
          sx={{
            backgroundColor: "#121212",
            "&:hover": { backgroundColor: "#121212" },
            textTransform: "none",
          }}
        >
          Add New FAQ
        </Button>
      </Box>
      {faqsData && faqsData.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              height: "60vh",
              overflowY: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                    Question
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                    Answer
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentFaqsData.map((faq) => (
                  <TableRow key={faq._id}>
                    <TableCell sx={{ width: "40%" }}>{faq.question}</TableCell>
                    <TableCell sx={{ width: "40%" }}>{faq.answer}</TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handleEditClick(faq)}
                          sx={{ border: 0, color: "#121212" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(faq._id)}
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
              count={Math.ceil(faqsData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              sx={{
                borderRadius: "8px",
                padding: "4px 8px",
                "& .MuiPaginationItem-root": {
                  color: "#121212",
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
          No FAQs available. Please add a new FAQ.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: { maxWidth: "800px", maxHeight: "80vh" },
        }}
      >
        <DialogTitle>{editMode ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (editMode) {
                await dispatch(
                  updateFaq({ faqId: selectedFaqId, data: values })
                );
              } else {
                await dispatch(saveFaq(values));
              }
              resetForm();
              setOpenModal(false);
              setEditMode(false);
              setSelectedFaqId(null);
              dispatch(fetchFaqs());
            } catch (error) {
              console.error("Error saving FAQ:", error);
            }
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent sx={{ maxHeight: "60vh", overflowY: "auto" }}>
                <Field
                  as={TextField}
                  name="question"
                  label="Question"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="question" />}
                  error={touched.question && !!errors.question}
                />
                <Field
                  as={TextField}
                  name="answer"
                  label="Answer"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="answer" />}
                  error={touched.answer && !!errors.answer}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#121212",
                    "&:hover": { backgroundColor: "#121212" },
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
          <Typography>Are you sure you want to delete this FAQ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteFaq} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FAQ;
