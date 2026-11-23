const express = require("express");
const {
  countRecipients,
  getCampaignHistory,
  getCampaignStatus,
  sendCampaign,
  unsubscribeFromCafe,
} = require("../controllers/dashboardNotificationController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { requireCafeFeature } = require("../middlewares/planFeatureMiddleware");

const router = express.Router();

router.post("/unsubscribe/:token", unsubscribeFromCafe);

router.use(
  protect,
  authorize("cafeOwner", "cafeManager", "cafeBarista"),
  requireCafeFeature("notifications")
);

router.get("/email/recipients", countRecipients);
router.get("/email/campaigns", getCampaignHistory);
router.get("/email/campaigns/:campaignId", getCampaignStatus);
router.post("/email", sendCampaign);

module.exports = router;
