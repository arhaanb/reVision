const axios = require("axios");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAIKEY;

const systemPrompt = `You are an expert web developer and designer who specializes in tailwind css and ui design. 
A user will provide you with a low-fidelity wireframe of an application. Make the design structure as close to the wireframe provided. You can add border radius, opacity, colours, etc. to make the design look better.
You will return a single html file that uses HTML, tailwind css, and JavaScript to create a high fidelity website.
Include any extra CSS and JavaScript in the html file.
If there are any images it is IMPORTANT to use a placeholder as an <img> tag itself with a unique id for the image tags. 
The user will provide you with notes in text, arrows, or drawings.
The user may also include images of other websites as style references. Transfer the styles as best as you can, matching fonts / colors / layouts.
They may also provide you with the html of a previous design that they want you to iterate from.
Carry out any changes they request from you.
In the wireframe, the previous design's html will appear as a white rectangle.
Use creative license to make the application more fleshed out.
Use JavaScript modules and unpkg to import any necessary dependencies.
If no content is mentioned in the wireframe, generate all the content yourself which relates to the theme and design properly. Make it high quality content.
for any images, keep the src empty and add placeholders. Add a random unique 5 character ID to the image tag to identify it.
IT IS VERY IMPORTANT TO ADD LUCIDE ICONS FROM THE WIREFRAME TO THE HTML. Use lucide icons to add any icons to the html. Embed this script at the bottom of the body to use it. Make sure lucide icons are rendered properly and correctly with the colour, width, etc. Make sure you don't render custom svg and use lucide icons only. DO NOT TRY TO GENERATE YOUR OWN SVG, PLEASE USE LUCIDE ICONS.

<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
  });
</script>
</body>

After the HTML, output a JSON array on a new line containing objects with the description and id for each image placeholder you added. The JSON must be valid and appear after the HTML. Example:
<html>...your html here...</html>
[
  { "description": "A golfer taking a swing on a sunny day with a clear sky.", "id": "abc12" },
  { "description": "A golf course with mountains in the background.", "id": "def34" }
]
Respond ONLY with the HTML and JSON, nothing else.

for a golf themed app, use the following images 
https://i.ibb.co/gZxJKF2s/golf2.png
https://i.ibb.co/7xGCGzfn/golf1.png as src please only. even if there are many images, you can alternate between them`;

async function generateUI({ image, colourPalette, theme, details }) {
  // console.log({ image });
  const userPrompt = `Here is the Colour palette: ${JSON.stringify(
    colourPalette
  )}\nTheme: ${theme}\n Use these colours for the UI, make sure readability is kept in mind while making it look good with these colours. Use fonts from fontshare.com. Make sure you write content for the design and not just example/sample content. Use Tailwind CSS. Generate a beautiful, modern UI as a single HTML file. ${
    details ? `\nExtra information: ${details}` : ""
  }`;
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high",
              },
            },
            {
              type: "text",
              text: userPrompt,
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  // Split the model output into HTML and JSON
  let htmlPart = response.data.choices[0].message.content;
  let jsonPart = null;
  const splitMatch = htmlPart.match(/([\s\S]*<\/html>)([\s\S]*)/i);
  if (splitMatch) {
    htmlPart = splitMatch[1];
    jsonPart = splitMatch[2].trim();
  }

  // Parse and print the JSON if present
  if (jsonPart) {
    try {
      // Remove code block markers if present
      let cleanedJson = jsonPart
        .replace(/^\s*```(?:json)?/i, "")
        .replace(/```\s*$/, "")
        .trim();
      const revisionImages = JSON.parse(cleanedJson);
      console.log("Revision image objects:", revisionImages);
    } catch (e) {
      console.warn("Could not parse revision image JSON:", e, jsonPart);
    }
  }
  return htmlPart;
}

const cheerio = require("cheerio");
const { generateImage } = require("./imagegen");

module.exports = { generateUI };

// // Patch: update generateUI to embed generated images
// const originalGenerateUI = module.exports.generateUI;
// module.exports.generateUI = async function (args) {
//   let htmlPart = await originalGenerateUI(args);
//   // Try to extract the JSON again for image prompts/ids
//   const jsonMatch = htmlPart.match(/<\/html>([\s\S]*)$/i);
//   let revisionImages = [];
//   if (jsonMatch) {
//     let jsonPart = jsonMatch[1].trim();
//     try {
//       let cleanedJson = jsonPart
//         .replace(/^\s*```(?:json)?/i, "")
//         .replace(/```[\s\S]*$/, "")
//         .trim();
//       revisionImages = JSON.parse(cleanedJson);
//     } catch (e) {
//       // If not found, ignore
//     }
//     // Remove JSON from htmlPart
//     htmlPart = htmlPart.replace(jsonMatch[1], "");
//   }
//   if (revisionImages.length > 0) {
//     const $ = cheerio.load(htmlPart);
//     for (const imgObj of revisionImages) {
//       if (!imgObj.id || !imgObj.description) continue;
//       try {
//         const imgUrl = await generateImage(imgObj.description);
//         $(`img#${imgObj.id}`).attr("src", imgUrl);
//       } catch (e) {
//         // If image generation fails, leave src empty
//       }
//     }
//     htmlPart = $.html();
//   }
//   return htmlPart;
// };
