const nodemailer = require("nodemailer");

/**
 * Creates and returns a nodemailer transport.
 * If SMTP credentials are provided in environment variables, it uses them.
 * Otherwise, it falls back to an Ethereal test account or console logging in dev mode.
 */
let cachedTransporter = null;

async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT, 10) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.EMAIL_SECURE === "true" ||
    port === 465;

  // If real SMTP credentials are provided, use them
  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    return cachedTransporter;
  }

  // Fallback for development if no SMTP credentials configured
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("[Nodemailer] Using Ethereal test account:", testAccount.user);
    return cachedTransporter;
  } catch (err) {
    console.warn("[Nodemailer] Could not create Ethereal account, using console stream:", err.message);
    cachedTransporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
    return cachedTransporter;
  }
}

/**
 * Generate responsive HTML email for Password Reset
 */
function generateResetPasswordHtml({ name, resetUrl, minutes = 15 }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Notch Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F2EBDA;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #3B2418;
    }
    .wrapper {
      width: 100%;
      background-color: #F2EBDA;
      padding: 40px 16px;
    }
    .container {
      max-width: 540px;
      margin: 0 auto;
      background-color: #FAF6EC;
      border: 1px solid #E8DFCA;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(59, 36, 24, 0.06);
    }
    .header {
      background-color: #3B2418;
      color: #F2EBDA;
      padding: 32px 24px;
      text-align: center;
    }
    .header-logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
      color: #8EC5FF;
    }
    .header-tagline {
      font-size: 13px;
      color: #D3E0E8;
      margin-top: 6px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #3B2418;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .body-text {
      font-size: 15px;
      line-height: 1.6;
      color: #3B2418;
      margin-bottom: 24px;
    }
    .timer-badge {
      background-color: #FFF2D6;
      border: 1px solid #F3DA9E;
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .timer-text {
      font-size: 14px;
      font-weight: 600;
      color: #8C530A;
      margin: 0;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background-color: #8EC5FF;
      color: #3B2418;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 32px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(142, 197, 255, 0.35);
      letter-spacing: 0.2px;
    }
    .link-fallback {
      background-color: #F2EBDA;
      border: 1px dashed #DCCFB7;
      border-radius: 10px;
      padding: 12px;
      word-break: break-all;
      font-size: 12px;
      color: #5C4538;
      margin-top: 24px;
    }
    .security-notice {
      font-size: 12px;
      line-height: 1.5;
      color: #7A6559;
      margin-top: 28px;
      border-top: 1px solid #E8DFCA;
      padding-top: 20px;
    }
    .footer {
      background-color: #F2EBDA;
      padding: 20px 24px;
      text-align: center;
      font-size: 12px;
      color: #7A6559;
      border-top: 1px solid #E8DFCA;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-logo">☕ Notch</div>
        <div class="header-tagline">Digital Loyalty & Rewards</div>
      </div>
      
      <div class="content">
        <h2 class="greeting">Hello ${name ? name : "there"},</h2>
        
        <p class="body-text">
          We received a request to reset the password for your Notch account. 
          Click the button below to choose a new password:
        </p>
        
        <div class="timer-badge">
          <p class="timer-text">
            ⏳ <strong>Notice:</strong> This password reset link is valid for <strong>${minutes} minutes</strong> only.
          </p>
        </div>

        <div class="btn-container">
          <a href="${resetUrl}" target="_blank" class="btn">
            Reset Password
          </a>
        </div>

        <p class="body-text" style="font-size: 13px; color: #5C4538;">
          If the button above does not work, copy and paste this link into your browser:
        </p>
        <div class="link-fallback">
          <a href="${resetUrl}" style="color: #3B2418;">${resetUrl}</a>
        </div>

        <div class="security-notice">
          <strong>Didn't request this?</strong><br>
          If you didn't request a password reset, you can safely ignore this email. Your account remains completely secure and no changes have been made.
        </div>
      </div>

      <div class="footer">
        &copy; ${new Date().getFullYear()} Notch Loyalty System. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Send Password Reset Email
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.resetUrl - Full reset link URL
 */
async function sendPasswordResetEmail({ email, name, resetUrl }) {
  const transporter = await getTransporter();

  const fromAddress =
    process.env.EMAIL_FROM ||
    process.env.SMTP_FROM ||
    '"Notch Support" <no-reply@notch.app>';

  const mailOptions = {
    from: fromAddress,
    to: email,
    subject: "Notch - Password Reset Request (Valid for 15 minutes)",
    text: `Hello ${name || "there"},\n\nYou requested a password reset for your Notch account.\n\nPlease reset your password using the link below:\n${resetUrl}\n\nIMPORTANT: This link will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.\n\nNotch Team`,
    html: generateResetPasswordHtml({ name, resetUrl, minutes: 15 }),
  };

  const info = await transporter.sendMail(mailOptions);

  console.log(`[Notch Mail] Password reset email dispatched to ${email}. MessageId: ${info.messageId || "stream"}`);

  // If using Ethereal, display preview URL in logs
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[Notch Mail Ethereal Preview URL]: ${previewUrl}`);
  }

  // Also log reset link in development for fast testing
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Notch Reset Link]: ${resetUrl}`);
  }

  return { info, previewUrl, resetUrl };
}

