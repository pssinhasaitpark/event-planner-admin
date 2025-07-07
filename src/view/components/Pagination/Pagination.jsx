// Pagination.js
import React from "react";
import { Pagination as MuiPagination, Stack } from "@mui/material";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack spacing={2} alignItems="center">
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="#121212"
      />
    </Stack>
  );
};

export default Pagination;
