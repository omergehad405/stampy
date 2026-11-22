const expressApp = require("../../backend/app/expressApp");
const connectDB = require("../../backend/config/db");

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  try {
    await connectDB();
    return expressApp(req, res);
  } catch (error) {
    console.error("[Next.js Internal API Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Database or internal server error",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
}
