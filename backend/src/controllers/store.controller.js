const storeService = require('../services/store.service');
const asyncHandler = require('../utils/asyncHandler');

const listStores = asyncHandler(async (req, res) => {
  const result = await storeService.listStores(req.user.id, req.query);
  res.json({ success: true, ...result });
});

const submitRating = asyncHandler(async (req, res) => {
  const rating = await storeService.submitRating(
    req.user.id,
    req.params.id,
    req.body.rating
  );
  res.status(201).json({ success: true, data: rating });
});

const updateRating = asyncHandler(async (req, res) => {
  const rating = await storeService.updateRating(
    req.user.id,
    req.params.id,
    req.body.rating
  );
  res.json({ success: true, data: rating });
});

module.exports = { listStores, submitRating, updateRating };
