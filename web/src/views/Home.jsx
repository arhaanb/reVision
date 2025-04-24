import { useState } from "react";
import figmaLogo from "../assets/figma-logo.svg";
import logoVision from "../assets/logo-vision.svg";
import axios from "axios";
import ThemeSelector from "../components/ThemeSelector";
import ColorPickerSection from "../components/ColorPickerSection";
import DetailsAndGenerate from "../components/DetailsAndGenerate";
import { generatePalette } from "../utils/colorUtils";
import { Import, Upload } from "lucide-react";
import JSZip from "jszip";

export default function Home() {
  const [count, setCount] = useState(0);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");

  // For Figma image loading state
  const [loadingFigma, setLoadingFigma] = useState(false);

  // Theme selection state
  const [selectedTheme, setSelectedTheme] = useState(null);
  // Color selection state
  const [selectedColor, setSelectedColor] = useState("#561ecb");
  // Palette state
  const [palette, setPalette] = useState(generatePalette("#561ecb"));
  // Loading state for generation
  const [generating, setGenerating] = useState(false);
  // Generated HTML response
  const [generatedHtml, setGeneratedHtml] = useState("");

  // Helper to parse markdown-style code block from response
  function extractHtmlFromResponse(response) {
    if (!response) return "";
    // Remove markdown code block markers if present
    let trimmed = response.trim();
    if (trimmed.startsWith("```html")) {
      trimmed = trimmed.slice(7);
    }
    if (trimmed.endsWith("```")) {
      trimmed = trimmed.slice(0, -3);
    }
    return trimmed.trim();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
    } else {
      setImage(null);
      setImageName("");
    }
  };

  const handleFigmaImport = async () => {
    setLoadingFigma(true);
    try {
      const res = await axios.get("http://localhost:8080/image");
      const base64 = res.data.image;
      console.log(base64);
      setImage(`${base64}`);
      setImageName("Figma Imported Image");
    } catch (err) {
      alert("Could not import image from Figma: " + (err.message || err));
    } finally {
      setLoadingFigma(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center  py-10 px-4">
      <div className="bg-white border border-orange-100 shadow-sm p-6 w-full max-w-md flex flex-col items-center">
        <img src={logoVision} alt="Vision Logo" className="w-[50%] mb-8 mt-4" />
        <div className="flex flex-col sm:flex-row gap-4 w-full mb-4">
          <label className="flex-1 flex flex-col items-center px-3 py-4 bg-orange-50 text-orange-700 border border-orange-100 rounded-md cursor-pointer hover:bg-orange-100 transition">
            <Import className="w-8 h-8 mb-2 text-orange-400" />
            <span className="font-medium">Import Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handleFigmaImport}
            disabled={loadingFigma}
            className="flex-1 flex-col items-center justify-center gap-2 px-3 py-4 bg-orange-50 text-orange-700 border border-orange-100 rounded-md hover:bg-orange-100 transition font-medium focus:outline-none disabled:opacity-60"
          >
            <p className="text-center flex items-center justify-center mb-2">
              <img src={figmaLogo} alt="Figma logo" className="w-6 h-6" />
            </p>
            {loadingFigma ? "Loading..." : "Import from Figma"}
          </button>
        </div>
        {image && (
          <>
            <div className="w-full flex flex-col items-center mt-2">
              <img
                src={image}
                alt="Imported Preview"
                className="rounded-xl shadow-md max-h-64 object-contain border border-gray-200"
              />
              <span className="mt-2 text-xs text-orange-400">{imageName}</span>
            </div>
            <ThemeSelector
              selected={selectedTheme}
              onSelect={setSelectedTheme}
            />
            {selectedTheme && (
              <ColorPickerSection
                onColorChange={(color) => {
                  setSelectedColor(color);
                  setPalette(generatePalette(color));
                }}
              />
            )}
            {selectedTheme && selectedColor && (
              <DetailsAndGenerate
                generating={generating}
                onGenerate={async (details) => {
                  setGenerating(true);
                  try {
                    // Prepare palette array
                    // Send the entire palette object
                    const paletteObj = palette;
                    // Prepare image as base64 (if not already)
                    let imageBase64 = image;
                    let mimeType = "image/png";
                    if (image && !image.startsWith("data:")) {
                      // If image is not a data URL, fetch and convert
                      const res = await fetch(image);
                      const blob = await res.blob();
                      mimeType = blob.type || "image/png";
                      imageBase64 = await new Promise((r) => {
                        const reader = new FileReader();
                        reader.onloadend = () => r(reader.result.split(",")[1]);
                        reader.readAsDataURL(blob);
                      });
                    } else if (image && image.startsWith("data:")) {
                      // Extract MIME type from data URL
                      const match = image.match(/^data:(.*?);base64,/);
                      if (match && match[1]) mimeType = match[1];
                      imageBase64 = image.split(",")[1];
                    }
                    // Prepend the correct data URL prefix
                    const dataUrl = `data:${mimeType};base64,${imageBase64}`;
                    const response = await axios.post(
                      "http://localhost:8080/generate-ui",
                      {
                        image: dataUrl,
                        colourPalette: paletteObj,
                        theme: selectedTheme,
                        details,
                      }
                    );
                    setGeneratedHtml(extractHtmlFromResponse(response.data));
                  } catch (err) {
                    alert("Failed to generate UI: " + (err.message || err));
                  } finally {
                    setGenerating(false);
                  }
                }}
              />
            )}
          </>
        )}
      </div>
      {/* Render generated HTML in an iframe if available */}
      {generatedHtml && (
        <div className="w-full flex flex-col items-center mt-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Generated UI Preview
          </h2>
          <iframe
            id="generated-iframe"
            title="Generated UI Preview"
            srcDoc={generatedHtml}
            className="w-full max-w-5xl min-h-[700px] rounded-xl border shadow-lg bg-white"
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: "100%",
              minHeight: 700,
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "white",
            }}
          />
          {/* Right-aligned, modern Netlify deploy button */}
          <div className="w-full flex justify-end mt-4 pr-2 max-w-5xl">
            <button
              onClick={async () => {
                // Create a zip containing a folder 'project' with index.html inside
                const zip = new JSZip();
                zip.folder("project").file("index.html", generatedHtml);
                const content = await zip.generateAsync({ type: "blob" });
                const url = URL.createObjectURL(content);
                const link = document.createElement("a");
                link.href = url;
                link.download = "website.zip";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                // Open Netlify drop in new tab
                window.open('https://app.netlify.com/drop', '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-orange-600 hover:to-pink-600 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              style={{ textDecoration: 'none' }}
            >
              <Upload className="w-5 h-5 mr-1" />
              Get your website live now!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
