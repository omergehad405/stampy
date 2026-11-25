require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");

// عدّل المسارات لو فولدر الموديلز اسمه مختلف
const User = require("./models/User");
const Cafe = require("./models/Cafe");
const Reward = require("./models/Reward");
const Activity = require("./models/Activity");
const Redemption = require("./models/Redemption");
const EmailCampaign = require("./models/EmailCampaign");

const SLUG = "loadtest-cafe";
const DOMAIN = "loadtest.notch.test"; // دومين وهمي، مش هيوصل إيميل لأي حد
const PASSWORD = "LoadTest123!";
const CUSTOMERS = 1000;
const STAMPS = 5000;
const STAMP_TARGET = 10;
const DAY = 24 * 60 * 60 * 1000;

const ask = (q) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, (a) => { rl.close(); resolve(a.trim().toLowerCase()); });
  });

async function clean() {
  const cafe = await Cafe.findOne({ slug: SLUG });
  if (cafe) {
    await Activity.deleteMany({ cafeId: cafe._id });
    await Reward.deleteMany({ cafeId: cafe._id });
    await Redemption.deleteMany({ cafeId: cafe._id });
    await EmailCampaign.deleteMany({ cafeId: cafe._id });
    await Cafe.deleteOne({ _id: cafe._id });
  }
  // بيمسح بس الإيميلات اللي بتنتهي بالدومين الوهمي
  const emailRe = new RegExp("@" + DOMAIN.replace(/\./g, "\\.") + "$");
  const res = await User.deleteMany({ email: emailRe });
  console.log(`Cleaned: ${res.deletedCount} test users removed${cafe ? " + test cafe" : ""}.`);
}

async function seed() {
  if (await Cafe.findOne({ slug: SLUG })) {
    console.log("Test cafe already exists. Run: node seed-test-data.js --clean");
    return;
  }

  const hash = await bcrypt.hash(PASSWORD, 10); // مرة واحدة بس، عشان bcrypt بطيء
  const now = Date.now();
  const cafeId = new mongoose.Types.ObjectId();
  const ownerId = new mongoose.Types.ObjectId();
  const customerIds = Array.from({ length: CUSTOMERS }, () => new mongoose.Types.ObjectId());

  // الأنشطة (ستامبس + انضمام) وعدّ الستامبس لكل عميل
  const counts = new Array(CUSTOMERS).fill(0);
  const activities = [];
  for (let i = 0; i < STAMPS; i++) {
    const c = Math.floor(Math.random() * CUSTOMERS);
    counts[c]++;
    activities.push({
      cafeId, type: "stamp", title: "Stamp added",
      customerName: `Test Customer ${c + 1}`, customerId: customerIds[c],
      stampsDelta: 1, staffName: "Test Barista", source: "cafe_manual",
      createdAt: new Date(now - Math.random() * 30 * DAY),
    });
  }
  for (let c = 0; c < CUSTOMERS; c++) {
    activities.push({
      cafeId, type: "join", title: "Joined the program",
      customerName: `Test Customer ${c + 1}`, customerId: customerIds[c],
      createdAt: new Date(now - 30 * DAY),
    });
  }

  // الموظفين
  const staff = [
    { _id: ownerId, name: "LoadTest Owner", email: `owner@${DOMAIN}`, role: "cafeOwner" },
    { name: "LoadTest Manager", email: `manager@${DOMAIN}`, role: "cafeManager" },
    { name: "LoadTest Barista", email: `barista@${DOMAIN}`, role: "cafeBarista" },
  ].map((s) => ({ ...s, password: hash, cafeId, notificationsEnabled: false }));

  // العملاء
  const customers = customerIds.map((id, i) => ({
    _id: id,
    name: `Test Customer ${i + 1}`,
    email: `customer${i + 1}@${DOMAIN}`,
    password: hash,
    role: "user",
    qrCode: `LOADTEST-${i + 1}`,
    notificationsEnabled: false,
    totalStamps: counts[i],
    joinedCafes: 1,
    cafes: [{
      cafeId, joinedAt: new Date(now - 30 * DAY),
      stamps: counts[i] % STAMP_TARGET, totalVisits: counts[i],
      lifetimeStamps: counts[i], lastVisitDate: new Date(now - Math.random() * 7 * DAY),
    }],
  }));

  await User.insertMany([...staff, ...customers]);

  await Cafe.create({
    _id: cafeId,
    name: "Load Test Cafe",
    slug: SLUG,
    stampTarget: STAMP_TARGET,
    customerCount: CUSTOMERS,
    totalStampsIssued: STAMPS,
    // subscriptionPlanId: "ID_الخطة_اللي_عايز_تختبرها", // فكّها لو عايز خطة معينة
    owner: { userId: ownerId, name: "LoadTest Owner", email: `owner@${DOMAIN}`, phone: "01000000000" },
    customers: customerIds.map((id, i) => ({
      userId: id, joinedAt: new Date(now - 30 * DAY),
      stamps: counts[i] % STAMP_TARGET, totalVisits: counts[i],
      lifetimeStamps: counts[i], lastVisitDate: new Date(now - Math.random() * 7 * DAY),
      emailUnsubscribed: true,
    })),
  });

  await Reward.insertMany([
    { cafeId, title: "Free Coffee", requiredStamps: 10, description: "Any hot coffee on us", category: "cafee & drinks" },
    { cafeId, title: "Free Croissant", requiredStamps: 6, description: "One croissant on us", category: "bakery & sweets" },
    { cafeId, title: "20% Off", requiredStamps: 4, description: "20% off your next order", category: "special discount only" },
  ]);

  await Activity.insertMany(activities);

  console.log("\nDone. Test cafe login:");
  console.log(`  owner:   owner@${DOMAIN}`);
  console.log(`  manager: manager@${DOMAIN}`);
  console.log(`  barista: barista@${DOMAIN}`);
  console.log(`  customer: customer1@${DOMAIN}  (+ customer2..${CUSTOMERS})`);
  console.log(`  password (الكل): ${PASSWORD}`);
}

(async () => {
  const uri = process.env.MONGO_URI || "mongodb+srv://omergehad:Omergehad1@cluster0.fhp0fld.mongodb.net/stampy"; // عدّل اسم المتغير لو مختلف
  if (!uri) { console.error("Mongo URI not found in .env"); process.exit(1); }
  await mongoose.connect(uri);

  const isClean = process.argv.includes("--clean");
  console.log(`\nDatabase: ${mongoose.connection.name} (${mongoose.connection.host})`);
  console.log(isClean
    ? "Will DELETE the test cafe and test users only."
    : `Will ADD 1 test cafe, ${CUSTOMERS} test customers, ${STAMPS} stamps.`);

  if ((await ask('Type "yes" to continue: ')) !== "yes") {
    console.log("Cancelled.");
    process.exit(0);
  }
  try {
    await (isClean ? clean() : seed());
  } catch (e) {
    console.error(e);
  }
  await mongoose.disconnect();
})();