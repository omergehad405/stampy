const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const Cafe = require("../models/Cafe");
const ScanAttempt = require("../models/ScanAttempt");
const User = require("../models/User");

const getCafeDayKey = (date, timezone = "Africa/Cairo") => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const recordScanAttempt = async ({
  cafeId = null,
  cafeSlug = "",
  customerId = null,
  source,
  result,
  code = "",
}) =>
  ScanAttempt.create({
    cafeId,
    cafeSlug: String(cafeSlug || "").slice(0, 100),
    customerId,
    source,
    result,
    code: String(code || "").slice(0, 80),
  });

const resultResponse = (result, message, data = null, code) => ({
  result,
  message,
  data,
  code:
    code ||
    (result === "daily_limit"
      ? "DAILY_LIMIT"
      : result === "card_full"
        ? "CARD_FULL"
        : undefined),
  statusCode:
    result === "awarded"
      ? 200
      : result === "rejected"
        ? 400
        : 409,
});

const awardStamp = async ({
  cafeId,
  cafeSlug = "",
  customerId,
  source,
  staffName,
  note = "",
  stampsCount = 1,
  allowJoin = false,
  joinOnAward = false,
}) => {
  if (!mongoose.isValidObjectId(customerId)) {
    await recordScanAttempt({
      cafeId,
      cafeSlug,
      customerId: null,
      source,
      result: "rejected",
      code: "INVALID_CUSTOMER",
    });
    return resultResponse(
      "rejected",
      "Customer account was not found.",
      null,
      "INVALID_CUSTOMER"
    );
  }

  if (Number(stampsCount) !== 1) {
    await recordScanAttempt({
      cafeId,
      cafeSlug,
      customerId,
      source,
      result: "rejected",
      code: "ONE_STAMP_PER_VISIT",
    });
    return resultResponse(
      "rejected",
      "Only one stamp can be awarded per visit.",
      null,
      "ONE_STAMP_PER_VISIT"
    );
  }

  const session = await mongoose.startSession();
  let result;
  let message;
  let outcomeCode;
  let data;
  let attemptLogged = false;
  let dayKey = "";

  try {
    await session.withTransaction(async () => {
      result = undefined;
      message = undefined;
      outcomeCode = undefined;
      data = undefined;
      attemptLogged = false;

      const customer = await User.findById(customerId).session(session);
      const cafe = await Cafe.findById(cafeId).session(session);

      if (!customer || !cafe || !customer.isActive) {
        result = "rejected";
        message = "Customer account or cafe is unavailable.";
        outcomeCode = "CUSTOMER_OR_CAFE_UNAVAILABLE";
        return;
      }

      if (!cafe.isActive || cafe.status !== "active" ||
          ["cancelled", "past_due"].includes(cafe.subscriptionStatus)) {
        result = "rejected";
        message = "This cafe is unavailable.";
        outcomeCode = "CAFE_UNAVAILABLE";
        return;
      }

      const now = new Date();
      dayKey = getCafeDayKey(
        now,
        cafe.openingHours?.timezone || "Africa/Cairo"
      );
      const target = Math.max(1, Number(cafe.stampTarget) || 10);
      if (!Array.isArray(customer.cafes)) customer.cafes = [];
      const membershipIndex = (customer.cafes || []).findIndex(
        (membership) => membership.cafeId?.toString() === cafe._id.toString()
      );
      let membership =
        membershipIndex >= 0 ? customer.cafes[membershipIndex] : null;

      if (!membership && !allowJoin) {
        result = "rejected";
        message = "Join this cafe’s loyalty program to collect a stamp.";
        outcomeCode = "JOIN_REQUIRED";
        return;
      }

      if (membership && Number(membership.stamps || 0) >= target) {
        result = "card_full";
        message = "Your card is complete, redeem your reward at the counter.";
        outcomeCode = "CARD_FULL";
        return;
      }

      const lastVisitDay = membership?.lastVisitDate
        ? getCafeDayKey(
            new Date(membership.lastVisitDate),
            cafe.openingHours?.timezone || "Africa/Cairo"
          )
        : null;
      if (lastVisitDay === dayKey) {
        result = "daily_limit";
        message = "You already got today’s stamp. Come back tomorrow.";
        outcomeCode = "DAILY_LIMIT";
        return;
      }

      const existingStamp = await Activity.findOne({
        cafeId: cafe._id,
        customerId: customer._id,
        type: "stamp",
        stampDay: dayKey,
      }).session(session);

      if (existingStamp) {
        result = "daily_limit";
        message = "You already got today’s stamp. Come back tomorrow.";
        outcomeCode = "DAILY_LIMIT";
        return;
      }

      const createdMembership = !membership;
      const stampAwardId = new mongoose.Types.ObjectId().toString();
      if (!membership) {
        customer.cafes.push({
          cafeId: cafe._id,
          joinedAt: now,
          stamps: 0,
          totalVisits: 0,
          lifetimeStamps: 0,
          rewardsRedeemedCount: 0,
          lastVisitDate: null,
        });
        membership = customer.cafes[customer.cafes.length - 1];
        customer.joinedCafes = customer.cafes.length;
      }

      membership.stamps = (membership.stamps || 0) + 1;
      membership.totalVisits = (membership.totalVisits || 0) + 1;
      membership.lifetimeStamps = (membership.lifetimeStamps || 0) + 1;
      membership.lastVisitDate = now;
      customer.totalStamps = (customer.totalStamps || 0) + 1;

      if (!Array.isArray(cafe.customers)) cafe.customers = [];
      const cafeMembership = cafe.customers.find(
        (entry) => entry.userId?.toString() === customer._id.toString()
      );
      if (cafeMembership) {
        cafeMembership.stamps = membership.stamps;
        cafeMembership.totalVisits = membership.totalVisits;
        cafeMembership.lifetimeStamps = membership.lifetimeStamps;
        cafeMembership.lastVisitDate = now;
        cafeMembership.status = "active";
      } else {
        cafe.customers.push({
          userId: customer._id,
          joinedAt: membership.joinedAt || now,
          stamps: membership.stamps,
          totalVisits: membership.totalVisits,
          lifetimeStamps: membership.lifetimeStamps,
          rewardsRedeemedCount: membership.rewardsRedeemedCount || 0,
          lastVisitDate: now,
          status: "active",
        });
        cafe.customerCount = cafe.customers.length;
      }

      cafe.totalStampsIssued = (cafe.totalStampsIssued || 0) + 1;

      await customer.save({ session });
      await cafe.save({ session });

      if (joinOnAward && createdMembership) {
        await Activity.create(
          [{
            cafeId: cafe._id,
            type: "join",
            title: "New Member Enrolled",
            customerName: customer.name,
            customerId: customer._id,
            stampsDelta: 0,
            staffName: "System",
            note: "Customer joined through the cafe QR scan.",
            metadata: { stampAwardId },
          }],
          { session }
        );
      }

      const [stampActivity] = await Activity.create(
        [{
          cafeId: cafe._id,
          type: "stamp",
          title: "Stamp Issued (+1)",
          customerName: customer.name,
          customerId: customer._id,
          stampsDelta: 1,
          staffName: staffName || "Customer",
          note: note || (source === "self_scan"
            ? "Visit recorded via cafe QR scan."
            : "Visit verified via staff QR scan."),
          source,
          stampDay: dayKey,
          metadata: { stampAwardId },
        }],
        { session }
      );

      await ScanAttempt.create(
        [{
          cafeId: cafe._id,
          cafeSlug: cafe.slug,
          customerId: customer._id,
          source,
          result: "awarded",
        }],
        { session }
      );
      attemptLogged = true;
      result = "awarded";
      message = "Stamp awarded.";
      outcomeCode = undefined;
      data = {
        cafeId: cafe._id.toString(),
        cafeSlug: cafe.slug,
        cafeName: cafe.name,
        customerId: customer._id.toString(),
        stamps: membership.stamps,
        stampTarget: target,
        customerName: customer.name,
        totalVisits: membership.totalVisits,
        lifetimeStamps: membership.lifetimeStamps,
        newStamps: membership.stamps,
        unlockedReward: membership.stamps >= target,
        activityId: stampActivity._id.toString(),
      };
    });
  } catch (error) {
    if (error?.code === 11000) {
      result = "daily_limit";
      message = "You already got today’s stamp. Come back tomorrow.";
      outcomeCode = "DAILY_LIMIT";
    } else {
      await recordScanAttempt({
        cafeId,
        cafeSlug,
        customerId,
        source,
        result: "rejected",
        code: "STAMP_OPERATION_FAILED",
      });
      throw error;
    }
  } finally {
    await session.endSession();
  }

  if (!attemptLogged) {
    await recordScanAttempt({
      cafeId,
      cafeSlug,
      customerId,
      source,
      result: result || "rejected",
      code:
        result === "daily_limit" ? `DAILY_LIMIT:${dayKey}` : outcomeCode || "",
    });
  }

  return resultResponse(
    result || "rejected",
    message || "Stamp could not be awarded.",
    data,
    outcomeCode
  );
};

module.exports = {
  awardStamp,
  getCafeDayKey,
  recordScanAttempt,
};
