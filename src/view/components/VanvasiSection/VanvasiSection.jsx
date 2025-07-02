import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
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
  CircularProgress,
  Box,
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
import JoditEditor from "jodit-react";
import {
  fetchVanvasiPosts,
  addVanvasiPost,
  updateVanvasiPost,
  deleteVanvasiPost,
} from "../../redux/slice/vanvasiSectionSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const VanvasiSection = () => {
  const dispatch = useDispatch();
  const vanvasiData = useSelector((state) => state.vanvasi?.data) || [];
  const status = useSelector((state) => state.vanvasi?.status);

  const [openModal, setOpenModal] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "",
    images: [],
  });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchVanvasiPosts());
  }, [dispatch]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!newPost.title.trim()) newErrors.title = "Title is required.";
    if (!newPost.category.trim()) newErrors.category = "Category is required.";
    if (!newPost.description.trim())
      newErrors.description = "Description is required.";
    const totalImages = newPost.images.length + existingImages.length;
    if (totalImages !== 2) newErrors.images = "Exactly 2 images are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPost = async () => {
    if (!validateFields()) return;
    try {
      await dispatch(addVanvasiPost({ ...newPost }));
      resetForm();
      dispatch(fetchVanvasiPosts());
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleEditClick = (post) => {
    setNewPost({
      title: post.title,
      description: post.description,
      category: post.category,
      images: [],
    });
    setSelectedPostId(post._id);
    setEditMode(true);
    setOpenModal(true);
    setExistingImages(post.images || []);
    setErrors({});
  };

  const handleDeleteClick = (postId) => {
    setPostIdToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (postIdToDelete) {
      await dispatch(deleteVanvasiPost(postIdToDelete));
      dispatch(fetchVanvasiPosts());
    }
    setDeleteDialogOpen(false);
    setPostIdToDelete(null);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setNewPost({ title: "", description: "", category: "", images: [] });
    setExistingImages([]);
    setOpenModal(false);
    setEditMode(false);
    setSelectedPostId(null);
    setErrors({});
  };

  const handleUpdatePost = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    formData.append("category", newPost.category);

    newPost.images.forEach((image) => {
      formData.append("images", image);
    });

    existingImages.forEach((image) => {
      formData.append("existingImages", image);
    });

    try {
      await dispatch(
        updateVanvasiPost({ id: selectedPostId, postData: formData })
      );
      resetForm();
      dispatch(fetchVanvasiPosts());
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total = files.length + newPost.images.length + existingImages.length;
    if (total > 2) {
      setErrors((prev) => ({
        ...prev,
        images: "Only 2 images allowed in total.",
      }));
      return;
    }
    setNewPost({ ...newPost, images: [...newPost.images, ...files] });
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handlePreviewClick = (post) => {
    setPreviewPost(post);
    setPreviewDialogOpen(true);
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewPost.images);
    setLightboxOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Vanvasi Kalyan Trust Posts
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setOpenModal(true);
          setEditMode(false);
        }}
        sx={{
          mb: 2,
          backgroundColor: "#023e8a",
          "&:hover": { backgroundColor: "#023e8a" },
          marginLeft: "auto",
          display: "flex",
        }}
      >
        Add New Post
      </Button>

      {status === "loading" ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vanvasiData.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: post.description
                          ? `${post.description.substring(0, 50)}...`
                          : "No description available.",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {Array.isArray(post.images) && post.images.length > 0 ? (
                      post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Preview-${index}`}
                          style={{ width: 50, height: 50, marginRight: 10 }}
                        />
                      ))
                    ) : (
                      <span>No Images</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewClick(post)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(post)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(post._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openModal} onClose={resetForm}>
        <DialogTitle>{editMode ? "Edit Post" : "Add New Post"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            error={!!errors.title}
            helperText={errors.title}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <JoditEditor
              value={newPost.description}
              onChange={(content) =>
                setNewPost({ ...newPost, description: content })
              }
            />
            {errors.description && (
              <Typography color="error" variant="caption">
                {errors.description}
              </Typography>
            )}
          </Box>

          <TextField
            label="Category"
            fullWidth
            margin="normal"
            value={newPost.category}
            onChange={(e) =>
              setNewPost({
                ...newPost,
                category: capitalizeFirstLetter(e.target.value),
              })
            }
            error={!!errors.category}
            helperText={errors.category}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Existing Images:</Typography>
            {existingImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  display: "inline-block",
                  position: "relative",
                  marginRight: 1,
                }}
              >
                <img
                  src={image}
                  alt="Existing"
                  style={{ width: 100, height: 100 }}
                />
                <Button
                  onClick={() => handleRemoveExistingImage(index)}
                  sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
                >
                  X
                </Button>
              </Box>
            ))}

            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              New Images:
            </Typography>
            {newPost.images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt="New"
                style={{ width: 100, height: 100, marginRight: 8 }}
              />
            ))}

            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
            />
            {errors.images && (
              <Typography color="error" variant="caption">
                {errors.images}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={resetForm} color="primary">
            Cancel
          </Button>
          <Button
            onClick={editMode ? handleUpdatePost : handleAddPost}
            color="primary"
            variant="contained"
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmDeletePost}
            color="error"
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>Preview Post</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewPost && (
            <>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <Typography variant="h6">Title: {previewPost.title}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  Category: {previewPost.category}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Description:</Typography>
                <div
                  dangerouslySetInnerHTML={{ __html: previewPost.description }}
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Images:</Typography>
                {previewPost.images && previewPost.images.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {previewPost.images.map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          mt: 1,
                          mr: 2,
                        }}
                      >
                        <img
                          src={image}
                          alt={`Preview-${index}`}
                          style={{ width: 100, height: 100, cursor: "pointer" }}
                          onClick={() => handleImageClick(index)}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1">No images available.</Typography>
                )}
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

export default VanvasiSection;
