import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventVideoData,
  updateEventVideo,
} from "../../redux/slice/eventVideoSlice";
import {
  Stack,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit,
  Add as AddIcon,
} from "@mui/icons-material";

function EventVideos() {
  const dispatch = useDispatch();

  const { eventVideos, status } = useSelector((state) => state.eventVideos);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const [eventData, setEventData] = useState({
    video_title: "",
    video_description: "",
  });

  const [newVideoFile, setNewVideoFile] = useState(null);

  useEffect(() => {
    dispatch(fetchEventVideoData());
  }, [dispatch]);

  const handleEditClick = () => {
    if (eventVideos.length > 0) {
      setEventData({
        video_title: eventVideos[0].video_title,
        video_description: eventVideos[0].video_description,
      });
      setEditDialogOpen(true);
    }
  };

  const handleUpdateEventVideo = () => {
    if (eventVideos.length > 0) {
      const eventId = eventVideos[0]._id;
      dispatch(updateEventVideo({ eventId, eventData }));
      setEditDialogOpen(false);
    }
  };

  const handleAddVideo = () => {
    if (newVideoFile) {
      const formData = new FormData();
      formData.append("videos", newVideoFile);

      const eventId = eventVideos[0]._id;
      dispatch(updateEventVideo({ eventId, eventData: formData }));

      setAddDialogOpen(false);
      setNewVideoFile(null);
    } else {
      console.error("No video file selected");
    }
  };

  const handleDeleteEventVideo = (videoUrl) => {
    setVideoToDelete(videoUrl);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVideo = () => {
    if (eventVideos.length > 0) {
      const eventId = eventVideos[0]._id;
      const payload = {
        remove_videos: [videoToDelete],
      };
      dispatch(updateEventVideo({ eventId, eventData: payload }));
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Event Videos
      </Typography>

      {status === "loading" && <CircularProgress />}

      {eventVideos.length > 0 && (
        <Box marginBottom="20px">
          <Typography variant="h6" gutterBottom>
            {eventVideos[0].video_title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {eventVideos[0].video_description}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", mb: 2 }}
          >
            {/* Left-aligned Edit button */}
            <Button
              variant="contained"
              onClick={handleEditClick}
              sx={{
                backgroundColor: "#e0752d",
                "&:hover": { backgroundColor: "#F68633" },
                textTransform: "none",
              }}
            >
              <Edit />
            </Button>

            {/* Right-aligned Add Video button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                backgroundColor: "#e0752d",
                "&:hover": { backgroundColor: "#F68633" },
                textTransform: "none",
              }}
            >
              Add Video
            </Button>
          </Stack>
        </Box>
      )}

      {/* Video List in Table Format */}
      {eventVideos && eventVideos.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Videos</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "233px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventVideos[0].videos.map((url, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <video
                      controls
                      width="100px"
                      height="100px"
                      style={{
                        borderRadius: "5px",
                        display: "block",
                      }}
                    >
                      <source src={url} type="video/mp4" />
                    </video>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteEventVideo(url)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No event videos available</Typography>
      )}

      {/* Edit Video Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Video Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Video Title"
            variant="outlined"
            value={eventData.video_title}
            onChange={(e) =>
              setEventData({ ...eventData, video_title: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Video Description"
            variant="outlined"
            value={eventData.video_description}
            onChange={(e) =>
              setEventData({ ...eventData, video_description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateEventVideo}
            variant="contained"
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Video</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            accept="video/*"
            onChange={(e) => setNewVideoFile(e.target.files[0])}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddVideo}
            variant="contained"
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
          >
            Add Video
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this video?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteVideo}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventVideos;
