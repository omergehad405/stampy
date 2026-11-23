const jwt = require("jsonwebtoken");
const Cafe = require("../models/Cafe");
const User = require("../models/User");
const EmailCampaign = require("../models/EmailCampaign");
const { cafeHasPlanFeature } = require("../middlewares/planFeatureMiddleware");
const { sendCafeCampaignEmail } = require("../../utils/sendEmail");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_BATCH_SIZE = 5;
const EMAIL_BATCH_DELAY_MS = 1000;
const CAMPAIGN_COOLDOWN_MS = 60 * 60 * 1000;
const MAX_CAMPAIGNS_PER_CAFE_PER_DAY = 5;
const CAMPAIGN_HISTORY_LIMIT = 10;
const CAMPAIGN_STALE_AFTER_MS = 5 * 60 * 1000;

const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const stopStaleCampaigns = async (cafeId) => {
  const staleBefore = new Date(Date.now() - CAMPAIGN_STALE_AFTER_MS);
  await EmailCampaign.updateMany(
    {
      cafeId,
      status: "sending",
      updatedAt: { $lt: staleBefore },
    },
    { $set: { status: "stopped" } }
  );
};

const getRecipients = async (cafe) => {
  const activeMemberships = (cafe.customers || []).filter(
    (membership) =>
      membership.userId &&
      membership.status !== "inactive" &&
      membership.emailUnsubscribed !== true
  );
  const membershipIds = new Set(
    activeMemberships.map((membership) => membership.userId.toString())
  );
  if (!membershipIds.size) return [];

  const users = await User.find({
    _id: { $in: Array.from(membershipIds) },
    role: "user",
    isActive: { $ne: false },
  })
    .select("name email")
    .lean();

  const seenEmails = new Set();
  return users.reduce((recipients, user) => {
    const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
    if (!membershipIds.has(user._id.toString()) || !EMAIL_REGEX.test(email)) {
      return recipients;
    }
    if (seenEmails.has(email)) return recipients;

    seenEmails.add(email);
    recipients.push({
      userId: user._id,
      email,
      name: user.name || "Customer",
    });
    return recipients;
  }, []);
};

const createUnsubscribeUrl = ({ cafeId, customerId }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  const token = jwt.sign(
    {
      purpose: "cafe-email-unsubscribe",
      cafeId: cafeId.toString(),
      customerId: customerId.toString(),
    },
    secret
  );
  const appUrl = (
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:5000"
  ).replace(/\/+$/, "");

  return `${appUrl}/unsubscribe/${token}`;
};

const countRecipients = async (req, res) => {
  try {
    const recipients = await getRecipients(req.cafe);
    return res.status(200).json({
      success: true,
      data: { count: recipients.length },
    });
  } catch (error) {
    console.error("[Email Campaign] Recipient count failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load subscriber count. Please try again later.",
    });
  }
};

const getCampaignHistory = async (req, res) => {
  try {
    await stopStaleCampaigns(req.cafe._id);
    const campaigns = await EmailCampaign.find({ cafeId: req.cafe._id })
      .select("subject recipientsCount sentCount failedCount status createdAt")
      .sort({ createdAt: -1 })
      .limit(CAMPAIGN_HISTORY_LIMIT)
      .lean();

    return res.status(200).json({
      success: true,
      data: { campaigns },
    });
  } catch (error) {
    console.error("[Email Campaign] History lookup failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load campaign history. Please try again later.",
    });
  }
};

const getCampaignStatus = async (req, res) => {
  try {
    await stopStaleCampaigns(req.cafe._id);
    if (!/^[a-f\d]{24}$/i.test(req.params.campaignId)) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    const campaign = await EmailCampaign.findOne({
      _id: req.params.campaignId,
      cafeId: req.cafe._id,
    }).select("subject recipientsCount sentCount failedCount status createdAt");

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { campaign },
    });
  } catch (error) {
    console.error("[Email Campaign] Status lookup failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load campaign status. Please try again later.",
    });
  }
};

