import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
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
  Pagination,
  IconButton,
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
  fetchSubCategory,
  saveSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../../redux/slice/SubCategorySlice";
import { fetchCategories } from "../../redux/slice/ProjectsSlice";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
});

const SubCategory = () => {
  const dispatch = useDispatch();
  const { data: subCategoryData = [], status } = useSelector(
    (state) => state.subCategory || { data: [], status: "idle" }
  );
  const { categories = [] } = useSelector((state) => state.projects || {});

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [editInitialValues, setEditInitialValues] = useState({
    name: "",
    category: "",
    description: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryIdToDelete, setSubCategoryIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewSubCategory, setPreviewSubCategory] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchSubCategory());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedSubCategoryId(null);
    setEditInitialValues({
      name: "",
      category: "",
      description: "",
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      name: values.name,
      category: values.category,
      description: values.description,
    };

    if (editMode) {
      await dispatch(
        updateSubCategory({
          subCategoryId: selectedSubCategoryId,
          data: payload,
        })
      );
    } else {
      await dispatch(saveSubCategory(payload));
    }

    resetForm();
    setOpenModal(false);
    dispatch(fetchSubCategory());
  };

  const handlePreviewClick = (subCategory) => {
    setPreviewSubCategory(subCategory);
    setPreviewDialogOpen(true);
  };

  const handleEditClick = (subCategory) => {
    setSelectedSubCategoryId(subCategory._id);
    setEditInitialValues({
      name: subCategory.name || "",
      category: subCategory.category || "",
      description: subCategory.description || "",
    });
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (id) => {
    setSubCategoryIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSubCategory = async () => {
    if (subCategoryIdToDelete) {
      await dispatch(deleteSubCategory(subCategoryIdToDelete));
      dispatch(fetchSubCategory());
    }
    setDeleteDialogOpen(false);
    setSubCategoryIdToDelete(null);
  };

  const handlePageChange = (_, page) => setCurrentPage(page);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSubCategories = subCategoryData.slice(indexOfFirst, indexOfLast);

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
  if (status === "error") {
    return (
      <Typography variant="h6" color="error">
        Error loading subcategories.
      </Typography>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        "@media (min-width: 600px)": {
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        },
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        SubCategory
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New SubCategory
        </Button>
      </Box>

      {subCategoryData.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Category Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSubCategories.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell>{sub.name}</TableCell>
                    <TableCell>{sub.categoryName}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sub.description
                            ? `${sub.description.substring(0, 50)}...`
                            : "No description available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handlePreviewClick(sub)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditClick(sub)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(sub._id)}>
                          <DeleteIcon color="error" fontSize="small" />
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
              count={Math.ceil(subCategoryData.length / itemsPerPage)}
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
          No subcategories available. Please add a new subcategory.
        </Typography>
      )}

      {/* Add / Edit Modal */}
      <Dialog open={openModal} onClose={resetForm} fullWidth maxWidth="md">
        <DialogTitle>
          {editMode ? "Edit SubCategory" : "Add New SubCategory"}
        </DialogTitle>
        <Formik
          initialValues={
            editMode
              ? editInitialValues
              : {
                  name: "",
                  category: "",
                  description: "",
                }
          }
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  label="Name"
                  name="name"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={
                    <ErrorMessage
                      name="name"
                      component="div"
                      style={{ color: "red" }}
                    />
                  }
                  error={!!(values.name === "" && editMode)}
                />

                <Field
                  as={TextField}
                  label="Category"
                  name="category"
                  fullWidth
                  select
                  sx={{ mt: 2 }}
                  helperText={
                    <ErrorMessage
                      name="category"
                      component="div"
                      style={{ color: "red" }}
                    />
                  }
                  error={!!(values.category === "" && editMode)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.category}
                    </MenuItem>
                  ))}
                </Field>

                <Field
                  as={TextField}
                  label="Description"
                  name="description"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={
                    <ErrorMessage
                      name="description"
                      component="div"
                      style={{ color: "red" }}
                    />
                  }
                  error={!!(values.description === "" && editMode)}
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


      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this subcategory?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteSubCategory}
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
        maxWidth="md"
      >
        <DialogTitle>Preview SubCategory</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewSubCategory && (
            <>
             <Box sx={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
              <Typography variant="h6">Name: {previewSubCategory.name}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Category: {previewSubCategory.categoryName}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Description:
              </Typography>
              <Divider sx={{ my: 2 }} />
              <div
                dangerouslySetInnerHTML={{ __html: previewSubCategory.description }}
              />
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

export default SubCategory;