/**
 * Generate HTML email for Admin notification of new Contact/Cafe Inquiry
 */
function generateContactNotificationHtml({ cafeName, ownerName, email, phone, city, plan, message, submittedAt }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Cafe Inquiry: ${cafeName}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F2EBDA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3B2418; }
    .wrapper { width: 100%; background-color: #F2EBDA; padding: 32px 16px; }
    .container { max-width: 580px; margin: 0 auto; background-color: #FAF6EC; border: 1px solid #E8DFCA; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(59, 36, 24, 0.08); }
    .header { background-color: #3B2418; color: #F2EBDA; padding: 28px 24px; text-align: center; }
    .header-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8EC5FF; font-weight: 700; margin-bottom: 6px; }
    .header-title { font-size: 22px; font-weight: 800; margin: 0; color: #F2EBDA; }
    .content { padding: 32px 28px; }
    .badge { display: inline-block; background-color: #8EC5FF; color: #3B2418; font-weight: 800; font-size: 12px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 24px; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E8DFCA; }
    .table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #F0E8D7; }
    .table tr:last-child td { border-bottom: none; }
    .table-label { font-weight: 700; color: #5C4538; width: 38%; }
    .table-value { color: #3B2418; font-weight: 600; }
    .message-box { background-color: #F2EBDA; border-left: 4px solid #8EC5FF; border-radius: 6px; padding: 16px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: #3B2418; white-space: pre-wrap; }
    .action-note { font-size: 13px; color: #7A6559; background: #FFF4DC; border: 1px solid #F5DEB3; border-radius: 10px; padding: 12px 16px; margin-top: 24px; }
    .footer { background-color: #F2EBDA; padding: 18px 24px; text-align: center; font-size: 12px; color: #7A6559; border-top: 1px solid #E8DFCA; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-tag">☕ New Cafe Growth Inquiry</div>
        <h1 class="header-title">${cafeName}</h1>
      </div>
      <div class="content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 15px; font-weight: 700; color: #3B2418;">Inquiry Summary</span>
          <span class="badge">${plan || "Growth"} Tier</span>
        </div>
        <table class="table">
          <tr>
            <td class="table-label">Cafe Name:</td>
            <td class="table-value"><strong>${cafeName}</strong></td>
          </tr>
          <tr>
            <td class="table-label">Owner / Manager:</td>
            <td class="table-value">${ownerName}</td>
          </tr>
          <tr>
            <td class="table-label">Email:</td>
            <td class="table-value"><a href="mailto:${email}" style="color: #3B2418; font-weight: 700;">${email}</a></td>
          </tr>
          <tr>
            <td class="table-label">Phone:</td>
            <td class="table-value">${phone ? `<a href="tel:${phone}" style="color: #3B2418;">${phone}</a>` : "Not provided"}</td>
          </tr>
          <tr>
            <td class="table-label">City / Area:</td>
            <td class="table-value">${city || "Not specified"}</td>
          </tr>
          <tr>
            <td class="table-label">Submitted At:</td>
            <td class="table-value">${submittedAt || new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }) + " (Cairo Time)"}</td>
          </tr>
        </table>

        ${message ? `
          <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #5C4538; margin-top: 20px;">Cafe Note / Message:</div>
          <div class="message-box">${message}</div>
        ` : ""}

        <div class="action-note">
          <strong>💡 Quick Action:</strong> Click <strong>Reply</strong> in your email client to respond directly to <strong>${ownerName}</strong> at <strong>${email}</strong>.
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Notch Loyalty System &bull; Hostinger Mail Gateway
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generate responsive HTML email for Applicant confirmation
 */
function generateContactConfirmationHtml({ cafeName, ownerName, plan }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your inquiry - Notch</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F2EBDA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3B2418; }
    .wrapper { width: 100%; background-color: #F2EBDA; padding: 32px 16px; }
    .container { max-width: 540px; margin: 0 auto; background-color: #FAF6EC; border: 1px solid #E8DFCA; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(59, 36, 24, 0.08); }
    .header { background-color: #3B2418; color: #F2EBDA; padding: 28px 24px; text-align: center; }
    .header-logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #8EC5FF; margin: 0; }
    .header-sub { font-size: 13px; color: #D3E0E8; margin-top: 4px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px; color: #3B2418; }
    .text { font-size: 14px; line-height: 1.6; color: #3B2418; margin-bottom: 20px; }
    .steps { background-color: #FFFFFF; border: 1px solid #E8DFCA; border-radius: 14px; padding: 20px; margin: 24px 0; }
    .step-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
    .step-item:last-child { margin-bottom: 0; }
    .step-num { width: 22px; height: 22px; border-radius: 50%; background-color: #8EC5FF; color: #3B2418; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .step-text { font-size: 13px; color: #3B2418; line-height: 1.5; }
    .footer { background-color: #F2EBDA; padding: 18px 24px; text-align: center; font-size: 12px; color: #7A6559; border-top: 1px solid #E8DFCA; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-logo">☕ Notch</div>
        <div class="header-sub">Growth Platform for Independent Cafes</div>
      </div>
      <div class="content">
        <h2 class="greeting">Hi ${ownerName || "there"},</h2>
        <p class="text">
          Thank you for reaching out to partner with Notch! We have received your inquiry for <strong>${cafeName}</strong> (${plan || "Growth"} tier).
        </p>
        <div class="steps">
          <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #5C4538; margin-bottom: 12px; letter-spacing: 0.5px;">What happens next?</div>
          <div class="step-item">
            <div class="step-num">1</div>
            <div class="step-text"><strong>Review:</strong> Our onboarding team reviews your cafe details and reward preferences.</div>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <div class="step-text"><strong>Onboarding:</strong> We reach out via phone or email within 1 business day to set up your cafe profile, digital menu, and barista scanner.</div>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <div class="step-text"><strong>Go Live:</strong> Your baristas begin scanning customer QR codes immediately—no new hardware required.</div>
          </div>
        </div>
        <p class="text" style="font-size: 13px; color: #5C4538; margin-bottom: 0;">
          Need immediate assistance? Feel free to reply directly to this email or reach us at <a href="mailto:info@notchloyalty.com" style="color: #3B2418; font-weight: 700;">info@notchloyalty.com</a>.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Notch Loyalty &bull; Cairo, Egypt
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Send Contact/Application Notification Email to Notch Team and Confirmation to Applicant
 */
async function sendContactInquiryEmail({ cafeName, ownerName, email, phone, city, plan, message }) {
  const transporter = await getTransporter();

  const recipientAdmin =
    process.env.CONTACT_RECEIVER_EMAIL ||
    process.env.SMTP_USER ||
    "info@notchloyalty.com";

  const fromAddress =
    process.env.EMAIL_FROM ||
    (process.env.SMTP_USER
      ? `"Notch Loyalty" <${process.env.SMTP_USER}>`
      : '"Notch Inquiries" <no-reply@notchloyalty.com>');

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "Africa/Cairo",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const mailOptions = {
    from: fromAddress,
    to: recipientAdmin,
    replyTo: email,
    subject: `☕ New Cafe Inquiry: ${cafeName} (${plan || "Growth"} Tier)`,
    text: `New Cafe Inquiry received on Notch:\n\nCafe Name: ${cafeName}\nOwner/Manager: ${ownerName}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nCity: ${city || "N/A"}\nPlan: ${plan || "Growth"}\nMessage: ${message || "N/A"}\nSubmitted At: ${submittedAt}\n\nReply directly to this email to contact ${ownerName}.`,
    html: generateContactNotificationHtml({
      cafeName,
      ownerName,
      email,
      phone,
      city,
      plan,
      message,
      submittedAt,
    }),
  };

  const adminInfo = await transporter.sendMail(mailOptions);
  console.log(`[Notch Contact] Admin notification sent to ${recipientAdmin} for cafe "${cafeName}". MessageId: ${adminInfo.messageId || "stream"}`);

  // Send polite automated confirmation email to the applicant
  try {
    const confirmationMailOptions = {
      from: fromAddress,
      to: email,
      subject: `We received your inquiry for ${cafeName} - Notch Loyalty`,
      text: `Hi ${ownerName},\n\nThank you for reaching out to Notch! We received your inquiry for ${cafeName} (${plan || "Growth"} plan). Our onboarding team will contact you within 1 business day.\n\nBest regards,\nThe Notch Team`,
      html: generateContactConfirmationHtml({ cafeName, ownerName, plan }),
    };
    await transporter.sendMail(confirmationMailOptions);
    console.log(`[Notch Contact] Confirmation email dispatched to applicant: ${email}`);
  } catch (confirmErr) {
    console.warn(`[Notch Contact] Confirmation email to applicant failed (non-critical):`, confirmErr.message);
  }

  return { adminInfo };
}

module.exports = {
  sendPasswordResetEmail,
  sendContactInquiryEmail,
  getTransporter,
};
