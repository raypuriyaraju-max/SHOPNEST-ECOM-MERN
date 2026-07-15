const express = require("express");
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getAdminStatus } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", protect, admin, getAdminStatus);

module.exports = router;