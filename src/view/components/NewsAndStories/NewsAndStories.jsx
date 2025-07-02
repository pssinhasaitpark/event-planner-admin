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
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchNewsAndStories,
  saveNewsAndStory,
  updateNewsAndStory,
  deleteNewsAndStory,
} from "../../redux/slice/NewsAndStoriesSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  type: Yup.string().required("Type is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const NewsAndStories = () => {
  const dispatch = useDispatch();
  const { data: newsAndStoriesData, status } = useSelector(
    (state) => state.newsAndStories
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsIdToDelete, setNewsIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    images: [],
    type: "",
  });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewNews, setPreviewNews] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewNews.images);
    setLightboxOpen(true);
  };

  useEffect(() => {
    dispatch(fetchNewsAndStories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (newsId) => {
    setNewsIdToDelete(newsId);
    setDeleteDialogOpen(true);
  };

  const handlePreviewClick = (news) => {
    setPreviewNews(news);
    setPreviewDialogOpen(true);
  };

  const confirmDeleteNews = async () => {
    if (newsIdToDelete) {
      await dispatch(deleteNewsAndStory(newsIdToDelete));
      dispatch(fetchNewsAndStories());
    }
    setDeleteDialogOpen(false);
    setNewsIdToDelete(null);
  };

  const handleEditClick = (news) => {
    setInitialValues({
      title: news.title,
      content: news.content,
      images: news.images || [],
      type: news.type,
    });
    setSelectedNewsId(news._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsAndStoriesData.slice(
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

  if (status === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {status}
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
        News and Stories
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setInitialValues({
              title: "",
              content: "",
              images: [],
              type: "",
            });
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New News/Story
        </Button>
      </Box>

      {newsAndStoriesData && newsAndStoriesData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Content</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((news, index) => (
                  <TableRow key={news._id}>
                    <TableCell>{news.title}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: news.content
                            ? `${news.content.substring(0, 50)}...`
                            : "No content available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>{news.type}</TableCell>
                    <TableCell>
                      {news.images && news.images.length > 0 && (
                        <Avatar
                          src={news.images[0]}
                          variant="rounded"
                          sx={{
                            width: 100,
                            height: 70,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(news)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(news)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(news._id)}
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
              count={Math.ceil(newsAndStoriesData.length / itemsPerPage)}
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
          No news or stories available. Please add a new one.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>
          {editMode ? "Edit News/Story" : "Add New News/Story"}
        </DialogTitle>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("content", values.content);
            formData.append("type", values.type);
            values.images.forEach((image) => formData.append("images", image));

            if (editMode) {
              await dispatch(
                updateNewsAndStory({ newsId: selectedNewsId, data: formData })
              );
            } else {
              await dispatch(saveNewsAndStory(formData));
            }

            resetForm();
            setOpenModal(false);
            setEditMode(false);
            setSelectedNewsId(null);
            setInitialValues({
              title: "",
              content: "",
              images: [],
              type: "",
            });
            dispatch(fetchNewsAndStories());
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="title"
                  label="Title"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="title" />}
                  error={touched.title && !!errors.title}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
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
                <FormControl
                  fullWidth
                  sx={{ mt: 2 }}
                  error={touched.type && !!errors.type}
                >
                  <InputLabel>Type</InputLabel>
                  <Field as={Select} name="type" label="Type">
                    <MenuItem value="news">News</MenuItem>
                    <MenuItem value="story">Story</MenuItem>
                  </Field>
                  <ErrorMessage
                    name="type"
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
                    const files = event.target.files;
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
            Are you sure you want to delete this news/story?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteNews} color="error" variant="contained">
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
        <DialogTitle>Preview News/Story</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewNews && (
            <>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <Typography variant="h6">Title: {previewNews.title}</Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Content:</Typography>

                <div
                  dangerouslySetInnerHTML={{ __html: previewNews.content }}
                />
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">
                  Type: {previewNews.type}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Images:</Typography>

                {previewNews.images && previewNews.images.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {previewNews.images.map((image, index) => (
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
                  <Typography variant="h6">No images available.</Typography>
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

export default NewsAndStories;
