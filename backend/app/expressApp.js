const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routing/authRoutes");
const adminCafeRoutes = require("./routing/adminCafeRoutes");
const adminCustomerRoutes = require("./routing/adminCustomerRoutes");
const adminPlanRoutes = require("./routing/adminPlanRoutes");
const adminAnnouncementRoutes = require("./routing/adminAnnouncementRoutes");
const announcementRoutes = require("./routing/announcementRoutes");
const cafeRewardRoutes = require("./routing/cafeRewardRoutes");
const cafeRoutes = require("./routing/cafeRoutes");
const dashboardCafeRoutes = require("./routing/dashboardCafeRoutes");
const planRoutes = require("./routing/planRoutes");
const contactRoutes = require("./routing/contactRoutes");

function createExpressApp() {
  const app = express();

  // ── Chrome DevTools Probe ─────────────────────────────────────────────────
  app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.status(204).end();
  });

  // ── CORS ──────────────────────────────────────────────────────────────────
  const customAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const isOriginAllowed = (origin) => {
    if (!origin) return true;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
    if (/^https:\/\/.*\.hostingersite\.com$/.test(origin)) return true;
    if (customAllowedOrigins.includes(origin)) return true;
    return false;
  };

  app.use(
    cors({
      origin(origin, callback) {
        if (isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
      optionsSuccessStatus: 200,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // ── Health check ─────────────────────────────────────────────────────────
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Notch API is healthy (Hostinger Unified Engine)",
      timestamp: new Date().toISOString(),
    });
  });

  // ── API Routes ────────────────────────────────────────────────────────────
  app.use("/api/auth", authRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/plans", planRoutes);
  app.use("/api/announcements", announcementRoutes);
  app.use("/api/admin/cafes", adminCafeRoutes);
  app.use("/api/admin/customers", adminCustomerRoutes);
  app.use("/api/admin/plans", adminPlanRoutes);
  app.use("/api/admin/announcements", adminAnnouncementRoutes);
  app.use("/api/dashboard/rewards", cafeRewardRoutes);
  app.use("/api/rewards", cafeRewardRoutes);
  app.use("/api/cafes", cafeRoutes);
  app.use("/api/dashboard/cafe", dashboardCafeRoutes);
  app.use("/api/dashboard/profile", dashboardCafeRoutes);

  return app;
}

const expressApp = createExpressApp();
module.exports = expressApp;
