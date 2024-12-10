const express = require('express');
const router = express.Router();

// Example route for shape generation
router.post('/generate', (req, res) => {
  const { shapeType } = req.body;

  // Call your shape generation logic here
  const generatedShape = `Generated shape: ${shapeType}`;
  res.json({ success: true, data: generatedShape });
});

module.exports = router;
