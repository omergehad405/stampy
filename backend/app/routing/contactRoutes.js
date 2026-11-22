const express = require("express");
const router = express.Router();
const { submitContactInquiry } = require("../controllers/contactController");

// POST /api/contact - Submit public cafe inquiry
router.post("/", submitContactInquiry);

module.exports = router;
