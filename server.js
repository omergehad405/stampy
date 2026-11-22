require("dotenv").config();
const express = require("express");
const next = require("next");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./backend/config/db");
const authRoutes = require("./backend/app/routing/authRoutes");
const adminCafeRoutes = require("./backend/app/routing/adminCafeRoutes");
const adminCustomerRoutes = require("./backend/app/routing/adminCustomerRoutes");
const adminPlanRoutes = require("./backend/app/routing/adminPlanRoutes");
const adminAnnouncementRoutes = require("./backend/app/routing/adminAnnouncementRoutes");
const announcementRoutes = require("./backend/app/routing/announcementRoutes");
const cafeRewardRoutes = require("./backend/app/routing/cafeRewardRoutes");
const cafeRoutes = require("./backend/app/routing/cafeRoutes");
const dashboardCafeRoutes = require("./backend/app/routing/dashboardCafeRoutes");

const dev = process.env.NODE_ENV !== "production";
const PORT = parseInt(process.env.PORT, 10) || 5000;
const hostname = "0.0.0.0";

async function startServer() {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Prepare Next.js app in-process
    const nextApp = next({ dev, hostname, port: PORT });
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();

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
      if (!origin) return true; // Server-to-server, curl, Postman
      // Localhost or 127.0.0.1 on any port (e.g. :3000, :5000, :5173)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
      // Vercel deployment preview / production domains
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
      // Hostinger deployment preview / production domains
      if (/^https:\/\/.*\.hostingersite\.com$/.test(origin)) return true;
      // Any custom origins from .env
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
        credentials: true, // Required for HttpOnly cookie auth
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
        message: "Stampy API is healthy",
        timestamp: new Date().toISOString(),
        port: PORT,
      });
    });

    // ── API Routes ────────────────────────────────────────────────────────────
    app.use("/api/auth", authRoutes);
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

    // ── All other routes handled by Next.js in-process ────────────────────────
    app.use((req, res) => {
      return handle(req, res);
    });

    // ── Global error handler ──────────────────────────────────────────────────
    app.use((err, req, res, next) => {
      console.error("[Server Error]", err);
      res.status(err.status || 500).json({
        success: false,
        message:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message || "Internal server error",
      });
    });

    app.listen(PORT, () => {
      console.log(`\n[Stampy] ✅ Unified Server running on port ${PORT}`);
      console.log(`[Stampy]    Mode: ${dev ? "Development" : "Production"}`);
      console.log(`[Stampy]    API  → http://localhost:${PORT}/api`);
      console.log(`[Stampy]    App  → http://localhost:${PORT}/\n`);
    });
  } catch (error) {
    console.error("[Stampy Fatal Error]:", error);
    process.exit(1);
  }
}

startServer();
