const User = require("../models/User");
const Cafe = require("../models/Cafe");
const Activity = require("../models/Activity");
const Redemption = require("../models/Redemption");
const mongoose = require("mongoose");

/**
 * Helper to serialize MongoDB User document into Customer response format
 */
const formatCustomerUser = (user) => {
  const obj = user.toJSON ? user.toJSON() : user;
  const idStr = obj._id ? obj._id.toString() : obj.id;
  const memberships = Array.isArray(obj.cafes) ? obj.cafes : [];
  const normalizedMemberships = memberships.map((membership) => {
    const cafe =
      membership.cafeId && typeof membership.cafeId === "object"
        ? membership.cafeId
        : null;
    return {
      cafeId: cafe?._id?.toString() || membership.cafeId?.toString() || "",
      slug: cafe?.slug || "",
      name: cafe?.name || "",
      category: cafe?.category || "",
      logoImage: cafe?.logoImage || "",
      stampTarget: cafe?.stampTarget || 0,
      stamps: membership.stamps || 0,
      lifetimeStamps: membership.lifetimeStamps || 0,
      totalVisits: membership.totalVisits || 0,
      rewardsRedeemedCount: membership.rewardsRedeemedCount || 0,
      lastVisitDate: membership.lastVisitDate || null,
    };
  });
  const membershipLifetimeStamps = normalizedMemberships.reduce(
    (total, membership) => total + membership.lifetimeStamps,
    0
  );
  const membershipVisits = normalizedMemberships.reduce(
    (total, membership) => total + membership.totalVisits,
    0
  );
  const membershipRedemptions = normalizedMemberships.reduce(
    (total, membership) => total + membership.rewardsRedeemedCount,
    0
  );
  const totalRewardsRedeemed = membershipRedemptions || obj.redeemedRewards || 0;
  const lastVisitDate = normalizedMemberships
    .map((membership) => membership.lastVisitDate)
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0] || null;

  return {
    id: idStr,
    _id: idStr,
    name: obj.name,
    email: obj.email,
    phone: obj.phone || "",
    avatar: obj.avatar || "",
    code: obj.qrCode || `Notch-${idStr.slice(-4).toUpperCase()}`,
    qrCode: obj.qrCode || "",
    role: obj.role,
    status: obj.isActive ? "active" : "suspended",
    isActive: obj.isActive,
    registeredDate: obj.createdAt
      ? new Date(obj.createdAt).toISOString().split("T")[0]
      : "",
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    totalStamps: obj.totalStamps ?? membershipLifetimeStamps,
    totalLifetimeStamps: membershipLifetimeStamps || obj.totalStamps || 0,
    lifetimeStamps: membershipLifetimeStamps || obj.totalStamps || 0,
    stamps: normalizedMemberships.reduce((total, membership) => total + membership.stamps, 0),
    availableRewards: obj.availableRewards ?? 0,
    redeemedRewards: totalRewardsRedeemed,
    rewardsRedeemedCount: totalRewardsRedeemed,
    totalRewardsRedeemed,
    joinedCafes: normalizedMemberships.map((membership) => membership.slug).filter(Boolean),
    joinedCafesCount: normalizedMemberships.length,
    memberships: normalizedMemberships,
    totalVisits: membershipVisits,
    lastVisitDate,
  };
};

/**
 * @desc    Get all registered customers (role === 'user') (Admin only)
 * @route   GET /api/admin/customers
 * @access  Protected (Admin)
 */
const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .populate("cafes.cafeId", "name slug category logoImage stampTarget")
      .sort({ createdAt: -1 });

    const formattedCustomers = users.map(formatCustomerUser);

    return res.status(200).json({
      success: true,
      count: formattedCustomers.length,
      data: {
        customers: formattedCustomers,
      },
    });
  } catch (error) {
    console.error("[Admin Customers] GetAllCustomers error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching customers.",
    });
  }
};

/**
 * @desc    Get single customer by ID (Admin only)
 * @route   GET /api/admin/customers/:id
 * @access  Protected (Admin)
 */
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, role: "user" })
      .select("-password")
      .populate("cafes.cafeId", "name slug category logoImage stampTarget");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const activities = await Activity.find({ customerId: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("cafeId", "name")
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        customer: formatCustomerUser(user),
        activities: activities.map((activity) => ({
          id: activity._id.toString(),
          type: activity.type,
          title: activity.title,
          cafeName: activity.cafeId?.name || "",
          staffName: activity.staffName || "",
          note: activity.note || "",
          stampsDelta: activity.stampsDelta || 0,
          timestamp: activity.createdAt,
          formattedDate: activity.createdAt
            ? new Date(activity.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : "",
        })),
      },
    });
  } catch (error) {
    console.error("[Admin Customers] GetCustomerById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching customer details.",
    });
  }
};

/**
 * @desc    Update customer status (active / suspended) (Admin only)
 * @route   PATCH /api/admin/customers/:id/status
 * @access  Protected (Admin)
 */
const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["active", "suspended", "inactive"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const user = await User.findOne({ _id: id, role: "user" });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    user.isActive = status === "active";
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Customer status updated to ${status}.`,
      data: {
        customer: formatCustomerUser(user),
      },
    });
  } catch (error) {
    console.error("[Admin Customers] UpdateCustomerStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating customer status.",
    });
  }
};

/**
 * @desc    Delete a customer account and its loyalty records (Admin only)
 * @route   DELETE /api/admin/customers/:id
 */
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid customer ID.",
    });
  }

  let session;
  let customerNotFound = false;

  try {
    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const customer = await User.findOne({ _id: id, role: "user" }).session(session);
      if (!customer) {
        customerNotFound = true;
        return;
      }

      await Activity.deleteMany({ customerId: customer._id }, { session });
      await Redemption.deleteMany({ customerId: customer._id }, { session });

      const cafes = await Cafe.find({ "customers.userId": customer._id }).session(session);
      for (const cafe of cafes) {
        cafe.customers = cafe.customers.filter(
          (membership) => membership.userId.toString() !== customer._id.toString()
        );
        cafe.customerCount = cafe.customers.length;
        await cafe.save({ session });
      }

      await User.deleteOne({ _id: customer._id, role: "user" }, { session });
    });

    if (customerNotFound) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer account and loyalty records were deleted.",
    });
  } catch (error) {
    console.error("[Admin Customers] DeleteCustomer error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete customer and their records. Check the database and try again.",
    });
  } finally {
    if (session) await session.endSession();
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  deleteCustomer,
};
