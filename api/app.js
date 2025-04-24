const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { generateUI } = require("./openai");

const app = express();
const PORT = 8080;
const IMAGE_FILE = path.join(__dirname, "image.txt");

app.use(cors()); // Enable CORS for all origins
app.use(express.json({ limit: "50mb" })); // Increased limit for large base64 payloads

// POST /upload - expects { "image": "<base64-png>" }
app.post("/upload", (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /upload request received`);
  const { image } = req.body;
  if (!image || typeof image !== "string") {
    return res.status(400).json({ error: "Image base64 string required" });
  }
  // Optionally validate PNG base64
  if (!image.startsWith("data:image/png;base64,")) {
    return res.status(400).json({ error: "Must be a base64 PNG image" });
  }
  fs.writeFile(IMAGE_FILE, image, (err) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] Error saving image:`, err);
      return res.status(500).json({ error: "Failed to save image" });
    }
    console.log(`[${new Date().toISOString()}] Image saved successfully`);
    res.json({ message: "Image saved successfully" });
  });
});

// GET /image - returns { "image": "<base64-png>" }
app.get("/image", (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /image request received`);
  fs.readFile(IMAGE_FILE, "utf8", (err, data) => {
    if (err) {
      console.warn(`[${new Date().toISOString()}] No image found to return`);
      return res.status(404).json({ error: "No image found" });
    }
    console.log(`[${new Date().toISOString()}] Image returned successfully`);
    res.json({ image: data });
  });
});

// POST /generate-ui - expects { image: <base64>, colourPalette: [<color>], theme: <string> }
app.post("/generate-ui", async (req, res) => {
  console.log(
    `[${new Date().toISOString()}] POST /generate-ui request received`
  );
  const { image, colourPalette, theme } = req.body;
  if (!image || typeof image !== "string") {
    return res.status(400).json({ error: "Image (base64 string) required" });
  }

  if (!theme || typeof theme !== "string") {
    return res.status(400).json({ error: "theme (string) required" });
  }
  try {
    const html = await generateUI({ image, colourPalette, theme });
    res.send(html);
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error generating UI:`,
      err.response?.data || err.message
    );
    res.status(500).json({
      error: "Failed to generate UI",
      details: err.response?.data || err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
