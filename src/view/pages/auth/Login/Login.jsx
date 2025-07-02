import React from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slice/authslice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLogin } from "../../../Hooks/useLogin";
import loginImage from "../../../../assets/Images/logo1.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginMutation = useLogin();

  // Custom color palette matching Utsavya brand colors
  const colorTheme = {
    primary: "#6B46C1", // Deep purple (matching your button)
    secondary: "#F59E0B", // Golden yellow (matching your logo)
    accent: "#D97706", // Orange accent
    background: "#F8FAFC", // Light background
    text: "#1F2937", // Dark text
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (values) => {
    loginMutation.mutate(values, {
     

      onSuccess: (data) => {
        const { token, role } = data;
     
        // Check role first
        if (role && (role === "admin" || role === "super-admin")) {
          // Update localStorage first

          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          
          // Then update Redux state - Fix the payload structure
          dispatch(setUser({ 
            accessToken: token, // Changed from 'token' to 'accessToken'
            userRole: role 
          }));

          toast.success("Login Successful!", { position: "top-right" });
          
          // Use a more reliable redirect method
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000); // Reduced timeout
        } else {
          toast.error("Access denied! Only admins can log in.", {
            position: "top-right",
          });
        }
      },
      onError: (error) => {
        console.error("Login error:", error);
        toast.error("Invalid credentials! Please try again.", {
          position: "top-right",
        });
      },
    });
  };

  return (
    <Box
      className="login-container"
      sx={{
        background: `linear-gradient(135deg, #FDFCFA 0%, #F9F6F1 20%, #F5F1EB 40%, #F0EBE3 60%, #EDE5D8 80%, #E8DCC6 100%)`,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ToastContainer />
      <Paper
        className="login-paper"
        elevation={8}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: `0 10px 30px rgba(0,0,0,0.15)`,
          maxWidth: "1000px",
          width: "90%",
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          minHeight="100%"
        >
          {/* Left side - Image container */}
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={4}
            sx={{
              minHeight: { xs: "300px", md: "500px" },
              backgroundColor: "white",
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
              sx={{ position: "relative" }}
            >
              <img
                src={loginImage}
                alt="Children Learning"
                className="login-image"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "auto",
                  objectFit: "cover",
                  display: "block",
                  marginRight: "40%",
                  borderRadius: "12px",
                }}
              />
            </Box>
          </Box>

          {/* Right side - Login form */}
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={4}
            sx={{
              backgroundColor: "white",
              position: "relative",
            }}
          >
            <Box className="login-box" width="100%" maxWidth="400px">
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                textAlign="center"
                sx={{
                  mb: 4,
                  color: colorTheme.text,
                }}
              >
                Login
              </Typography>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ touched, errors }) => (
                  <Form>
                    <Box mb={3}>
                      <Field
                        as={TextField}
                        name="email"
                        type="email"
                        label="Enter the email address"
                        fullWidth
                        variant="outlined"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&:hover fieldset": {
                              borderColor: colorTheme.secondary,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: colorTheme.secondary,
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: colorTheme.secondary,
                          },
                        }}
                      />
                    </Box>

                    <Box mb={3}>
                      <Field
                        as={TextField}
                        name="password"
                        type="password"
                        label="Enter the password"
                        fullWidth
                        variant="outlined"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&:hover fieldset": {
                              borderColor: colorTheme.secondary,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: colorTheme.secondary,
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: colorTheme.secondary,
                          },
                        }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className="submit-button"
                      disabled={loginMutation.isLoading}
                      sx={{
                        py: 1.5,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        textTransform: "none",
                        backgroundColor: colorTheme.primary,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#553C9A", // Darker purple on hover
                          transform: "translateY(-1px)",
                          boxShadow: `0 6px 15px ${colorTheme.primary}40`,
                        },
                        "&:active": {
                          transform: "translateY(0px)",
                        },
                        "&:disabled": {
                          backgroundColor: "#9CA3AF",
                          transform: "none",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {loginMutation.isLoading ? "Logging in..." : "Submit"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;