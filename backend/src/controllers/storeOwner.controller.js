const storeOwnerService = require('../services/storeOwner.service');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await storeOwnerService.getDashboard(req.user.id);
  res.json({ success: true, data: dashboard });
});

const listRatings = asyncHandler(async (req, res) => {
  const result = await storeOwnerService.listRatings(req.user.id, req.query);
  res.json({ success: true, ...result });
});

module.exports = { getDashboard, listRatings };
