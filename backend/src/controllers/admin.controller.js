const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.json({ success: true, data: stats });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  res.json({ success: true, ...result });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

const createStore = asyncHandler(async (req, res) => {
  const store = await adminService.createStore(req.body);
  res.status(201).json({ success: true, data: store });
});

const listStores = asyncHandler(async (req, res) => {
  const result = await adminService.listStores(req.query);
  res.json({ success: true, ...result });
});

module.exports = {
  getDashboard,
  createUser,
  listUsers,
  getUserById,
  createStore,
  listStores,
};
