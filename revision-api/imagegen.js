const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "sk-proj-f0M7ysFxD8NxlHaYRQbST3BlbkFJmP1NwGx4YYJe9SSAyGbB";

/**
 * Generate an image from a prompt using OpenAI's DALL·E API (lightweight model).
 * Returns the image URL (for DALL·E 3) or base64 (for DALL·E 2).
 */
async function generateImage(prompt) {
  const response = await axios.post(
    "https://api.openai.com/v1/images/generations",
    {
      model: "dall-e-2", // Use dall-e-2 for lightweight, dall-e-3 for best quality
      prompt,
      n: 1,
      size: "512x512",
      response_format: "url"
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  // For dall-e-2: response.data.data[0].url
  return response.data.data[0].url;
}

module.exports = { generateImage };
