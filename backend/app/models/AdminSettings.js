const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "platform",
    },
    platformName: { type: String, default: "Notch", trim: true },
    platformTagline: {
      type: String,
      default: "Digital Loyalty Cards for Modern Cafes",
      trim: true,
    },
    platformEmail: { type: String, default: "support@notch.app", trim: true },
    logoUrl: { type: String, default: "", trim: true },
    allowPublicCafeRegistration: { type: Boolean, default: true },
    allowPublicCustomerRegistration: { type: Boolean, default: true },
    defaultStampTarget: { type: Number, default: 10, min: 1 },
    defaultEnforceDailyVisit: { type: Boolean, default: true },
    defaultSubscriptionPlanId: { type: String, default: "plan-free", trim: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

adminSettingsSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

module.exports =
  mongoose.models.AdminSettings ||
  mongoose.model("AdminSettings", adminSettingsSchema);
