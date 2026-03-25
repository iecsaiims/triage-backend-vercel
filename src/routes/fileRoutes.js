const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { sendStoredFile } = require("../services/storageService");

// GET /api/files/:filename
router.get("/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const fileWasSent = await sendStoredFile(filename, res);

    if (!fileWasSent) {
      return res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Failed to fetch file:", error);
    return res.status(500).json({ error: "File fetch failed" });
  }
});

module.exports = router;
