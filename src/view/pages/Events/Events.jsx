// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import JoditEditor from "jodit-react";
// import {
//   fetchEventsData,
//   createEvent,
//   updateEvent,
//   updateEventSection,
//   deleteEventSection,
// } from "../../redux/slice/eventSlice";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   Typography,
//   Divider,
//   TextField,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   CircularProgress,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
//   Upload as UploadIcon,
// } from "@mui/icons-material";
// import EventVideos from "./EventVideos.jsx";
// import { SlideshowLightbox } from "lightbox.js-react";

// function Events() {
//   const dispatch = useDispatch();
//   const { events = [], loading } = useSelector((state) => state.events);

//   const [showLoader, setShowLoader] = useState(true);
//   const [newBanner, setNewBanner] = useState(null);
//   const [bannerPreview, setBannerPreview] = useState(null);
//   const [newEvent, setNewEvent] = useState({
//     title: "",
//     description: "",
//     banner: "",
//     imageGroups: [],
//   });
//   const [newSection, setNewSection] = useState({
//     image_title: "",
//     image_description: "",
//     images: [],
//   });
//   const editor = useRef(null);
//   const fileInputRef = useRef(null);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
//   const [editSectionDialogOpen, setEditSectionDialogOpen] = useState(false);
//   const [newSectionImages, setNewSectionImages] = useState([]);
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [expandedSections, setExpandedSections] = useState({});

//   // State for delete confirmation dialog
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [sectionToDelete, setSectionToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchEventsData());
//   }, [dispatch]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowLoader(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleCreateEvent = () => {
//     dispatch(createEvent(newEvent)).then(() => {
//       setNewEvent({ title: "", description: "", banner: "", imageGroups: [] });
//       dispatch(fetchEventsData());
//     });
//   };

//   const handleUpdateEvent = () => {
//     if (!events[0]) return;
//     dispatch(updateEvent({ eventId: events[0]._id, eventData: newEvent })).then(
//       () => {
//         setEditDialogOpen(false);
//         dispatch(fetchEventsData());
//       }
//     );
//   };

//   const handleBannerUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewBanner(file);
//       const previewUrl = URL.createObjectURL(file);
//       setBannerPreview(previewUrl);
//     }
//   };

//   const handleSubmitBanner = () => {
//     if (!events[0] || !newBanner) return;

//     const formData = new FormData();
//     formData.append("banner", newBanner);

//     dispatch(
//       updateEvent({
//         eventId: events[0]._id,
//         eventData: formData,
//         isFormData: true,
//       })
//     ).then(() => {
//       setNewBanner(null);
//       dispatch(fetchEventsData());
//     });
//   };

//   const handleChooseFile = () => {
//     fileInputRef.current.click();
//   };

//   const handleAddSection = () => {
//     if (!events[0]) return;

//     const formData = new FormData();
//     formData.append("image_title_1", newSection.image_title);
//     formData.append("image_description_1", newSection.image_description);

//     newSection.images.forEach((file) => {
//       formData.append("images", file);
//     });

//     dispatch(
//       updateEvent({
//         eventId: events[0]._id,
//         eventData: formData,
//         isFormData: true,
//       })
//     ).then(() => {
//       setNewSection({ image_title: "", image_description: "", images: [] });
//       setNewSectionImages([]);
//       setAddSectionDialogOpen(false);
//       dispatch(fetchEventsData());
//     });
//   };

//   const handleNewSectionImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const imageUrls = files.map((file) => URL.createObjectURL(file));
//     setNewSectionImages(imageUrls);
//     setNewSection({ ...newSection, images: files });
//   };

//   const handleEditSection = (section) => {
//     setNewSection({
//       image_title: section.image_title,
//       image_description: section.image_description,
//       images: section.images,
//     });
//     setSelectedSectionId(section._id);
//     setEditSectionDialogOpen(true);
//   };

