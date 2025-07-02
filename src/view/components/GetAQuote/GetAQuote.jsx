import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
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
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes, deleteQuote } from '../../redux/slice/getAQuoteSlice';

const GetAQuote = () => {
  const dispatch = useDispatch();
  const quotesData = useSelector((state) => state.getAQuote.data) || [];
  const status = useSelector((state) => state.getAQuote.status);
  const [showLoader, setShowLoader] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteIdToDelete, setQuoteIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (quoteId) => {
    setQuoteIdToDelete(quoteId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQuote = async () => {
    if (quoteIdToDelete) {
      await dispatch(deleteQuote(quoteIdToDelete));
      dispatch(fetchQuotes());
    }
    setDeleteDialogOpen(false);
    setQuoteIdToDelete(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotesData = quotesData.slice(indexOfFirstItem, indexOfLastItem);

  if (status === 'loading' || showLoader) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress sx={{ color: '#1e1871' }} />
      </Box>
    );
  }

  if (status === 'error')
    return (
      <Typography variant="h6" color="error">
        Error: {status}
      </Typography>
    );

  return (
    <Container
      maxWidth="false"
      sx={{
        '@media (min-width: 600px)': {
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
        },
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Get a Quote
      </Typography>

      {/* Quotes Table */}
      {quotesData && quotesData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Inquiry</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentQuotesData.map((quote) => (
                  <TableRow key={quote._id}>
                    <TableCell>{quote.name}</TableCell>
                    <TableCell>{quote.email}</TableCell>
                    <TableCell>{quote.mobile}</TableCell>
                    <TableCell>{quote.inquire}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleDeleteClick(quote._id)} sx={{ border: 0 }}>
                        <DeleteIcon fontSize="small" color="error" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil(quotesData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography variant="h6" color="textSecondary" sx={{ my: 4, textAlign: 'center' }}>
          No quotes available.
        </Typography>
      )}

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this quote?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteQuote} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GetAQuote;
