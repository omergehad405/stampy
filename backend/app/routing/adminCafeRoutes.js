const express = require("express");
const {
  getAllCafes,
  getCafeByIdentifier,
  createCafe,
  updateCafeStatus,
  updateCafe,
  deleteCafe,
} = require("../controllers/adminCafeController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const adminAuditMiddleware = require("../middlewares/adminAuditMiddleware");

const router = express.Router();

// All routes here require active authentication and the 'admin' global role
router.use(protect, authorize("admin"), adminAuditMiddleware);

router.get("/", getAllCafes);
router.get("/:id", getCafeByIdentifier);
router.post("/", createCafe);
router.patch("/:id/status", updateCafeStatus);
router.put("/:id", updateCafe);
router.delete("/:id", deleteCafe);

module.exports = router;