//   const handleUpdateSection = () => {
//     if (!events[0] || !selectedSectionId) return;

//     const formData = new FormData();
//     formData.append("image_title", newSection.image_title);
//     formData.append("image_description", newSection.image_description);

//     newSection.images.forEach((file) => {
//       formData.append("images", file);
//     });

//     dispatch(
//       updateEventSection({
//         eventId: events[0]._id,
//         sectionId: selectedSectionId,
//         sectionData: formData,
//       })
//     ).then(() => {
//       setEditSectionDialogOpen(false);
//       setNewSection({ image_title: "", image_description: "", images: [] });
//       setNewSectionImages([]);
//       dispatch(fetchEventsData());
//     });
//   };

//   const handleDeleteSection = (sectionId) => {
//     setSectionToDelete(sectionId);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirmed = () => {
//     dispatch(deleteEventSection(sectionToDelete)).then(() => {
//       dispatch(fetchEventsData());
//       setDeleteDialogOpen(false);
//     });
//   };

//   const handleToggleExpand = (sectionId) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }));
//   };

//   const handleEditClick = () => {
//     if (events.length > 0) {
//       setNewEvent({
//         title: events[0].title,
//         description: events[0].description,
//       });
//       setEditDialogOpen(true);
//     }
//   };

//   const truncateText = (text, limit) => {
//     if (!text) return "";
//     return text.length > limit ? text.substring(0, limit) + "..." : text;
//   };

//   if (loading || showLoader)
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="50vh"
//       >
//         <CircularProgress sx={{ color: "#F68633" }} />
//       </Box>
//     );

//   // if (error)
//   //   return (
//   //     <Typography variant="h6" color="error">
//   //       Error: {error}
//   //     </Typography>
//   //   );

//   return (
//     <div className="p-4">
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         Events
//       </Typography>

//       {events.length === 0 ? (
//         <>
//           <Typography variant="body1">
//             No events available. Create one:
//           </Typography>
//           <TextField
//             label="Title"
//             fullWidth
//             margin="normal"
//             value={newEvent.title}
//             onChange={(e) =>
//               setNewEvent({ ...newEvent, title: e.target.value })
//             }
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             margin="normal"
//             multiline
//             rows={3}
//             value={newEvent.description}
//             onChange={(e) =>
//               setNewEvent({ ...newEvent, description: e.target.value })
//             }
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleCreateEvent}
//             sx={{
//               backgroundColor: "#e0752d",
//               "&:hover": { backgroundColor: "#F68633" },
//               textTransform: "none",
//               mb: 2,
//             }}
//           >
//             Create Event
//           </Button>
//         </>
//       ) : (
//         <>
//           <Box display="flex" alignItems="center">
//             <Box>
//               <Typography variant="h5" fontWeight="bold" gutterBottom>
//                 {events[0]?.title}
//               </Typography>
//               <Typography variant="body1" color="textSecondary" paragraph>
//                 {events[0]?.description}
//               </Typography>
//             </Box>
//             <Button
//               variant="contained"
//               onClick={handleEditClick}
//               sx={{
//                 backgroundColor: "#e0752d",
//                 "&:hover": { backgroundColor: "#F68633" },
//                 textTransform: "none",
//               }}
//             >
//               <EditIcon />
//             </Button>
//           </Box>

//           <Dialog
//             open={editDialogOpen}
//             onClose={() => setEditDialogOpen(false)}
//             maxWidth="md" // You can use "sm", "md", "lg", or "xl" for different sizes
//             fullWidth // Ensures the dialog takes full width of the specified maxWidth
//           >
//             <DialogTitle>Edit Event</DialogTitle>
//             <DialogContent>
//               <TextField
//                 label="Title"
//                 fullWidth
//                 margin="normal"
//                 value={newEvent.title}
//                 onChange={(e) =>
//                   setNewEvent({ ...newEvent, title: e.target.value })
//                 }
//               />
//               <TextField
//                 label="Description"
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={3}
//                 value={newEvent.description}
//                 onChange={(e) =>
//                   setNewEvent({ ...newEvent, description: e.target.value })
//                 }
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//               <Button
//                 variant="contained"
//                 onClick={handleUpdateEvent}
//                 sx={{
//                   backgroundColor: "#e0752d",
//                   "&:hover": { backgroundColor: "#F68633" },
//                   textTransform: "none",
//                 }}
//               >
//                 Save
//               </Button>
//             </DialogActions>
//           </Dialog>

