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
  Divider,
  DialogContent,
  DialogTitle,
  Container,
  MenuItem,
  Pagination,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  saveProject,
  updateProject,
  deleteProject,
  fetchCategories,
  fetchSubcategories,
} from "../../redux/slice/ProjectsSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Project name is required"),
  description: Yup.string().required("Description is required"),
  type: Yup.string().required("Project type is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
});

const Projects = () => {
  const dispatch = useDispatch();
  const { data: projectsData, status } = useSelector(
    (state) => state.projects
  ) || { data: [], status: "idle" };
  const { categories: categoriesData, subcategories: subcategoriesData } =
    useSelector((state) => state.projects) || {
      categories: [],
      subcategories: [],
    };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [images, setImages] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(5); 
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewProject.images);
    setLightboxOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      type: "",
      category: "",
      subcategory: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => formData.append(key, val));
      images.forEach((img) => formData.append("images", img));

      try {
        if (editMode && selectedProjectId) {
          await dispatch(
            updateProject({ projectId: selectedProjectId, data: formData })
          );
        } else {
          await dispatch(saveProject(formData));
        }
        resetForm();
        setImages([]);
        setOpenModal(false);
        setEditMode(false);
        setSelectedProjectId(null);
        dispatch(fetchProjects());
      } catch (error) {
        console.error("Error submitting project:", error);
      }
    },
  });

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (project) => {
    const category = project.category || {};
    const subcategory = project.subcategory || {};
    formik.setValues({
      name: project.name,
      description: project.description,
      type: project.type,
      category: category._id || "",
      subcategory: subcategory._id || "",
    });

    setImages(project.images || []);
    setSelectedProjectId(project._id);
    setEditMode(true);
    setOpenModal(true);
    if (category._id) dispatch(fetchSubcategories(category._id));
  };

  const handleDeleteClick = (projectId) => {
    setProjectIdToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (project) => {
    setPreviewProject(project);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (projectIdToDelete) {
      await dispatch(deleteProject(projectIdToDelete));
      dispatch(fetchProjects());
    }
    setDeleteDialogOpen(false);
    setProjectIdToDelete(null);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const selectedImages = [...images, ...files];
    if (selectedImages.length > 10) {
      alert("You can upload up to 10 images");
      return;
    }
    setImages(selectedImages);
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    formik.setFieldValue("category", selected);
    formik.setFieldValue("subcategory", "");
    dispatch(fetchSubcategories(selected));
  };

  const resetForm = () => {
    formik.resetForm();
    setImages([]);
    setOpenModal(false);
    setEditMode(false);
    setSelectedProjectId(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projectsData.slice(indexOfFirstItem, indexOfLastItem);

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
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Projects
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ backgroundColor: "#023e8a", textTransform: "none" }}
        >
          Add New Project
        </Button>
      </Box>

      {/* Project Table */}
      {projectsData?.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subcategory</TableCell>
                  <TableCell>Images</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((project) => {
                  const categoryName =
                    categoriesData.find((cat) => cat._id === project.categoryId)
                      ?.category || "N/A";
                  const subcategoryName =
                    subcategoriesData.find(
                      (sub) => sub._id === project.subcategoryId
                    )?.name || "N/A";

                  return (
                    <TableRow key={project._id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: project.description?.slice(0, 50) + "...",
                          }}
                        />
                      </TableCell>
                      <TableCell>{project.type}</TableCell>
                      <TableCell>{categoryName}</TableCell>
                      <TableCell>{subcategoryName}</TableCell>
                      <TableCell>
                        {project.images?.[0] && (
                          <Avatar
                            src={project.images[0]}
                            variant="rounded"
                            sx={{ width: 100, height: 70 }}

                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <IconButton
                            onClick={() => handlePreviewClick(project)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEditClick(project)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(project._id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil(projectsData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography textAlign="center" sx={{ mt: 4 }}>
          No projects available.
        </Typography>
      )}

      <Dialog open={openModal} onClose={resetForm} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? "Edit Project" : "Add Project"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <JoditEditor
                value={formik.values.description}
                onChange={(value) => formik.setFieldValue("description", value)}
              />
              {formik.touched.description && formik.errors.description && (
                <Typography color="error" variant="caption">
                  {formik.errors.description}
                </Typography>
              )}
            </Box>
            <TextField
              label="Type"
              fullWidth
              margin="normal"
              {...formik.getFieldProps("type")}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            />
            <TextField
              select
              label="Category"
              fullWidth
              margin="normal"
              value={formik.values.category}
              onChange={handleCategoryChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            >
              {categoriesData.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Subcategory"
              fullWidth
              margin="normal"
              value={formik.values.subcategory}
              onChange={(e) =>
                formik.setFieldValue("subcategory", e.target.value)
              }
              disabled={!formik.values.category}
              error={
                formik.touched.subcategory && Boolean(formik.errors.subcategory)
              }
              helperText={
                formik.touched.subcategory && formik.errors.subcategory
              }
            >
              {subcategoriesData.map((subcat) => (
                <MenuItem key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="body1" sx={{ mt: 2 }}>
              Upload Images
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ marginTop: 10 }}
            />
            <Box sx={{ mt: 2 }}>
              {images.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "inline-block", position: "relative", mr: 2 }}
                >
                  <Avatar
                    src={img instanceof File ? URL.createObjectURL(img) : img}
                    variant="rounded"
                    sx={{ width: 100, height: 70 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: "white",
                    }}
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== idx))
                    }
                  >
                    <DeleteIcon color="error" fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm}>Cancel</Button>
            <Button
              variant="contained"
              type="submit"
              sx={{ backgroundColor: "#023e8a" }}
            >
              {editMode ? "Update Project" : "Add Project"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteProject}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Preview Project</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewProject && (
            <>
              <Box sx={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
                <Typography variant="h6">Name: {previewProject.name}</Typography>

                <Divider sx={{ my: 2 }} />
 
              
         

<Box display="flex" alignItems="center">
  <Typography variant="h6" sx={{ marginRight: 1 }}>
    Description:
  </Typography>
  <div
    dangerouslySetInnerHTML={{ __html: previewProject.description }}
    style={{ display: 'inline', fontSize: '18px' }}
  />
</Box>

                <Divider sx={{ my: 2 }} />
             
             
                <Typography variant="h6">Type: {previewProject.type}</Typography>
             
              <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  Category:{" "}
                  {categoriesData.find(
                    (cat) => cat._id === previewProject.categoryId
                  )?.category || "N/A"}
                </Typography>
             <Divider sx={{ my: 2 }} />
              
                <Typography variant="h6">
                  Subcategory:{" "}
                  {subcategoriesData.find(
                    (sub) => sub._id === previewProject.subcategoryId
                  )?.name || "N/A"}
                </Typography>
                <Divider sx={{ my: 2 }} />
             
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6">Images:</Typography>
                {previewProject.images && previewProject.images.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {previewProject.images.map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "inline-block",
                          position: "relative",
                          mr: 2,
                        }}
                      >
                        <Avatar
                          src={image}
                          variant="rounded"
                          sx={{ width: 100, height: 70, cursor: "pointer" }}
                          onClick={() => handleImageClick(index)}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="h6">No images available.</Typography>
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

export default Projects;
