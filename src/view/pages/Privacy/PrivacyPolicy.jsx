import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolicyDetails } from "../../redux/slice/policySlice";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const { data: policyDetailsData, status } = useSelector(
    (state) => state.policy
  ) || { data: [], status: "idle" };

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    dispatch(fetchPolicyDetails("privacy"));
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
        Privacy Policy
      </Typography>

      {policyDetailsData && policyDetailsData.length > 0 ? (
        <Box
          sx={{ mt: 2, p: 3, border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Privacy Policy
          </Typography>
          {policyDetailsData.map((policy) => (
            <Box key={policy._id} sx={{ mb: 3 }}>
              <div dangerouslySetInnerHTML={{ __html: policy.content }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ my: 4, textAlign: "center" }}
        >
          No privacy policy available.
        </Typography>
      )}
    </Container>
  );
};

export default PrivacyPolicy;
