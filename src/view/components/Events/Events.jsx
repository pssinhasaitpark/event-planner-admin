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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  fetchEvents,
  saveEvent,
  updateEvent,
  deleteEvent,
} from "../../redux/slice/eventSlice";
import { fetchArtists } from "../../redux/slice/artistSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  eventDate: Yup.string().required("Event Date is required"),
  eventTime: Yup.string().required("Event Time is required"),
  duration: Yup.string().required("Duration is required"),
  locationAddress: Yup.string().required("Location Address is required"),
  locationGmapLink: Yup.string().required("Google Maps Link is required"),
  ageLimitTicketsNeededFor: Yup.string().required(
    "Age Limit for Tickets is required"
  ),
  ageLimitEntryAllowedFor: Yup.string().required(
    "Age Limit for Entry is required"
  ),
  layout: Yup.string().required("Layout is required"),
  seating: Yup.string().required("Seating is required"),
  instructions: Yup.string().required("Instructions are required"),
  images: Yup.array().min(1, "At least one image is required"),
  gallery: Yup.array().min(1, "At least one gallery image is required"),
  artists: Yup.array().min(1, "At least one artist is required"),
  ticketCategories: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
      perks: Yup.array().of(Yup.string().required("Perk is required")),
      totalQuantity: Yup.number()
        .required("Total Quantity is required")
        .positive("Total Quantity must be positive"),
    })
  ),
});

