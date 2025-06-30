const express = require("express");
const path = require("path");
const fs = require("fs");
const upload = require("../config/multer");

const router = express.Router();

// Upload route
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({
    message: "File uploaded successfully",
    url: fileUrl,
  });
});

// Get image route
router.get("/:file", (req, res) => {
  const { file } = req.params;

  if (!file) {
    return res.status(400).json({ message: "No URL provided" });
  }

  // Extract filename from URL
  // const filename = url.split("/").pop();

  const filePath = path.join(__dirname, "../images", file);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      return res.status(404).json({ message: "Image not found" });
    }
  });
});
router.delete("/:file", (req, res) => {
  const { file } = req.params;

  if (!file) {
    return res.status(400).json({ message: "No URL provided" });
  }

  // Extract filename from URL
  // const filename = url.split("/").pop();

  const filePath = path.join(__dirname, "../images", file);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Error deleting image" });
      }

      res.status(200).json({ message: "Image deleted successfully" });
    });
  });
});

module.exports = router;
