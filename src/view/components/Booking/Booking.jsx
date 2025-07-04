// Booking.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  fetchBookings,
  saveBooking,
  updateBooking,
  deleteBooking,
} from "../../redux/slice/bookingSlice";
import { fetchEvents } from "../../redux/slice/eventSlice";

const validationSchema = Yup.object({
  eventId: Yup.string().required("Event is required"),
  ticketCategory: Yup.string().required("Ticket Category is required"),
  quantity: Yup.number().required("Quantity is required").positive().integer(),
});

const Booking = () => {
  const dispatch = useDispatch();
  const { data: bookingData, status: bookingStatus } = useSelector(
    (state) => state.bookings
  ) || { data: [], status: "idle" };
  const { data: eventsData, status: eventsStatus } = useSelector(
    (state) => state.events
  ) || { data: [], status: "idle" };

  console.log("Booking Data:", bookingData);
  console.log("event data Data: in jsx", eventsData);

  const [showLoader, setShowLoader] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (bookingId) => {
    setBookingIdToDelete(bookingId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBooking = async () => {
    if (bookingIdToDelete) {
      await dispatch(deleteBooking(bookingIdToDelete));
      dispatch(fetchBookings());
    }
    setDeleteDialogOpen(false);
    setBookingIdToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setSelectedBooking(null);
    setSelectedBookingId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookingData.slice(indexOfFirstItem, indexOfLastItem);

  if (bookingStatus === "loading" || eventsStatus === "loading" || showLoader) {
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

  if (bookingStatus === "error" || eventsStatus === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {bookingStatus === "error" ? bookingStatus : eventsStatus}
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
        Booking Details
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
            setSelectedBooking(null);
          }}
          sx={{
            backgroundColor: "#121212",
            "&:hover": { backgroundColor: "#121212" },
            textTransform: "none",
          }}
        >
          Add New Booking
        </Button>
      </Box>

      {bookingData && bookingData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Event</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Ticket Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
                      {
                        eventsData.find(
                          (event) => event._id === booking.eventId
                        )?.name
                      }
                    </TableCell>
                    <TableCell>{booking.ticketCategory}</TableCell>
                    <TableCell>{booking.quantity}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handleEditClick(booking)}
                          sx={{ border: 0 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(booking._id)}
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
              count={Math.ceil(bookingData.length / itemsPerPage)}
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
          No bookings available. Please add a new booking.
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
          {editMode ? "Edit Booking" : "Add New Booking"}
        </DialogTitle>
        <Formik
          initialValues={{
            eventId: selectedBooking?.eventId || "",
            ticketCategory: selectedBooking?.ticketCategory || "",
            quantity: selectedBooking?.quantity || "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const bookingData = {
              eventId: values.eventId,
              ticketCategory: values.ticketCategory,
              quantity: values.quantity,
            };

            if (editMode) {
              await dispatch(
                updateBooking({
                  bookingId: selectedBookingId,
                  data: bookingData,
                })
              );
            } else {
              await dispatch(saveBooking(bookingData));
            }

            resetForm();
            handleCloseModal();
            dispatch(fetchBookings());
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="eventId-label">Event</InputLabel>
                  <Select
                    labelId="eventId-label"
                    id="eventId"
                    name="eventId"
                    value={values.eventId}
                    label="Event"
                    onChange={(event) => {
                      setFieldValue("eventId", event.target.value);
                    }}
                    error={touched.eventId && !!errors.eventId}
                  >
                    {eventsData.map((event) => (
                      <MenuItem key={event._id} value={event._id}>
                        {event.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="eventId"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <Field
                  as={TextField}
                  name="ticketCategory"
                  label="Ticket Category"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="ticketCategory" />}
                  error={touched.ticketCategory && !!errors.ticketCategory}
                />
                <Field
                  as={TextField}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  helperText={<ErrorMessage name="quantity" />}
                  error={touched.quantity && !!errors.quantity}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} sx={{ color: "121212" }}>
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
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteBooking}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Booking;
