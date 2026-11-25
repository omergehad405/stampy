const mongoose = require("mongoose");

const scanAttemptSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      default: null,
      index: true,
    },
    cafeSlug: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    source: {
      type: String,
      enum: ["self_scan", "cafe_manual"],
      required: true,
    },
    result: {
      type: String,
      enum: ["awarded", "daily_limit", "card_full", "rejected"],
      required: true,
    },
    code: {
      type: String,
      default: "",
      maxlength: 80,
    },
  },
  { timestamps: true }
);

scanAttemptSchema.index({ cafeId: 1, customerId: 1, createdAt: -1 });

module.exports =
  mongoose.models.ScanAttempt ||
  mongoose.model("ScanAttempt", scanAttemptSchema);