const Events = () => {
  const dispatch = useDispatch();
  const { data: eventsData, status: eventsStatus } = useSelector(
    (state) => state.events
  ) || { data: [], status: "idle" };
  const { data: artistsData, status: artistsStatus } = useSelector(
    (state) => state.artist
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const imageUrl = import.meta.env.VITE_REACT_IMAGE_URL;
  const [previewEvents, setPreviewEvents] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    duration: "",
    locationAddress: "",
    locationGmapLink: "",
    ageLimitTicketsNeededFor: "",
    ageLimitEntryAllowedFor: "",
    layout: "",
    seating: "",
    kidFriendly: false,
    petFriendly: false,
    instructions: "",
    images: [],
    gallery: [],
    artists: [],
    ticketCategories: [],
    prohibitedItems: [],
    faq: [],
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxImages(previewEvents.images || []);
    setLightboxOpen(true);
  };

  const handlePreviewClick = (event) => {
    setPreviewEvents(event);
    setPreviewDialogOpen(true);
  };

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchArtists());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (eventId) => {
    setEventIdToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (eventIdToDelete) {
      await dispatch(deleteEvent(eventIdToDelete));
      dispatch(fetchEvents());
    }
    setDeleteDialogOpen(false);
    setEventIdToDelete(null);
  };

  const handleEditClick = (event) => {
    setInitialValues({
      title: event.title || "",
      description: event.description || "",
      eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
      eventTime: event.eventTime || "",
      duration: event.duration || "",
      locationAddress: event.location?.address || "",
      locationGmapLink: event.location?.gmapLink || "",
      ageLimitTicketsNeededFor: event.ageLimit?.ticketsNeededFor || "",
      ageLimitEntryAllowedFor: event.ageLimit?.entryAllowedFor || "",
      layout: event.layout || "",
      seating: event.seating || "",
      kidFriendly: event.kidFriendly || false,
      petFriendly: event.petFriendly || false,
      instructions: event.instructions || "",
      images: event.banner ? [event.banner] : [],
      gallery: event.gallery || [],
      artists: event.artists || [],
      ticketCategories: event.ticketCategories || [],
      prohibitedItems: event.prohibitedItems || [],
      faq: event.faq || [],
    });
    setSelectedEventId(event._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEventsData = eventsData.slice(indexOfFirstItem, indexOfLastItem);

  if (eventsStatus === "loading" || artistsStatus === "loading" || showLoader) {
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

  if (eventsStatus === "error" || artistsStatus === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {eventsStatus === "error" ? eventsStatus : artistsStatus}
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
        Events
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
              description: "",
              eventDate: "",
              eventTime: "",
              duration: "",
              locationAddress: "",
              locationGmapLink: "",
              ageLimitTicketsNeededFor: "",
              ageLimitEntryAllowedFor: "",
              layout: "",
              seating: "",
              kidFriendly: false,
              petFriendly: false,
              instructions: "",
              images: [],
              gallery: [],
              artists: [],
              ticketCategories: [],
              prohibitedItems: [],
              faq: [],
            });
          }}
          sx={{
            backgroundColor: "#023e8a",
            "&:hover": { backgroundColor: "#023e8a" },
            textTransform: "none",
          }}
        >
          Add New Event
        </Button>
      </Box>

      {eventsData && eventsData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Banner</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentEventsData.map((event, index) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: event.description
                            ? `${event.description.substring(0, 50)}...`
                            : "No description available.",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {event.banner ? (
                        <Avatar
                          src={`(${imageUrl}${event.banner})`}
                          // `url(${imageUrl}${event.banner})`
                          variant="rounded"
                          sx={{
                            width: 100,
                            height: 70,
                            borderRadius: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(index)}
                        />
                      ) : (
                        <Typography variant="body2">No banner</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handlePreviewClick(event)}
                          sx={{ border: 0 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(event)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(event._id)}
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
              count={Math.ceil(eventsData.length / itemsPerPage)}
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
          No events available. Please add a new event.
        </Typography>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: { maxWidth: "1000px", maxHeight: "90vh" },
        }}
      >
        <DialogTitle>{editMode ? "Edit Event" : "Add New Event"}</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("eventDate", values.eventDate);
            formData.append("eventTime", values.eventTime);
            formData.append("duration", values.duration);
            formData.append("location[address]", values.locationAddress);
            formData.append("location[gmapLink]", values.locationGmapLink);
            formData.append(
              "ageLimit[ticketsNeededFor]",
              values.ageLimitTicketsNeededFor
            );
            formData.append(
              "ageLimit[entryAllowedFor]",
              values.ageLimitEntryAllowedFor
            );
            formData.append("layout", values.layout);
            formData.append("seating", values.seating);
            formData.append("kidFriendly", values.kidFriendly);
            formData.append("petFriendly", values.petFriendly);
            formData.append("instructions", values.instructions);

            // Handle banner (single image)
            if (values.images && values.images.length > 0) {
              formData.append("images", values.images[0]);
            }

            // Handle gallery (multiple images)
            values.gallery.forEach((image) => formData.append("galary", image));

            // Handle artists
            values.artists.forEach((artist) => {
              formData.append("artists", artist);
            });

            // Handle ticket categories
            values.ticketCategories.forEach((ticketCategory, index) => {
              formData.append(
                `ticketCategories[${index}][name]`,
                ticketCategory.name
              );
              formData.append(
                `ticketCategories[${index}][price]`,
                ticketCategory.price
              );
              formData.append(
                `ticketCategories[${index}][totalQuantity]`,
                ticketCategory.totalQuantity
              );

              ticketCategory.perks.forEach((perk, perkIndex) => {
                formData.append(
                  `ticketCategories[${index}][perks][${perkIndex}]`,
                  perk
                );
              });
            });

            try {
              if (editMode) {
                await dispatch(
                  updateEvent({ eventId: selectedEventId, data: formData })
                );
              } else {
                await dispatch(saveEvent(formData));
              }

              resetForm();
              setOpenModal(false);
              setEditMode(false);
              setSelectedEventId(null);
              dispatch(fetchEvents());
            } catch (error) {
              console.error("Error saving event:", error);
            }
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto" }}>
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
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <JoditEditor
                    value={values.description}
                    onChange={(content) =>
                      setFieldValue("description", content)
                    }
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Box>

                <Field
                  as={TextField}
                  name="eventDate"
                  label="Event Date"
                  type="date"
                  fullWidth
                  sx={{ mt: 2 }}
                  InputLabelProps={{ shrink: true }}
                  helperText={<ErrorMessage name="eventDate" />}
                  error={touched.eventDate && !!errors.eventDate}
                />

                <Field
                  as={TextField}
                  name="eventTime"
                  label="Event Time"
                  type="time"
                  fullWidth
                  sx={{ mt: 2 }}
                  InputLabelProps={{ shrink: true }}
                  helperText={<ErrorMessage name="eventTime" />}
                  error={touched.eventTime && !!errors.eventTime}
                />

                <Field
                  as={TextField}
                  name="duration"
                  label="Duration"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="duration" />}
                  error={touched.duration && !!errors.duration}
                />

                <Field
                  as={TextField}
                  name="locationAddress"
                  label="Location Address"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="locationAddress" />}
                  error={touched.locationAddress && !!errors.locationAddress}
                />

                <Field
                  as={TextField}
                  name="locationGmapLink"
                  label="Google Maps Link"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="locationGmapLink" />}
                  error={touched.locationGmapLink && !!errors.locationGmapLink}
                />

                <Field
                  as={TextField}
                  name="ageLimitTicketsNeededFor"
                  label="Age Limit for Tickets"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="ageLimitTicketsNeededFor" />}
                  error={
                    touched.ageLimitTicketsNeededFor &&
                    !!errors.ageLimitTicketsNeededFor
                  }
                />

                <Field
                  as={TextField}
                  name="ageLimitEntryAllowedFor"
                  label="Age Limit for Entry"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="ageLimitEntryAllowedFor" />}
                  error={
                    touched.ageLimitEntryAllowedFor &&
                    !!errors.ageLimitEntryAllowedFor
                  }
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="layout-label">Layout</InputLabel>
                  <Field
                    as={Select}
                    labelId="layout-label"
                    name="layout"
                    label="Layout"
                    error={touched.layout && !!errors.layout}
                  >
                    <MenuItem value="Indoor">Indoor</MenuItem>
                    <MenuItem value="Outdoor">Outdoor</MenuItem>
                  </Field>
                  <ErrorMessage
                    name="layout"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="seating-label">Seating</InputLabel>
                  <Field
                    as={Select}
                    labelId="seating-label"
                    name="seating"
                    label="Seating"
                    error={touched.seating && !!errors.seating}
                  >
                    <MenuItem value="Seated">Seated</MenuItem>
                    <MenuItem value="Standing">Standing</MenuItem>
                  </Field>
                  <ErrorMessage
                    name="seating"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.kidFriendly}
                      onChange={(e) =>
                        setFieldValue("kidFriendly", e.target.checked)
                      }
                    />
                  }
                  label="Kid Friendly"
                  sx={{ mt: 2 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.petFriendly}
                      onChange={(e) =>
                        setFieldValue("petFriendly", e.target.checked)
                      }
                    />
                  }
                  label="Pet Friendly"
                  sx={{ mt: 2 }}
                />

                <Field
                  as={TextField}
                  name="instructions"
                  label="Instructions"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="instructions" />}
                  error={touched.instructions && !!errors.instructions}
                />

                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Banner Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                      setFieldValue("images", [file]);
                    }
                  }}
                  style={{ marginTop: "10px", display: "block" }}
                />
                {values.images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Selected Banner:</Typography>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        mt: 1,
                        mr: 2,
                      }}
                    >
                      <Avatar
                        src={
                          values.images[0] instanceof File
                            ? URL.createObjectURL(values.images[0])
                            : values.images[0]
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
                          setFieldValue("images", []);
                        }}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                <ErrorMessage
                  name="images"
                  component="div"
                  style={{ color: "red" }}
                />

                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Gallery Images
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const files = Array.from(event.target.files);
                    const selectedGallery = [...values.gallery, ...files];

                    if (selectedGallery.length > 10) {
                      alert("You can upload a maximum of 10 gallery images.");
                      return;
                    }

                    setFieldValue("gallery", selectedGallery);
                  }}
                  style={{ marginTop: "10px", display: "block" }}
                  multiple
                />
                {values.gallery.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      Selected Gallery Images:
                    </Typography>
                    {values.gallery.map((image, index) => (
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
                              "gallery",
                              values.gallery.filter((_, i) => i !== index)
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
                  name="gallery"
                  component="div"
                  style={{ color: "red" }}
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="artists-label">Artists</InputLabel>
                  <Field
                    as={Select}
                    labelId="artists-label"
                    name="artists"
                    multiple
                    value={values.artists}
                    label="Artists"
                    onChange={(e) => {
                      setFieldValue("artists", e.target.value);
                    }}
                  >
                    {artistsData.map((artist) => (
                      <MenuItem key={artist._id} value={artist._id}>
                        {artist.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="artists"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Ticket Categories
                </Typography>
                <FieldArray name="ticketCategories">
                  {({ push, remove }) => (
                    <div>
                      {values.ticketCategories.map((ticketCategory, index) => (
                        <Paper key={index} sx={{ p: 2, mt: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Ticket Category {index + 1}
                          </Typography>
                          <Field
                            as={TextField}
                            name={`ticketCategories.${index}.name`}
                            label="Category Name"
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText={
                              <ErrorMessage
                                name={`ticketCategories.${index}.name`}
                              />
                            }
                            error={
                              touched.ticketCategories?.[index]?.name &&
                              !!errors.ticketCategories?.[index]?.name
                            }
                          />
                          <Field
                            as={TextField}
                            name={`ticketCategories.${index}.price`}
                            label="Price"
                            type="number"
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText={
                              <ErrorMessage
                                name={`ticketCategories.${index}.price`}
                              />
                            }
                            error={
                              touched.ticketCategories?.[index]?.price &&
                              !!errors.ticketCategories?.[index]?.price
                            }
                          />
                          <Field
                            as={TextField}
                            name={`ticketCategories.${index}.totalQuantity`}
                            label="Total Quantity"
                            type="number"
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText={
                              <ErrorMessage
                                name={`ticketCategories.${index}.totalQuantity`}
                              />
                            }
                            error={
                              touched.ticketCategories?.[index]
                                ?.totalQuantity &&
                              !!errors.ticketCategories?.[index]?.totalQuantity
                            }
                          />

                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Perks
                          </Typography>
                          <FieldArray name={`ticketCategories.${index}.perks`}>
                            {({ push: pushPerk, remove: removePerk }) => (
                              <div>
                                {ticketCategory.perks.map((perk, perkIndex) => (
                                  <Box
                                    key={perkIndex}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mb: 1,
                                    }}
                                  >
                                    <Field
                                      as={TextField}
                                      name={`ticketCategories.${index}.perks.${perkIndex}`}
                                      label={`Perk ${perkIndex + 1}`}
                                      fullWidth
                                      sx={{ mr: 1 }}
                                    />
                                    <IconButton
                                      onClick={() => removePerk(perkIndex)}
                                      color="error"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                ))}
                                <Button
                                  type="button"
                                  onClick={() => pushPerk("")}
                                  variant="outlined"
                                  size="small"
                                  sx={{ mb: 2 }}
                                >
                                  Add Perk
                                </Button>
                              </div>
                            )}
                          </FieldArray>

                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            color="error"
                            variant="outlined"
                          >
                            Remove Category
                          </Button>
                        </Paper>
                      ))}
                      <Button
                        type="button"
                        onClick={() =>
                          push({
                            name: "",
                            price: 0,
                            perks: [""],
                            totalQuantity: 0,
                          })
                        }
                        variant="contained"
                        sx={{ mt: 2 }}
                      >
                        Add Ticket Category
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Prohibited Items
                </Typography>
                <FieldArray name="prohibitedItems">
                  {({ push, remove }) => (
                    <div>
                      {values.prohibitedItems.map((item, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Field
                            as={TextField}
                            name={`prohibitedItems.${index}`}
                            label={`Prohibited Item ${index + 1}`}
                            fullWidth
                            sx={{ mr: 1 }}
                          />
                          <IconButton
                            onClick={() => remove(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        type="button"
                        onClick={() => push("")}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                      >
                        Add Prohibited Item
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  FAQ
                </Typography>
                <FieldArray name="faq">
                  {({ push, remove }) => (
                    <div>
                      {values.faq.map((faqItem, index) => (
                        <Paper key={index} sx={{ p: 2, mt: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            FAQ Item {index + 1}
                          </Typography>
                          <Field
                            as={TextField}
                            name={`faq.${index}.question`}
                            label="Question"
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText={
                              <ErrorMessage name={`faq.${index}.question`} />
                            }
                            error={
                              touched.faq?.[index]?.question &&
                              !!errors.faq?.[index]?.question
                            }
                          />
                          <Field
                            as={TextField}
                            name={`faq.${index}.answer`}
                            label="Answer"
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText={
                              <ErrorMessage name={`faq.${index}.answer`} />
                            }
                            error={
                              touched.faq?.[index]?.answer &&
                              !!errors.faq?.[index]?.answer
                            }
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            color="error"
                            variant="outlined"
                          >
                            Remove FAQ Item
                          </Button>
                        </Paper>
                      ))}
                      <Button
                        type="button"
                        onClick={() => push({ question: "", answer: "" })}
                        variant="contained"
                        sx={{ mt: 2 }}
                      >
                        Add FAQ Item
                      </Button>
                    </div>
                  )}
                </FieldArray>
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
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteEvent}
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
        <DialogTitle>Preview Event</DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          {previewEvents && (
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "4px",
              }}
            >
              <Typography variant="h6">Title: {previewEvents.title}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Description:</Typography>
              <div
                style={{ fontSize: "18px" }}
                dangerouslySetInnerHTML={{ __html: previewEvents.description }}
              />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6">Banner:</Typography>
                {previewEvents.banner ? (
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      mt: 1,
                      mr: 2,
                    }}
                  >
                    <Avatar
                      src={previewEvents.banner}
                      variant="rounded"
                      sx={{
                        width: 100,
                        height: 70,
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(0)}
                    />
                  </Box>
                ) : (
                  <Typography variant="body1">No banner available.</Typography>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6">Gallery:</Typography>
                {previewEvents.gallery && previewEvents.gallery.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {previewEvents.gallery.map((image, index) => (
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
                          onClick={() => handleImageClick(index + 1)}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1">
                    No gallery images available.
                  </Typography>
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

export default Events;
