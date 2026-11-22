const express = require("express");
const { getPublicPlans } = require("../controllers/publicPlanController");

const router = express.Router();

// Read-only public plans route
router.get("/", getPublicPlans);

module.exports = router;
