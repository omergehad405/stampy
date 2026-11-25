require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Activity = require("../app/models/Activity");
const ScanAttempt = require("../app/models/ScanAttempt");

async function run() {
  await connectDB();
  const result = await Activity.updateMany(
    {
      type: "stamp",
      $or: [{ source: { $exists: false } }, { source: null }],
    },
    { $set: { source: "cafe_manual" } }
  );
  await Activity.createIndexes();
  await ScanAttempt.createIndexes();
  console.log(
    `Backfilled ${result.modifiedCount || 0} historical stamp sources and ensured activity indexes.`
  );
}

run()
  .catch((error) => {
    console.error("[Stamp migration] Failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
