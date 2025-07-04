import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSocialMedia,
  updateSocialMedia,
  addSocialMedia,
  deleteSocialMediaLink,
} from "../../redux/slice/socialMediaSlice";
import {
  WhatsApp,
  Facebook,
  Instagram,
  YouTube,
  LinkedIn,
  Twitter,
  Pinterest,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { FaSnapchatGhost } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThreads } from "@fortawesome/free-brands-svg-icons";

const SocialMedia = () => {
  const dispatch = useDispatch();
  const { links, id, loading } = useSelector((state) => state.socialMedia);
  const [showLoader, setShowLoader] = useState(true);
  const [socialLinks, setSocialLinks] = useState({});
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    dispatch(fetchSocialMedia());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (links) {
      const filteredLinks = Object.keys(links).reduce((acc, key) => {
        if (!["createdAt", "updatedAt", "__v", "url", "_id"].includes(key)) {
          acc[key] = links[key]?.link || "";
        }
        return acc;
      }, {});
      setSocialLinks(filteredLinks);
    }
  }, [links]);

  if (loading || showLoader)
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

  const handleChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        await dispatch(
          updateSocialMedia({ id, updatedLinks: socialLinks })
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Social media links updated!",
          severity: "success",
        });
      } else {
        await dispatch(addSocialMedia(socialLinks)).unwrap();
        setSnackbar({
          open: true,
          message: "Social media links added!",
          severity: "success",
        });
      }
      dispatch(fetchSocialMedia());
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Operation failed. Try again.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key) => {
    try {
      await dispatch(deleteSocialMediaLink({ id, key })).unwrap();
      setSnackbar({
        open: true,
        message: "Social media link deleted!",
        severity: "success",
      });
      dispatch(fetchSocialMedia());
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Operation failed. Try again.",
        severity: "error",
      });
    }
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setEditMode(true);
  };

  const iconMap = {
    whatsapp: <WhatsApp sx={{ color: "#25D366", fontSize: 32 }} />,
    facebook: <Facebook sx={{ color: "#1877F2", fontSize: 32 }} />,
    instagram: <Instagram sx={{ color: "#E1306C", fontSize: 32 }} />,
    youtube: <YouTube sx={{ color: "red", fontSize: 32 }} />,
    linkedIn: <LinkedIn sx={{ color: "#0A66C2", fontSize: 32 }} />,
    x: <Twitter sx={{ color: "black", fontSize: 32 }} />,
    pinterest: <Pinterest sx={{ color: "#E60023", fontSize: 32 }} />,
    snapchat: <FaSnapchatGhost style={{ color: "#FFFC00", fontSize: 32 }} />,
    threads: <FontAwesomeIcon icon={faThreads} />,
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          mt: 5,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 5 }}>
          Social Media Links
        </Typography>

        {Object.keys(socialLinks).map((key) => (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
          >
            <Box sx={{ width: 40, display: "flex", justifyContent: "center" }}>
              {iconMap[key] || null}
            </Box>
            <TextField
              fullWidth
              label={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
              name={key}
              value={socialLinks[key]}
              onChange={handleChange}
              sx={{ "& .MuiInputBase-root": { py: 1.2 } }}
              disabled={!editMode || editingKey !== key}
            />
            <IconButton onClick={() => handleEdit(key)}>
              <EditIcon color="primary" />
            </IconButton>
            {/* <IconButton onClick={() => handleDelete(key)}>
              <DeleteIcon color="error" />
            </IconButton> */}
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              minWidth: 140,
              py: 1,
              backgroundColor: "#121212",
              "&:hover": { backgroundColor: "#121212" },
            }}
          >
            {saving ? (
              <CircularProgress size={24} />
            ) : id ? (
              "Update All"
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SocialMedia;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSocialMedia,
//   updateSocialMedia,
//   addSocialMedia,
//   deleteSocialMediaLink,
// } from "../../redux/slice/socialMediaSlice";
// import {
//   WhatsApp,
//   Facebook,
//   Instagram,
//   YouTube,
//   LinkedIn,
//   Twitter,
//   Pinterest,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
// } from "@mui/icons-material";
// import { FaSnapchatGhost } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faThreads } from "@fortawesome/free-brands-svg-icons";

// const SocialMedia = () => {
//   const dispatch = useDispatch();
//   const { links, id, loading } = useSelector((state) => state.socialMedia);
//   const [showLoader, setShowLoader] = useState(true);
//   const [socialLinks, setSocialLinks] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [editMode, setEditMode] = useState(false);
//   const [editingKey, setEditingKey] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [newLink, setNewLink] = useState({ name: '', link: '' });
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [keyToDelete, setKeyToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchSocialMedia());
//   }, [dispatch]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowLoader(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (links) {
//       const filteredLinks = Object.keys(links).reduce((acc, key) => {
//         if (!["createdAt", "updatedAt", "__v", "url", "_id"].includes(key)) {
//           acc[key] = links[key]?.link || "";
//         }
//         return acc;
//       }, {});
//       setSocialLinks(filteredLinks);
//     }
//   }, [links]);

//   if (loading || showLoader)
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//         <CircularProgress sx={{ color: "#1e1871" }} />
//       </Box>
//     );

//   const handleChange = (e) => {
//     setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       if (id) {
//         await dispatch(updateSocialMedia({ id, updatedLinks: socialLinks })).unwrap();
//         setSnackbar({ open: true, message: "Social media links updated!", severity: "success" });
//       } else {
//         await dispatch(addSocialMedia(socialLinks)).unwrap();
//         setSnackbar({ open: true, message: "Social media links added!", severity: "success" });
//       }
//       dispatch(fetchSocialMedia());
//     } catch (error) {
//       setSnackbar({ open: true, message: "Operation failed. Try again.", severity: "error" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await dispatch(deleteSocialMediaLink({ id, key: keyToDelete })).unwrap();
//       setSnackbar({ open: true, message: "Social media link deleted!", severity: "success" });
//       setDeleteDialogOpen(false);
//       setKeyToDelete(null);
//       dispatch(fetchSocialMedia());
//     } catch (error) {
//       setSnackbar({ open: true, message: "Operation failed. Try again.", severity: "error" });
//     }
//   };

//   const handleEdit = (key) => {
//     setEditingKey(key);
//     setEditMode(true);
//   };

//   const handleNewLinkChange = (e) => {
//     setNewLink({ ...newLink, [e.target.name]: e.target.value });
//   };

//   const handleAddLink = async () => {
//     setSaving(true);
//     try {
//       const linkExists = Object.keys(socialLinks).includes(newLink.name);
//       if (linkExists) {
//         // Update existing link
//         const updatedLinks = { ...socialLinks, [newLink.name]: newLink.link };
//         await dispatch(updateSocialMedia({ id, updatedLinks })).unwrap();
//         setSnackbar({ open: true, message: "Social media link updated!", severity: "success" });
//       } else {
//         // Add new link
//         const newLinks = { [newLink.name]: newLink.link };
//         await dispatch(addSocialMedia(newLinks)).unwrap();
//         setSnackbar({ open: true, message: "New social media link added!", severity: "success" });
//       }
//       setNewLink({ name: '', link: '' }); // Reset the form
//       setOpenDialog(false); // Close the dialog
//       dispatch(fetchSocialMedia());
//     } catch (error) {
//       setSnackbar({ open: true, message: "Operation failed. Try again.", severity: "error" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteClick = (key) => {
//     setKeyToDelete(key);
//     setDeleteDialogOpen(true);
//   };

//   const iconMap = {
//     whatsapp: <WhatsApp sx={{ color: "#25D366", fontSize: 32 }} />,
//     facebook: <Facebook sx={{ color: "#1877F2", fontSize: 32 }} />,
//     instagram: <Instagram sx={{ color: "#E1306C", fontSize: 32 }} />,
//     youtube: <YouTube sx={{ color: "red", fontSize: 32 }} />,
//     linkedIn: <LinkedIn sx={{ color: "#0A66C2", fontSize: 32 }} />,
//     x: <Twitter sx={{ color: "black", fontSize: 32 }} />,
//     pinterest: <Pinterest sx={{ color: "#E60023", fontSize: 32 }} />,
//     snapchat: <FaSnapchatGhost style={{ color: "#FFFC00", fontSize: 32 }} />,
//     threads: <FontAwesomeIcon icon={faThreads} />
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: "white", mt: 5 }}>
//         <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setOpenDialog(true)}
//             sx={{
//               backgroundColor: "#023e8a",
//               "&:hover": { backgroundColor: "#023e8a" },
//               textTransform: "none",
//             }}
//           >
//             Add New Link
//           </Button>
//         </Box>
//         <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 5 }}>
//           Social Media Links
//         </Typography>

//         {Object.keys(socialLinks).map((key) => (
//           <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
//             <Box sx={{ width: 40, display: "flex", justifyContent: "center" }}>
//               {iconMap[key] || null}
//             </Box>
//             <TextField
//               fullWidth
//               label={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
//               name={key}
//               value={socialLinks[key]}
//               onChange={handleChange}
//               sx={{ "& .MuiInputBase-root": { py: 1.2 } }}
//               disabled={!editMode || editingKey !== key}
//             />
//             <IconButton onClick={() => handleEdit(key)}>
//               <EditIcon color="primary" />
//             </IconButton>
//             <IconButton onClick={() => handleDeleteClick(key)}>
//               <DeleteIcon color="error" />
//             </IconButton>
//           </Box>
//         ))}

//         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             disabled={saving}
//             sx={{
//               minWidth: 140,
//               py: 1,
//               backgroundColor: "#023e8a",
//               "&:hover": { backgroundColor: "#023e8a" },
//             }}
//           >
//             {saving ? <CircularProgress size={24} /> : id ? "Update All" : "Save"}
//           </Button>
//         </Box>
//       </Box>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Add New Social Media Link</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Name"
//             name="name"
//             value={newLink.name}
//             onChange={handleNewLinkChange}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Link"
//             name="link"
//             value={newLink.link}
//             onChange={handleNewLinkChange}
//             sx={{ mb: 2 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button onClick={handleAddLink} disabled={saving}>
//             {saving ? <CircularProgress size={24} /> : "Add Link"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this social media link?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default SocialMedia;
