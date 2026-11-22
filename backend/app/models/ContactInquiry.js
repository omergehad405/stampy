const mongoose = require("mongoose");

const contactInquirySchema = new mongoose.Schema(
  {
    cafeName: {
      type: String,
      required: [true, "Cafe name is required"],
      trim: true,
      maxlength: 120,
    },
    ownerName: {
      type: String,
      required: [true, "Owner/Manager name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    plan: {
      type: String,
      trim: true,
      default: "Growth",
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    emailError: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ContactInquiry =
  mongoose.models.ContactInquiry ||
  mongoose.model("ContactInquiry", contactInquirySchema);

module.exports = { ContactInquiry };
