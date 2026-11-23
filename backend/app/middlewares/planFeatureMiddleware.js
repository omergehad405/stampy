const mongoose = require("mongoose");
const Cafe = require("../models/Cafe");
const { Plan } = require("../models/Plan");

const CAFE_STAFF_ROLES = ["cafeOwner", "cafeManager", "cafeBarista"];

const resolveCafe = async (user) => {
  if (!user || !CAFE_STAFF_ROLES.includes(user.role)) return null;

  if (user.cafeId) {
    const cafe = await Cafe.findById(user.cafeId);
    if (cafe) return cafe;
  }

  if (user.role === "cafeOwner") {
    return Cafe.findOne({
      $or: [
        { "owner.userId": user._id },
        { "owner.email": String(user.email || "").toLowerCase() },
      ],
    });
  }

  return null;
};

const getCafePlan = async (cafe) => {
  const planId = cafe?.subscriptionPlanId;
  if (!planId) return null;

  if (mongoose.isValidObjectId(planId)) {
    const plan = await Plan.findById(planId);
    if (plan) return plan;
  }

  const name = String(planId).replace(/^plan-/, "");
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Plan.findOne({ name: new RegExp(`^${escapedName}$`, "i") });
};

const isSubscriptionCurrent = (cafe, plan) => {
  if (
    !cafe ||
    !plan ||
    cafe.isActive === false ||
    cafe.status !== "active" ||
    plan.isActive === false ||
    !["active", "trial"].includes(cafe.subscriptionStatus || "active")
  ) {
    return false;
  }

  let expiryDate = cafe.subscriptionExpiry
    ? new Date(cafe.subscriptionExpiry)
    : null;

  if (!expiryDate || Number.isNaN(expiryDate.getTime())) {
    const startDate = cafe.subscriptionStart || cafe.createdAt;
    if (!startDate) return false;

    expiryDate = new Date(startDate);
    if (Number.isNaN(expiryDate.getTime())) return false;

    if (plan.billingPeriod === "week") {
      expiryDate.setDate(expiryDate.getDate() + 7);
    } else if (plan.billingPeriod === "year") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }
  }

  return Date.now() <= expiryDate.getTime();
};

const cafeHasPlanFeature = async (cafe, featureKey) => {
  const plan = await getCafePlan(cafe);
  if (!isSubscriptionCurrent(cafe, plan)) return false;

  return (plan.features || []).some(
    (feature) =>
      typeof feature === "string" &&
      feature.trim().toLowerCase().replace(/[\s-]+/g, "_") === featureKey
  );
};

const requireCafeFeature = (featureKey) => async (req, res, next) => {
  try {
    const cafe = await resolveCafe(req.user);
    if (!cafe) {
      return res.status(403).json({
        success: false,
        message: "No cafe is associated with your account.",
      });
    }

    if (!(await cafeHasPlanFeature(cafe, featureKey))) {
      return res.status(403).json({
        success: false,
        code: "FEATURE_NOT_AVAILABLE",
        message:
          "This feature is not available on your current plan or the cafe subscription has expired. Upgrade your plan or contact support.",
      });
    }

    req.cafe = cafe;
    return next();
  } catch (error) {
    console.error("[Plan Feature] Entitlement check failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify feature access. Please try again later.",
    });
  }
};

module.exports = {
  cafeHasPlanFeature,
  requireCafeFeature,
};
