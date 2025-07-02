import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscribers } from "../../redux/slice/subscribersSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  TablePagination,
} from "@mui/material";

function Subscribers() {
  const dispatch = useDispatch();
  const { data: subscribers, loading } = useSelector(
    (state) => state.subscribers
  );

  const [showLoader, setShowLoader] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch]);

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

  // Slice the data to get only the current page's subscribers
  const displaySubscribers = subscribers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 0,
        boxShadow: 0,
        maxWidth: "100%",
        overflowX: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Subscribers
      </Typography>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              S.No.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Email
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displaySubscribers.map((subscriber, index) => (
            <TableRow
              key={subscriber._id}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>
                {new Date(subscriber.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="center" width="100%" mt={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={subscribers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>
  );
}

export default Subscribers;
