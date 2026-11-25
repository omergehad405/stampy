const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  deleteCustomer,
} = require("../controllers/adminCustomerController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const adminAuditMiddleware = require("../middlewares/adminAuditMiddleware");

const router = express.Router();

// Require active authentication and 'admin' role
router.use(protect, authorize("admin"), adminAuditMiddleware);

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.patch("/:id/status", updateCustomerStatus);
router.delete("/:id", deleteCustomer);

module.exports = router;
