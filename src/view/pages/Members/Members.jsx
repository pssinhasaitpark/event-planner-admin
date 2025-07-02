import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  // fetchMembersData,
  saveMembersToBackend,
} from "../../redux/slice/membersSlice";
// import debounce from "lodash.debounce";

const Members = () => {
  const dispatch = useDispatch();
  const membersData = useSelector((state) => state.members) || {};
  const editor = useRef(null);

  const [title, setTitle] = useState("Members");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleImageRemove = (index) => {
    const imageToRemove = selectedImages[index];

    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }

    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();

    if (isEditable) {
      const membersDataToSend = {
        title,
        description: description?.trim() || "No description provided",
        images: selectedImages,
        removeImages: removeImages.length > 0 ? removeImages : [],
      };

      try {
        await dispatch(
          saveMembersToBackend({
            id: membersData._id,
            membersData: membersDataToSend,
          })
        );
        setRemoveImages([]);
      } catch (error) {
        console.error("Error saving/updating data: ", error);
      }
    }

    setIsEditable(!isEditable);
  };

  const renderImageSource = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string") {
      return image;
    }
    return "";
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleEditSave}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditable}
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Description
          </Typography>
          {/* <JoditEditor
            ref={editor}
            value={description}
            config={{ readonly: !isEditable }}
            onChange={(newContent) => setDescription(newContent?.trim() || "")}
          /> */}
          <JoditEditor
            ref={editor}
            value={description}
            config={{
              readonly: !isEditable,
              placeholder: "Write about Atal's life...",
              height: 400,
              cleanOnPaste: false, // Retain styles when pasting
              cleanOnChange: false, // Retain the HTML structure while editing
              toolbar: {
                items: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "eraser",
                  "|",
                  "font",
                  "fontsize",
                  "paragraph",
                  "|",
                  "align",
                  "outdent",
                  "indent",
                  "|",
                  "link",
                  "image",
                  "video",
                  "table",
                  "line",
                  "code",
                  "fullsize",
                  "undo",
                  "redo",
                ],
              },
              uploader: {
                insertImageAsBase64URI: true,
                url: "/upload", // Define your upload endpoint
                format: "json",
              },
            }}
            style={{ width: "100%", minHeight: "200px" }}
            onChange={(newContent) => setDescription(newContent?.trim() || "")}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Upload Profile Images
          </Typography>

          {isEditable && (
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginBottom: "1rem" }}
            />
          )}

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", mt: 2 }}>
            {selectedImages.map((image, index) => (
              <Box key={index} sx={{ position: "relative" }}>
                <Avatar
                  src={renderImageSource(image)}
                  sx={{ width: 100, height: 100 }}
                />
                {isEditable && (
                  <IconButton
                    onClick={() => handleImageRemove(index)}
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: "white",
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button type="submit" variant="contained">
              {isEditable ? "Save" : "Edit"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Members;
