import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { fetchUserData } from "../../redux/slice/registrationSlice"; 
import { SlideshowLightbox } from "lightbox.js-react";
const Registration = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.registration);
  const [showLoader, setShowLoader] = useState(true);
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default 5 rows per page

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to first when changing rows per page
  };

  if (status === "loading" || showLoader)
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
      <Paper sx={{ borderRadius: 0, boxShadow: 0 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          User List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(users) && users.length > 0 ? (
                users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate data
                  .map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.city}</TableCell>
                      <TableCell>{user.state}</TableCell>
                      <TableCell>{user.category}</TableCell>
                      <TableCell>{user.designation}</TableCell>
                      <TableCell>{user.message}</TableCell>
                      <TableCell>
                        {user.images && user.images.length > 0 ? (
                          <SlideshowLightbox>
                            <img
                              src={user.images[0]}
                              alt="User"
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                              }}
                            />
                          </SlideshowLightbox>
                        ) : (
                          <Typography>No Image</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]} // Options for pagination
          component="div"
          count={users.length} // Total number of users
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Registration;
