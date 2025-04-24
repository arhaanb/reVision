"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // widget-src/helpers.ts
  var OPENAI_API_KEY = "sk-proj-f0M7ysFxD8NxlHaYRQbST3BlbkFJmP1NwGx4YYJe9SSAyGbB";

  // widget-src/code.tsx
  var { widget } = figma;
  var { useEffect, Text, AutoLayout, useSyncedState } = widget;
  var systemPrompt = `You are an expert web developer who specializes in tailwind css.
A user will provide you with a low-fidelity wireframe of an application. 
You will return a single html file that uses HTML, tailwind css, and JavaScript to create a high fidelity website.
Include any extra CSS and JavaScript in the html file.
If you have any images, load them from Unsplash or use solid colored retangles.
The user will provide you with notes in text, arrows, or drawings.
The user may also include images of other websites as style references. Transfer the styles as best as you can, matching fonts / colors / layouts.
They may also provide you with the html of a previous design that they want you to iterate from.
Carry out any changes they request from you.
In the wireframe, the previous design's html will appear as a white rectangle.
Use creative license to make the application more fleshed out.
Use JavaScript modules and unkpkg to import any necessary dependencies.

Respond ONLY with the contents of the html file.`;
  function getHtmlFromOpenAI(_0) {
    return __async(this, arguments, function* ({
      image
    }) {
      const body = {
        model: "gpt-4o",
        max_tokens: 4096,
        temperature: 0,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: image,
                  detail: "high"
                }
              },
              {
                type: "text",
                text: "Turn this into a single html file using tailwind."
              }
            ]
          }
        ]
      };
      let json = null;
      if (!OPENAI_API_KEY) {
        throw Error("You need to provide an OpenAI API key.");
      }
      try {
        const resp = yield fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(body)
          }
        );
        json = yield resp.json();
      } catch (e) {
        console.log(e);
      }
      if (json !== null) {
        return json;
      } else {
        throw new Error("Failed to get response from OpenAI API");
      }
    });
  }
  function Widget() {
    const [loading, setLoading] = useSyncedState("loading", false);
    const makeReal = () => __async(null, null, function* () {
      if (!loading) {
        console.log("makeReal: Triggered");
        if (figma.currentPage.selection.length === 0) {
          console.log("makeReal: No selection found");
          figma.notify("Make a selection first.");
          return;
        }
        setLoading(true);
        console.log("makeReal: Loading set to true");
        console.log("makeReal: Grouping selection and exporting as PNG");
        let group = figma.group(figma.currentPage.selection, figma.currentPage);
        let bytes;
        try {
          bytes = yield group.exportAsync({
            format: "PNG",
            constraint: { type: "SCALE", value: 1 }
          });
          console.log("makeReal: Exported selection to PNG");
        } catch (err) {
          console.error("makeReal: Error exporting selection", err);
          setLoading(false);
          return;
        }
        figma.ungroup(group);
        console.log("makeReal: Ungrouped selection");
        console.log("makeReal: Converting PNG bytes to base64");
        let base64 = figma.base64Encode(bytes);
        base64 = "data:image/png;base64," + base64;
        console.log("makeReal: Converted image to base64");
        try {
          const response = yield fetch("http://localhost:8080/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: base64 })
          });
          figma.notify("Image uploaded successfully!");
        } catch (err) {
          figma.notify("Failed to upload image");
          console.error("makeReal: Network error uploading image", err);
        }
        setLoading(false);
        console.log("makeReal: Loading set to false");
      }
    });
    useEffect(() => {
      figma.ui.onmessage = (msg) => {
        if (msg.type === "resize") {
          figma.ui.resize(msg.size.width, msg.size.height);
        }
      };
    });
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        width: 256,
        height: 40,
        horizontalAlignItems: "center",
        verticalAlignItems: "center",
        cornerRadius: 13,
        fill: loading ? "#D9D9D9" : "#FF9800",
        onClick: () => new Promise((resolve) => {
          makeReal();
        })
      },
      /* @__PURE__ */ figma.widget.h(Text, { fontSize: 12, fontWeight: 500, fill: "#fff" }, loading ? "Loading..." : "\u2728 Import to reVision")
    );
  }
  widget.register(Widget);
})();
