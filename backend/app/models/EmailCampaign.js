const mongoose = require("mongoose");

const emailCampaignSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    recipientsCount: {
      type: Number,
      default: 0,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["sending", "done", "stopped"],
      default: "sending",
      index: true,
    },
  },
  { timestamps: true }
);

emailCampaignSchema.index(
  { cafeId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "sending" },
  }
);

emailCampaignSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.body;
    return ret;
  },
});

module.exports =
  mongoose.models.EmailCampaign ||
  mongoose.model("EmailCampaign", emailCampaignSchema);
