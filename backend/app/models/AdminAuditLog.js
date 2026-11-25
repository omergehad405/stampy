const mongoose = require("mongoose");

const adminAuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    adminName: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      method: String,
      path: String,
      statusCode: Number,
      resourceId: String,
      cafeId: String,
      planId: String,
    },
  },
  { timestamps: true }
);

adminAuditLogSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.timestamp = ret.createdAt;
    delete ret.__v;
    return ret;
  },
});

adminAuditLogSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.AdminAuditLog ||
  mongoose.model("AdminAuditLog", adminAuditLogSchema);
