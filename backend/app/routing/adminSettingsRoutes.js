const express = require("express");
const {
  getAdminSettings,
  updateAdminSettings,
} = require("../controllers/adminSettingsController");
const { authorize, protect } = require("../middlewares/authMiddleware");
const adminAuditMiddleware = require("../middlewares/adminAuditMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"), adminAuditMiddleware);
router.get("/", getAdminSettings);
router.put("/", updateAdminSettings);

module.exports = router;