//           <Box>
//             <Typography variant="h6" fontWeight="bold" gutterBottom>
//               Banner
//             </Typography>
//             <Box
//               sx={{
//                 width: "100%",
//                 height: "400px",
//                 borderRadius: "8px",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 overflow: "hidden",
//                 mb: 2,
//               }}
//             >
//               {bannerPreview ? (
//                 <img
//                   src={bannerPreview}
//                   alt="Banner Preview"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               ) : events[0]?.banner ? (
//                 <img
//                   src={events[0].banner}
//                   alt="Event Banner"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               ) : (
//                 <Typography variant="body1" color="textSecondary">
//                   No banner uploaded
//                 </Typography>
//               )}
//             </Box>

//             <input
//               type="file"
//               ref={fileInputRef}
//               style={{ display: "none" }}
//               onChange={handleBannerUpload}
//               accept="image/*"
//             />

//             <Box display="flex" gap={2}>
//               <Button
//                 variant="contained"
//                 startIcon={<UploadIcon />}
//                 onClick={handleChooseFile}
//                 sx={{
//                   backgroundColor: "#e0752d",
//                   "&:hover": { backgroundColor: "#F68633" },
//                   textTransform: "none",
//                 }}
//               >
//                 Choose File
//               </Button>

//               {newBanner && (
//                 <Button
//                   variant="contained"
//                   onClick={handleSubmitBanner}
//                   sx={{
//                     backgroundColor: "#e0752d",
//                     "&:hover": { backgroundColor: "#F68633" },
//                     textTransform: "none",
//                   }}
//                 >
//                   Upload Banner
//                 </Button>
//               )}
//             </Box>

//             {newBanner && (
//               <Typography variant="body2" mt={1}>
//                 Selected file: {newBanner.name}
//               </Typography>
//             )}
//           </Box>

