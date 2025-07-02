import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlideshowLightbox } from "lightbox.js-react";
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../../redux/slice/bookSlice";
import JoditEditor from "jodit-react";
import {
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Close,
  Image as ImageIcon,
} from "@mui/icons-material";

function BookList() {
  const dispatch = useDispatch();
  const { books = [], loading } = useSelector((state) => state.booklist);
  const [removeImages, setRemoveImages] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showLoader, setShowLoader] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    images: [],
    cover_image: null,
  });
  const editorRef = useRef(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchBooks());
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const handleAddNew = () => {
    setEditingBook(null);
    setFormData({
      id: null,
      title: "",
      description: "",
      images: [],
      cover_image: null,
    });
    setPreviewImage(null);
    setRemoveImages([]); // Reset removeImages
    setIsFormOpen(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book.id);
    setFormData(book);
    setPreviewImage(book.cover_image);
    setRemoveImages([]); // Reset removeImages
    setIsFormOpen(true);
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteConfirm = (id) => {
    setBookToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (bookToDelete) {
      try {
        await dispatch(deleteBook(bookToDelete)).unwrap();
        setDeleteDialogOpen(false);
        setBookToDelete(null);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("book_title", formData.title);
    formDataToSend.append("description", formData.description);

    if (formData.cover_image instanceof File) {
      formDataToSend.append("cover_image", formData.cover_image);
    }

    const existingImages = formData.images.filter(
      (img) => typeof img === "string"
    );
    const newImages = formData.images.filter((img) => img instanceof File);

    formDataToSend.append("existingImages", JSON.stringify(existingImages));

    newImages.forEach((image) => {
      formDataToSend.append("images", image);
    });

    if (removeImages.length > 0) {
      formDataToSend.append("remove_image", JSON.stringify(removeImages));
    }

    try {
      if (editingBook) {
        await dispatch(
          updateBook({ id: editingBook, updatedData: formDataToSend })
        ).unwrap();
      } else {
        await dispatch(addBook(formDataToSend)).unwrap();
      }

      setIsFormOpen(false);
      await dispatch(fetchBooks());
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData({ ...formData, cover_image: file });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      const imageToRemove = updatedImages[index];
      updatedImages.splice(index, 1);

      if (typeof imageToRemove === "string") {
        setRemoveImages((prevRemoveImages) => [
          ...prevRemoveImages,
          imageToRemove,
        ]);
      }

      return { ...prev, images: updatedImages };
    });
  };
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

  return (
    <Box>
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            align="left"
            gutterBottom
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Manage Books
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
            startIcon={<Add />}
            onClick={handleAddNew}
          >
            Add New Book
          </Button>
        </Box>

        {books.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              No books available
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold", width: "120px" }}>
                      Title
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold", width: "120px" }}>
                      Book Image
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold", width: "120px" }}>
                      Description
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold", width: "120px" }}>
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>
                        {book.cover_image && book.cover_image.length > 0 ? (
                          <SlideshowLightbox>
                            <img
                              src={book.cover_image}
                              alt="Book"
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                          </SlideshowLightbox>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No Image
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: expandedDescription[book._id]
                              ? book.description
                              : book.description
                              ? `${book.description.substring(0, 50)}...`
                              : "No description available.",
                          }}
                        />
                        <Button
                          onClick={() => toggleDescription(book._id)}
                          sx={{ textTransform: "none", ml: 1 }}
                        >
                          {expandedDescription[book._id]
                            ? "Read Less"
                            : "Read More"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(book)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteConfirm(book.id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="center" width="100%" mt={2}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={books.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </TableContainer>
        )}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this book?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingBook ? "Edit Book" : "Add New Book"}
          <IconButton
            onClick={() => setIsFormOpen(false)}
            size="small"
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Book Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Description:
          </Typography>
          <JoditEditor
            ref={editorRef}
            value={formData.description}
            onChange={(content) => {
              setFormData((prev) => ({ ...prev, description: content }));
            }}
          />
          <Typography variant="subtitle1">Cover Image:</Typography>
          <Button
            component="label"
            variant="contained"
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
            startIcon={<ImageIcon />}
          >
            Select Cover Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleCoverImageChange}
            />
          </Button>

          {(previewImage || formData.cover_image) && (
            <Box mt={2}>
              <img
                src={
                  previewImage ||
                  (formData.cover_image instanceof File
                    ? URL.createObjectURL(formData.cover_image)
                    : formData.cover_image)
                }
                alt="Cover Preview"
                width="100"
                height="100"
              />
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Upload Images:</Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<ImageIcon />}
              sx={{
                backgroundColor: "#e0752d",
                "&:hover": { backgroundColor: "#F68633" },
                textTransform: "none",
              }}
            >
              Select Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
              {formData.images.map((image, index) => (
                <Box
                  key={`${image}-${index}`}
                  sx={{ position: "relative", width: 80, height: 80 }}
                >
                  <SlideshowLightbox>
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt={`book-img-${index}`}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                  </SlideshowLightbox>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      background: "rgba(255,255,255,0.8)",
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookList;
