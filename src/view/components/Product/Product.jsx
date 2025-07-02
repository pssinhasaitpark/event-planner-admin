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
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
} from "../../redux/slice/productSlice";
import {
  fetchCategories,
  saveCategory,
} from "../../redux/slice/createCategorySlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  stock: Yup.number()
    .required("Stock is required")
    .integer("Stock must be an integer"),
  category: Yup.string().required("Category is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const ProductComponent = () => {
  const dispatch = useDispatch();
  const { data: productsData, status: productsStatus } = useSelector(
    (state) => state.products
  ) || { data: [], status: "idle" };
  const { data: categoriesData, status: categoriesStatus } = useSelector(
    (state) => state.createCategory
  ) || { data: [], status: "idle" };



  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewProduct.images || []);
    setLightboxOpen(true);
  };

  const handlePreviewClick = (product) => {
    setPreviewProduct(product);
    setPreviewDialogOpen(true);
  };

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

  const handleDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productIdToDelete) {
      await dispatch(deleteProduct(productIdToDelete));
      dispatch(fetchProducts());
    }
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handleEditClick = (product) => {
    setInitialValues({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category?._id || "",
      images: product.images || [],
    });
    setSelectedProductId(product._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddCategoryClick = () => {
    setOpenCategoryModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductsData = Array.isArray(productsData)
    ? productsData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  if (
    productsStatus === "loading" ||
    categoriesStatus === "loading" ||
    showLoader
  ) {
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

  if (productsStatus === "error" || categoriesStatus === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {productsStatus === "error" ? productsStatus : categoriesStatus}
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
        Products
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategoryClick}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
            mr: 2,
          }}
        >
          Add Category
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setInitialValues({
              name: "",
              description: "",
              price: "",
              stock: "",
              category: "",
              images: [],
            });
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Product
        </Button>
      </Box>

      {productsData && productsData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProductsData.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description
                            ? `${product.description.substring(0, 50)}...`
                            : "No description available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        <Avatar
                          src={product.images[0]}
                          variant="rounded"
                          sx={{
                            width: 100,
                            height: 70,
                            borderRadius: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(0)}
                        />
                      ) : (
                        <Typography variant="body2">No images</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(product)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(product)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(product._id)}
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
              count={Math.ceil(productsData.length / itemsPerPage)}
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
          No products available. Please add a new product.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ style: { maxWidth: "1000px", maxHeight: "90vh" } }}
      >
        <DialogTitle>
          {editMode ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("stock", values.stock);
            formData.append("category", values.category);

            if (values.images && values.images.length > 0) {
              values.images.forEach((image) => {
                formData.append("images", image);
              });
            }

            try {
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
              setOpenModal(false);
              setEditMode(false);
              setSelectedProductId(null);
              dispatch(fetchProducts());
            } catch (error) {
              console.error("Error saving product:", error);
            }
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto" }}>
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
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    helperText={<ErrorMessage name="description" />}
                    error={touched.description && !!errors.description}
                  />
                </Box>
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
                    as={Select}
                    labelId="category-label"
                    name="category"
                    label="Category"
                    error={touched.category && !!errors.category}
                  >
                    {categoriesData.map((category) => (
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
                    const files = Array.from(event.target.files);
                    setFieldValue("images", files);
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
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
      >
        <DialogTitle>Add New Category</DialogTitle>
        <Formik
          initialValues={{ name: "", description: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            description: Yup.string().required("Description is required"),
          })}
          onSubmit={async (values, { resetForm }) => {
            try {
              await dispatch(saveCategory(values));
              resetForm();
              setOpenCategoryModal(false);
              dispatch(fetchCategories());
            } catch (error) {
              console.error("Error saving category:", error);
            }
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
                <Button onClick={() => setOpenCategoryModal(false)}>
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
        maxWidth="lg"
        PaperProps={{ style: { maxWidth: "1000px", maxHeight: "90vh" } }}
      >
        <DialogTitle>Preview Product</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewProduct && (
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "4px",
              }}
            >
              <Typography variant="h6">Name: {previewProduct.name}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Description:</Typography>
              <div
                style={{ fontSize: "18px" }}
                dangerouslySetInnerHTML={{ __html: previewProduct.description }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Price: {previewProduct.price}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Stock: {previewProduct.stock}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6">Images:</Typography>
                {previewProduct.images && previewProduct.images.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {previewProduct.images.map((image, index) => (
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

export default ProductComponent;
