import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProgrammesByCategory,
  updateProgramme,
  updateSection,
  deleteProgrammeDetail,
} from "../../redux/slice/ourProgrammesSlice";
import {
  MenuItem,
  Select,
  FormControl,
  Typography,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardMedia,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { SlideshowLightbox } from "lightbox.js-react";

const categories = [
  "Education",
  "Healthcare",
  "Livelihood",
  "Girl Child & Women Empowerment",
  "Privileged Children",
  "Civic Driven Change",
  "Social Entrepreneurship",
  "Special Support ourProgramme",
  "Special Interventions",
];

function OurProgrammes() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [openModal, setOpenModal] = useState(false);
  const [newProgramme, setNewProgramme] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailIdToDelete, setDetailIdToDelete] = useState(null);

  const dispatch = useDispatch();
  const {
    items: programmes,
    loading,
    error,
  } = useSelector((state) => state.programmes);

  useEffect(() => {
    dispatch(fetchProgrammesByCategory(selectedCategory));
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress sx={{ color: "#F68633" }} />
      </Box>
    );

  // if (error)
  //   return (
  //     <Typography variant="h6" color="error">
  //       Error: {error}
  //     </Typography>
  //   );

  const handleAddProgramme = async () => {
    if (!newProgramme.title || !newProgramme.description) {
      return alert("Please fill all fields!");
    }

    const formData = new FormData();
    formData.append("details[0][title]", newProgramme.title);
    formData.append("details[0][description]", newProgramme.description);
    if (newProgramme.image) formData.append("detailImages", newProgramme.image);

    await dispatch(updateProgramme({ category: selectedCategory, formData }));

    // Re-fetch data for the currently selected category
    dispatch(fetchProgrammesByCategory(selectedCategory));
    resetForm();
  };

  const handleEditProgramme = async () => {
    if (!newProgramme.title || !newProgramme.description) {
      return alert("Please fill all fields!");
    }

    const formData = new FormData();
    formData.append("title", newProgramme.title);
    formData.append("description", newProgramme.description);

    if (newProgramme.image) {
      formData.append("detailImages", newProgramme.image);
    }

    if (imagesToRemove.length > 0) {
      formData.append("removeImages", JSON.stringify(imagesToRemove));
    }

    await dispatch(
      updateSection({
        category: selectedCategory,
        id: selectedDetailId,
        formData,
      })
    );
    // Re-fetch updated category data
    dispatch(fetchProgrammesByCategory(selectedCategory));
    resetForm();
  };

  const resetForm = () => {
    setNewProgramme({ title: "", description: "", image: null });
    setOpenModal(false);
    setEditMode(false);
    setSelectedDetailId(null);
    setImagesToRemove([]);
    setExistingImages([]);
    setBannerPreview(null);
  };

  const handleBannerUpload = async () => {
    if (!banner) return alert("Please select a banner image to upload");
    const formData = new FormData();
    formData.append("banner", banner);

    await dispatch(updateProgramme({ category: selectedCategory, formData }));
    setBanner(null);
    setBannerPreview(null);
  };

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (detail) => {
    setNewProgramme({
      title: detail.title,
      description: detail.description,
      image: null,
    });
    setSelectedDetailId(detail._id);
    setEditMode(true);
    setOpenModal(true);
    setImagesToRemove([]);
    setExistingImages(detail.images.map((img) => img.url));
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemoveImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));

    setImagesToRemove((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((url) => url !== imageUrl);
      }
      return [...prev, imageUrl];
    });
  };

  const handleDeleteDetail = (detailId) => {
    setDetailIdToDelete(detailId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDetail = async () => {
    await dispatch(
      deleteProgrammeDetail({
        category: selectedCategory,
        detailId: detailIdToDelete,
      })
    );
    dispatch(fetchProgrammesByCategory(selectedCategory));
    setDeleteDialogOpen(false);
    setDetailIdToDelete(null);
  };

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
        Our Programmes
      </Typography>

      <FormControl sx={{ mb: 4, width: "25%" }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Select Category:
        </Typography>
        <Select
          value={selectedCategory}
          onChange={(e) => {
            const newCategory = e.target.value;
            setSelectedCategory(newCategory);
            dispatch(fetchProgrammesByCategory(newCategory));
          }}
        >
          {categories?.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress />}
      {/* {error && <Typography color="error">Error: {error}</Typography>} */}

      {!loading &&
        !error &&
        Array.isArray(programmes) &&
        programmes.length === 0 && (
          <Typography variant="h6" color="textSecondary">
            No data available for this category.
          </Typography>
        )}

      {Array.isArray(programmes) && programmes.length > 0 && (
        <>
          {bannerPreview ? (
            <CardMedia
              component="img"
              height="300"
              image={bannerPreview}
              alt="Selected Banner"
              sx={{ mb: 2, borderRadius: 2 }}
            />
          ) : (
            programmes[0]?.banner && (
              <CardMedia
                component="img"
                height="300"
                image={programmes[0].banner}
                alt="Banner"
                sx={{ mb: 2, borderRadius: 2 }}
              />
            )
          )}
        </>
      )}

      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          sx={{
            backgroundColor: "#e0752d",
            "&:hover": { backgroundColor: "#F68633" },
            textTransform: "none",
          }}
        >
          Choose File
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleBannerChange}
          />
        </Button>

        <Button
          variant="contained"
          onClick={handleBannerUpload}
          sx={{
            backgroundColor: "#e0752d",
            "&:hover": { backgroundColor: "#F68633" },
            textTransform: "none",
          }}
        >
          Upload Banner
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
          }}
          sx={{
            backgroundColor: "#e0752d",
            "&:hover": { backgroundColor: "#F68633" },
            textTransform: "none",
          }}
        >
          Add Section
        </Button>
      </Box>

      {Array.isArray(programmes) && programmes.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programmes[0]?.details?.map((detail) => (
                <TableRow key={detail._id}>
                  <TableCell>{detail.title}</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: expandedDescription[detail._id]
                          ? detail.description
                          : `${detail.description.substring(0, 50)}...`,
                      }}
                    />
                    <Button
                      onClick={() => toggleDescription(detail._id)}
                      sx={{ textTransform: "none", ml: 1 }}
                    >
                      {expandedDescription[detail._id]
                        ? "Read Less"
                        : "Read More"}
                    </Button>
                  </TableCell>

                  <TableCell>
                    {detail.images?.map((img) => (
                      <div
                        key={img._id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <SlideshowLightbox>
                          <img
                            src={img.url}
                            alt="Programme"
                            width="100"
                            style={{ marginRight: "5px", borderRadius: "5px" }}
                          />
                        </SlideshowLightbox>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditClick(detail)}
                      sx={{ border: 0 }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeleteDetail(detail._id)}
                      sx={{ ml: 1, border: 0 }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openModal}
        onClose={resetForm}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>
          {editMode ? "Edit Programme" : "Add New Programme"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            sx={{ mt: 2 }}
            value={newProgramme.title}
            onChange={(e) =>
              setNewProgramme({ ...newProgramme, title: e.target.value })
            }
          />
          <JoditEditor
            value={newProgramme.description}
            onChange={(content) =>
              setNewProgramme({ ...newProgramme, description: content })
            }
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Upload Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProgramme({ ...newProgramme, image: e.target.files[0] })
            }
            style={{ marginTop: "10px", display: "block" }} // Added display block for better layout
          />
          {editMode && existingImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Existing Images:</Typography>
              {existingImages.map((imgUrl) => (
                <div
                  key={imgUrl}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <SlideshowLightbox>
                    <img
                      src={imgUrl}
                      alt="Existing Programme"
                      width="100"
                      style={{ marginRight: "5px", borderRadius: "5px" }}
                    />
                  </SlideshowLightbox>
                  <Button
                    variant="outlined"
                    onClick={() => handleRemoveImage(imgUrl)}
                    sx={{ border: 0 }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </Button>
                </div>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            onClick={editMode ? handleEditProgramme : handleAddProgramme}
            variant="contained"
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
          >
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this programme?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteDetail}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OurProgrammes;