//           <Divider sx={{ my: 3 }} />
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             marginBottom="15px"
//           >
//             <Typography variant="h6" fontWeight="bold">
//               Image Sections
//             </Typography>
//             <Button
//               variant="contained"
//               color="secondary"
//               startIcon={<AddIcon />}
//               onClick={() => setAddSectionDialogOpen(true)}
//               sx={{
//                 backgroundColor: "#e0752d",
//                 "&:hover": { backgroundColor: "#F68633" },
//                 textTransform: "none",
//               }}
//             >
//               Add Section
//             </Button>
//           </Box>
//           <TableContainer component={Paper} elevation={3}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
//                   <TableCell sx={{ fontWeight: "bold" }}>Image Title</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>
//                     Image Description
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {events[0]?.imageGroups?.map((group) => (
//                   <TableRow key={group._id}>
//                     <TableCell>{group.image_title}</TableCell>
//                     <TableCell>
//                       <div>
//                         <div
//                           dangerouslySetInnerHTML={{
//                             __html: expandedSections[group._id]
//                               ? group.image_description || "" // Fallback to empty string
//                               : truncateText(group.image_description, 150),
//                           }}
//                         />
//                         <Button
//                           onClick={() => handleToggleExpand(group._id)}
//                           sx={{ textTransform: "none", ml: 1 }}
//                         >
//                           {expandedSections[group._id]
//                             ? "Read Less"
//                             : "Read More"}
//                         </Button>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Box display="flex" gap={1} flexWrap="wrap">
//                         {group.images?.map((img, index) => (
//                           <SlideshowLightbox key={index}>
//                             <img
//                               src={img}
//                               alt={group.image_title}
//                               style={{
//                                 width: "60px",
//                                 height: "60px",
//                                 objectFit: "cover",
//                                 borderRadius: "5px",
//                               }}
//                             />
//                           </SlideshowLightbox>
//                         ))}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Button onClick={() => handleEditSection(group)}>
//                         <EditIcon />
//                       </Button>
//                       <Button onClick={() => handleDeleteSection(group._id)}>
//                         <DeleteIcon color="error" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <Dialog
//             open={addSectionDialogOpen}
//             onClose={() => setAddSectionDialogOpen(false)}
//             maxWidth="md" // You can use "sm", "md", "lg", or "xl" for different sizes
//             fullWidth // Ensures the dialog takes full width of the specified maxWidth
//           >
//             <DialogTitle>Add New Section</DialogTitle>
//             <DialogContent>
//               <TextField
//                 label="Image Title"
//                 fullWidth
//                 margin="normal"
//                 onChange={(e) =>
//                   setNewSection({ ...newSection, image_title: e.target.value })
//                 }
//               />

//               <JoditEditor
//                 ref={editor}
//                 value={newSection.image_description || ""}
//                 onChange={(newContent) =>
//                   setNewSection({
//                     ...newSection,
//                     image_description: newContent,
//                   })
//                 }
//               />

//               <input
//                 type="file"
//                 multiple
//                 onChange={handleNewSectionImageUpload}
//               />

//               <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
//                 {newSectionImages?.map((img, index) => (
//                   <img
//                     key={index}
//                     src={img}
//                     alt={`New Section ${index}`}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "5px",
//                     }}
//                   />
//                 ))}
//               </Box>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setAddSectionDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleAddSection}
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "#e0752d",
//                   "&:hover": { backgroundColor: "#F68633" },
//                   textTransform: "none",
//                 }}
//               >
//                 Submit
//               </Button>
//             </DialogActions>
//           </Dialog>

//           <Dialog
//             open={editSectionDialogOpen}
//             onClose={() => setEditSectionDialogOpen(false)}
//           >
//             <DialogTitle>Edit Section</DialogTitle>
//             <DialogContent>
//               <TextField
//                 label="Image Title"
//                 fullWidth
//                 margin="normal"
//                 value={newSection.image_title}
//                 onChange={(e) =>
//                   setNewSection({ ...newSection, image_title: e.target.value })
//                 }
//               />

//               <JoditEditor
//                 ref={editor}
//                 value={newSection.image_description}
//                 onChange={(newContent) =>
//                   setNewSection({
//                     ...newSection,
//                     image_description: newContent,
//                   })
//                 }
//               />

//               <input
//                 type="file"
//                 multiple
//                 onChange={handleNewSectionImageUpload}
//               />
//               <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
//                 {newSectionImages?.map((img, index) => (
//                   <img
//                     key={index}
//                     src={img}
//                     alt={`Edit Section ${index}`}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "5px",
//                     }}
//                   />
//                 ))}
//               </Box>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setEditSectionDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleUpdateSection}
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "#e0752d",
//                   "&:hover": { backgroundColor: "#F68633" },
//                   textTransform: "none",
//                 }}
//               >
//                 Update
//               </Button>
//             </DialogActions>
//           </Dialog>

//           {/* Confirmation Dialog for Deleting Section */}
//           <Dialog
//             open={deleteDialogOpen}
//             onClose={() => setDeleteDialogOpen(false)}
//           >
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogContent>
//               <Typography>
//                 Are you sure you want to delete this section?
//               </Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//               <Button
//                 onClick={handleDeleteConfirmed}
//                 color="error"
//                 variant="contained"
//               >
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </>
//       )}
//       <EventVideos />
//     </div>
//   );
// }

// export default Events;
