const express = require('express');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Store Rating Platform API is running',
    timestamp: new Date().toISOString(),
  });
}));

module.exports = router;
