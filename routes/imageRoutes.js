const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager, FileState } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");

// Get the directory name for the current module
const __dirnames = path.resolve();
const mediaPath = path.join(__dirnames, "media");
// Example route for image generation
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    console.log(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Stream the generated content
    const result = await model.generateContentStream(prompt);

    let generatedImage = "";

    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        generatedImage += chunkText; // Append text to the final result
    }

    // Return the generated text
    res.json({ success: true, data: generatedImage });
} catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ success: false, message: "Failed to generate content", error: error.message });
}
});

module.exports = router;
