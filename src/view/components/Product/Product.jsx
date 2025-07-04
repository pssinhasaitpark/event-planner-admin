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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
  fetchProducts,
  fetchCategories,
  saveProduct,
  updateProduct,
  deleteProduct,
  saveCategory,
} from "../../redux/slice/productSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const productValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().required("Price is required"),
  stock: Yup.number().required("Stock is required"),
  category: Yup.string().required("Category is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const categoryValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const Product = () => {
  const dispatch = useDispatch();
  const {
    data: productData,
    categories,
    status: productStatus,
  } = useSelector((state) => state.products) || {
    data: [],
    categories: [],
    status: "idle",
  };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const imageUrl = import.meta.env.VITE_REACT_IMAGE_URL;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewProduct.images);
    setLightboxOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setSelectedProductId(product._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (product) => {
    setPreviewProduct(product);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productIdToDelete) {
      await dispatch(deleteProduct(productIdToDelete));
      dispatch(fetchProducts());
    }
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedProduct(null);
    setSelectedProductId(null);
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productData.slice(indexOfFirstItem, indexOfLastItem);

  if (productStatus === "loading" || showLoader) {
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

  if (productStatus === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {productStatus}
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
        Product Details
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setSelectedProduct(null);
          }}
          sx={{
            backgroundColor: "#121212",
            "&:hover": { backgroundColor: "#121212" },
            textTransform: "none",
            mr: 2,
          }}
        >
          Add New Product
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenCategoryModal(true);
          }}
          sx={{
            backgroundColor: "#121212",
            "&:hover": { backgroundColor: "#121212" },
            textTransform: "none",
          }}
        >
          Add New Category
        </Button>
      </Box>

      {productData && productData.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              height: "60vh", // Fixed height for the table container
              overflowY: "auto", // Enable vertical scrolling if content overflows
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Images
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell sx={{ width: "20%" }}>{product.name}</TableCell>
                    <TableCell sx={{ width: "40%" }}>
                      {product.description}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      {product.images && product.images.length > 0 && (
                        <Avatar
                          src={`${imageUrl}${product.images[0]}`}
                          variant="rounded"
                          sx={{ width: 100, height: 70, borderRadius: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(product)}
                          sx={{ border: 0, color: "#121212" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(product)}
                          sx={{ border: 0, color: "#121212" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(product._id)}
                          sx={{ border: 0, color: "#121212" }}
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
              count={Math.ceil(productData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              sx={{
                // backgroundColor: "#121212",
                borderRadius: "8px",
                padding: "4px 8px",
                "& .MuiPaginationItem-root": {
                  color: "#121212", // page number text color
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
          No products available. Please add a new product.
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
        <DialogTitle>
          {editMode ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <Formik
          initialValues={{
            name: selectedProduct?.name || "",
            description: selectedProduct?.description || "",
            price: selectedProduct?.price || "",
            stock: selectedProduct?.stock || "",
            category: selectedProduct?.category || "",
            images: selectedProduct?.images || [],
          }}
          enableReinitialize={true}
          validationSchema={productValidationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("stock", values.stock);
            formData.append("category", values.category);

            values.images.forEach((image) => {
              if (image instanceof File) {
                formData.append("images", image);
              } else if (typeof image === "string") {
                formData.append("existingImages", image);
              }
            });

            if (editMode) {
              await dispatch(
                updateProduct({
                  productId: selectedProductId,
                  data: formData,
                })
              );
            } else {
              await dispatch(saveProduct(formData));
            }

            resetForm();
            handleCloseModal();
            dispatch(fetchProducts());
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
                  name="description"
                  label="Description"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="description" />}
                  error={touched.description && !!errors.description}
                />
                <Field
                  as={TextField}
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="price" />}
                  error={touched.price && !!errors.price}
                />
                <Field
                  as={TextField}
                  name="stock"
                  label="Stock"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="stock" />}
                  error={touched.stock && !!errors.stock}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Field
                    name="category"
                    as={Select}
                    labelId="category-label"
                    label="Category"
                    error={touched.category && !!errors.category}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Images
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
                <ErrorMessage
                  name="images"
                  component="div"
                  style={{ color: "red" }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
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
        open={openCategoryModal}
        onClose={handleCloseCategoryModal}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>Add New Category</DialogTitle>
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          validationSchema={categoryValidationSchema}
          onSubmit={async (values, { resetForm }) => {
            const categoryData = {
              name: values.name,
              description: values.description,
            };

            await dispatch(saveCategory(categoryData));

            resetForm();
            handleCloseCategoryModal();
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
                  name="description"
                  label="Description"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="description" />}
                  error={touched.description && !!errors.description}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCategoryModal}
                  sx={{ color: "#121212" }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#121212",
                    "&:hover": { backgroundColor: "#121212" },
                    textTransform: "none",
                  }}
                >
                  Submit
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
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteProduct}
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
  <DialogTitle>Preview Product</DialogTitle>
  <DialogContent>
    {previewProduct && (
      <Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Name:</strong> {previewProduct.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Description:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {previewProduct.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Images:</strong>
        </Typography>
        {previewProduct.images && previewProduct.images.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {previewProduct.images.map((image, index) => (
              <Avatar
                key={index}
                src={`${imageUrl}${image}`}
                variant="rounded"
                sx={{
                  width: 100,
                  height: 70,
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No images available.</Typography>
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
          slides={lightboxImages.map((image) => ({ src: `${imageUrl}${image}` }))}
          index={lightboxIndex}
        />
      )}
    </Container>
  );
};

export default Product;
