const { ContactInquiry } = require("../models/ContactInquiry");
const { sendContactInquiryEmail } = require("../../utils/sendEmail");

/**
 * @desc    Submit a contact / cafe partnership inquiry and send email via SMTP
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactInquiry = async (req, res) => {
  try {
    const {
      cafeName,
      ownerName,
      email,
      phone,
      city,
      plan,
      message,
      // Honeypot field for bot protection
      website,
    } = req.body;

    // Silent discard for bots filling the hidden honeypot
    if (website) {
      return res.status(200).json({
        success: true,
        message: "Inquiry received successfully.",
      });
    }

    // Validation
    if (!cafeName || !cafeName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cafe name is required.",
      });
    }

    if (!ownerName || !ownerName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Owner or manager name is required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required.",
      });
    }

    // Capture metadata
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      null;
    const userAgent = req.headers["user-agent"] || null;

    // 1. Save inquiry lead in MongoDB
    const inquiry = await ContactInquiry.create({
      cafeName: cafeName.trim(),
      ownerName: ownerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      city: city ? city.trim() : "",
      plan: plan ? plan.trim() : "Growth",
      message: message ? message.trim() : "",
      emailStatus: "pending",
      ipAddress,
      userAgent,
    });

    // 2. Dispatch email via Hostinger / configured SMTP
    let emailDispatched = false;
    let emailErrorMsg = null;

    try {
      await sendContactInquiryEmail({
        cafeName: inquiry.cafeName,
        ownerName: inquiry.ownerName,
        email: inquiry.email,
        phone: inquiry.phone,
        city: inquiry.city,
        plan: inquiry.plan,
        message: inquiry.message,
      });

      inquiry.emailStatus = "sent";
      await inquiry.save();
      emailDispatched = true;
    } catch (emailErr) {
      emailErrorMsg = emailErr.message;
      console.error(
        `[Contact API] Email sending failed for inquiry ${inquiry._id}:`,
        emailErr.message
      );
      inquiry.emailStatus = "failed";
      inquiry.emailError = emailErr.message;
      await inquiry.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Thank you! Your cafe inquiry has been received. Our team will review your application and reach out shortly.",
      data: {
        id: inquiry._id,
        emailSent: emailDispatched,
        warning:
          !emailDispatched && process.env.NODE_ENV !== "production"
            ? `Lead saved to database, but SMTP dispatch encountered: ${emailErrorMsg}`
            : undefined,
      },
    });
  } catch (err) {
    console.error("[Contact API] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting your inquiry. Please try again or email info@notchloyalty.com.",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  }
};

module.exports = {
  submitContactInquiry,
};
