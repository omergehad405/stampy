const AdminSettings = require("../models/AdminSettings");

const SETTINGS_FIELDS = [
  "platformName",
  "platformTagline",
  "platformEmail",
  "logoUrl",
  "allowPublicCafeRegistration",
  "allowPublicCustomerRegistration",
  "defaultStampTarget",
  "defaultEnforceDailyVisit",
  "defaultSubscriptionPlanId",
  "maintenanceMode",
];

const getAdminSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      { key: "platform" },
      { $setOnInsert: { key: "platform" } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, data: { settings } });
  } catch (error) {
    console.error("[Admin Settings] Failed to load platform settings:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load platform settings right now. Please try again.",
    });
  }
};

const updateAdminSettings = async (req, res) => {
  const updates = {};
  const body = req.body || {};
  for (const field of SETTINGS_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
  }

  if (
    updates.platformName !== undefined &&
    (typeof updates.platformName !== "string" || !updates.platformName.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Platform name is required.",
    });
  }
  if (
    updates.platformEmail !== undefined &&
    (typeof updates.platformEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.platformEmail))
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid platform support email.",
    });
  }
  if (
    updates.defaultStampTarget !== undefined &&
    (!Number.isInteger(Number(updates.defaultStampTarget)) ||
      Number(updates.defaultStampTarget) < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "The default stamp target must be a positive whole number.",
    });
  }

  try {
    const settings = await AdminSettings.findOneAndUpdate(
      { key: "platform" },
      { $set: updates, $setOnInsert: { key: "platform" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({
      success: true,
      message: "Platform settings saved.",
      data: { settings },
    });
  } catch (error) {
    console.error("[Admin Settings] Failed to save platform settings:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to save platform settings right now. Please try again.",
    });
  }
};

module.exports = { getAdminSettings, updateAdminSettings };
