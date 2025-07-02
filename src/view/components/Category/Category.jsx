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
  fetchCategory,
  saveCategoryToBackend,
  updateCategory,
  deleteCategory,
} from "../../redux/slice/CategorySlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  shortDescription: Yup.string().required("Description is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const Category = () => {
  const dispatch = useDispatch();
  const categoryData = useSelector((state) => state.category.data) || [];
  const status = useSelector((state) => state.category.status);
  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewCategory, setPreviewCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [initialFormValues, setInitialFormValues] = useState({
    category: "",
    shortDescription: "",
    images: [],
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editMode && selectedCategoryId) {
      const selected = categoryData.find(
        (item) => item._id === selectedCategoryId
      );
      if (selected) {
        setInitialFormValues({
          category: selected.category || "",
          shortDescription: selected.shortDescription || "",
          images: Array.isArray(selected.images) ? selected.images : [],
        });
      } else {
        setInitialFormValues({
          category: "",
          shortDescription: "",
          images: [],
        });
      }
    } else {
      setInitialFormValues({
        category: "",
        shortDescription: "",
        images: [],
      });
    }
  }, [editMode, selectedCategoryId, categoryData]);

  const handleCategoryUpload = async (values, { resetForm }) => {
    const formData = new FormData();
    if (values.category) formData.append("category", values.category);
    if (values.shortDescription)
      formData.append("shortDescription", values.shortDescription);
    values.images.forEach((image) => formData.append("images", image));
  
    try {
      if (editMode) {
        console.log("Updating category with ID:", selectedCategoryId); // Add this line
        await dispatch(
          updateCategory({ id: selectedCategoryId, data: formData })
        );
      } else {
        await dispatch(saveCategoryToBackend(formData));
      }
      resetForm();
      setOpenModal(false);
      dispatch(fetchCategory());
    } catch (error) {
      console.error("Error saving/updating category:", error);
    }
  };
  

  const handleEditClick = (category) => {
    setSelectedCategoryId(category._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryIdToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (category) => {
    setPreviewCategory(category);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryIdToDelete) {
      await dispatch(deleteCategory(categoryIdToDelete));
      dispatch(fetchCategory());
    }
    setDeleteDialogOpen(false);
    setCategoryIdToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewCategory.images);
    setLightboxOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categoryData.slice(
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
        Categories
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditMode(false);
            setSelectedCategoryId(null);
            setOpenModal(true);
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Category
        </Button>
      </Box>

      {categoryData && categoryData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.category}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: category.shortDescription
                            ? `${category.shortDescription.substring(0, 50)}...`
                            : "No description available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {category.images && category.images.length > 0 && (
                        <Avatar
                          src={category.images[0]}
                          variant="rounded"
                          sx={{ width: 100, height: 70, borderRadius: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handlePreviewClick(category)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(category._id)}
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
              count={Math.ceil(categoryData.length / itemsPerPage)}
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
          No Category available. Please add a new Category.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        PaperProps={{ style: { maxWidth: "1000px" } }}
      >
        <DialogTitle>
          {editMode ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <Formik
          initialValues={initialFormValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleCategoryUpload}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  label="Category"
                  name="category"
                  fullWidth
                  sx={{ mt: 2 }}
                  error={!!values.category}
                  helperText={<ErrorMessage name="category" />}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <JoditEditor
                    value={values.shortDescription}
                    onChange={(content) =>
                      setFieldValue("shortDescription", content)
                    }
                  />
                  <ErrorMessage
                    name="shortDescription"
                    component={Typography}
                    color="error"
                  />
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Category Images
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    setFieldValue("images", [...values.images, ...files]);
                  }}
                  style={{ marginTop: "10px", display: "block" }}
                />
                <ErrorMessage
                  name="images"
                  component={Typography}
                  color="error"
                />
                {values.images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Selected Images:</Typography>
                    {Array.isArray(values.images) &&
                      values.images.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1">
                            Selected Images:
                          </Typography>
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
                  </Box>
                )}
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
          <Typography>
            Are you sure you want to delete this category?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteCategory}
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
        <DialogTitle>Preview Category</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewCategory && (
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "4px",
              }}
            >
              <Typography variant="h6">
                Category: {previewCategory.category}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">shortDescription:</Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: previewCategory.shortDescription,
                }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Images:</Typography>
              {Array.isArray(previewCategory.images) &&
              previewCategory.images.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {previewCategory.images.map((image, index) => (
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

export default Category;