const processCampaign = async (campaign, recipients, cafeName, subject, body) => {
  let sentCount = 0;
  let failedCount = 0;
  let stopped = false;

  try {
    for (let offset = 0; offset < recipients.length; offset += EMAIL_BATCH_SIZE) {
      const currentCafe = await Cafe.findById(campaign.cafeId);
      if (!(await cafeHasPlanFeature(currentCafe, "notifications"))) {
        stopped = true;
        break;
      }

      const batch = recipients.slice(offset, offset + EMAIL_BATCH_SIZE);
      await Promise.all(
        batch.map(async (recipient, batchIndex) => {
          const stillSubscribed = await Cafe.exists({
            _id: campaign.cafeId,
            customers: {
              $elemMatch: {
                userId: recipient.userId,
                status: { $ne: "inactive" },
                emailUnsubscribed: { $ne: true },
              },
            },
          });
          if (!stillSubscribed) return;

          try {
            const unsubscribeUrl = createUnsubscribeUrl({
              cafeId: campaign.cafeId,
              customerId: recipient.userId,
            });
            await sendCafeCampaignEmail({
              email: recipient.email,
              customerName: recipient.name,
              cafeName,
              subject,
              body,
              unsubscribeUrl,
            });
            sentCount += 1;
          } catch (error) {
            failedCount += 1;
            console.error("[Email Campaign] Recipient delivery failed:", {
              campaignId: campaign._id.toString(),
              recipientIndex: offset + batchIndex,
              errorCode: error.code || error.name || "UNKNOWN",
            });
          }
        })
      );

      await EmailCampaign.updateOne(
        { _id: campaign._id },
        { $set: { sentCount, failedCount } }
      );

      if (offset + EMAIL_BATCH_SIZE < recipients.length) {
        await delay(EMAIL_BATCH_DELAY_MS);
      }
    }
  } catch (error) {
    stopped = true;
    console.error("[Email Campaign] Background campaign failed:", {
      campaignId: campaign._id.toString(),
      errorCode: error.code || error.name || "UNKNOWN",
    });
  }

  await EmailCampaign.updateOne(
    { _id: campaign._id },
    {
      $set: {
        sentCount,
        failedCount,
        status: stopped ? "stopped" : "done",
      },
    }
  );
};

const sendCampaign = async (req, res) => {
  try {
    await stopStaleCampaigns(req.cafe._id);
    const requestBody =
      req.body && typeof req.body === "object" ? req.body : {};
    const subject =
      typeof requestBody.subject === "string" ? requestBody.subject.trim() : "";
    const body =
      typeof requestBody.body === "string" ? requestBody.body.trim() : "";

    if (
      !subject ||
      subject.length > 100 ||
      /[\r\n]/.test(subject) ||
      !body ||
      body.length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a subject (1-100 characters) and a message (1-1000 characters).",
      });
    }

    const recipients = await getRecipients(req.cafe);
    if (!recipients.length) {
      return res.status(400).json({
        success: false,
        message: "There are no subscribers available to receive this email.",
      });
    }

    const now = new Date();
    const latestCampaign = await EmailCampaign.findOne({ cafeId: req.cafe._id })
      .sort({ createdAt: -1 })
      .select("createdAt");
    if (
      latestCampaign &&
      now.getTime() - latestCampaign.createdAt.getTime() < CAMPAIGN_COOLDOWN_MS
    ) {
      return res.status(429).json({
        success: false,
        message: "You can send only one campaign per hour.",
      });
    }

    const dayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const campaignsToday = await EmailCampaign.countDocuments({
      cafeId: req.cafe._id,
      createdAt: { $gte: dayStart },
    });
    if (campaignsToday >= MAX_CAMPAIGNS_PER_CAFE_PER_DAY) {
      return res.status(429).json({
        success: false,
        message: "The daily campaign limit has been reached. Please try again tomorrow.",
      });
    }

    const campaign = await EmailCampaign.create({
      cafeId: req.cafe._id,
      subject,
      body,
      recipientsCount: recipients.length,
      status: "sending",
    });

    const cafeName = req.cafe.name;
    setImmediate(() => {
      void processCampaign(campaign, recipients, cafeName, subject, body).catch(
        (error) => {
          console.error("[Email Campaign] Campaign completion failed:", {
            campaignId: campaign._id.toString(),
            errorCode: error.code || error.name || "UNKNOWN",
          });
        }
      );
    });

    return res.status(202).json({
      success: true,
      message: "Campaign sending started.",
      data: {
        campaign: {
          id: campaign._id.toString(),
          subject: campaign.subject,
          recipientsCount: campaign.recipientsCount,
          sentCount: campaign.sentCount,
          failedCount: campaign.failedCount,
          status: campaign.status,
          createdAt: campaign.createdAt,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(429).json({
        success: false,
        message: "A campaign is already being sent. Please wait for it to finish.",
      });
    }
    console.error("[Email Campaign] Could not start campaign:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to start the campaign. Please try again later.",
    });
  }
};

const unsubscribeFromCafe = async (req, res) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const claims = jwt.verify(req.params.token, secret);
    if (
      claims.purpose !== "cafe-email-unsubscribe" ||
      !/^[a-f\d]{24}$/i.test(claims.cafeId || "") ||
      !/^[a-f\d]{24}$/i.test(claims.customerId || "")
    ) {
      return res.status(400).json({
        success: false,
        message: "This unsubscribe link is invalid or has expired.",
      });
    }

    await Cafe.updateOne(
      {
        _id: claims.cafeId,
        "customers.userId": claims.customerId,
      },
      {
        $set: { "customers.$.emailUnsubscribed": true },
      }
    );

    return res.status(200).json({
      success: true,
      message: "You have unsubscribed from this cafe's emails.",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "This unsubscribe link is invalid or has expired.",
      });
    }
    console.error("[Email Campaign] Unsubscribe failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to unsubscribe. Please try again later.",
    });
  }
};

module.exports = {
  countRecipients,
  getCampaignHistory,
  getCampaignStatus,
  sendCampaign,
  unsubscribeFromCafe,
};
