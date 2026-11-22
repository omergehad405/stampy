const { Plan } = require("../models/Plan");

/**
 * @desc    Get all active subscription plans for public pricing page and pricing section
 * @route   GET /api/plans
 * @access  Public
 */
const getPublicPlans = async (req, res) => {
  try {
    let plans = await Plan.find({ isActive: true })
      .select(
        "name description price billingPeriod features maxCustomers maxRewards maxStaff isUnlimitedCustomers isUnlimitedRewards isPopular"
      )
      .sort({ price: 1, createdAt: 1 })
      .lean();

    // Auto-seed initial Egyptian cafe growth plans if the collection is empty
    if (!plans || plans.length === 0) {
      const initialPlans = [
        {
          name: "Starter",
          description: "For new espresso bars and cozy pop-ups starting to reward their first regular guests.",
          price: 0,
          billingPeriod: "month",
          maxCustomers: 50,
          maxStaff: 1,
          maxRewards: 3,
          isUnlimitedCustomers: false,
          isUnlimitedRewards: false,
          isPopular: false,
          isActive: true,
          features: [
            "Up to 50 active regular customers",
            "1 barista / staff scanner workstation",
            "Up to 3 custom reward offerings",
            "Live visit activity feed",
            "Standard email support",
          ],
        },
        {
          name: "Growth",
          description: "For bustling specialty cafes looking to turn one-time visitors into regulars and get discovered by new customers.",
          price: 399,
          billingPeriod: "month",
          maxCustomers: 250,
          maxStaff: 5,
          maxRewards: 10,
          isUnlimitedCustomers: false,
          isUnlimitedRewards: false,
          isPopular: true,
          isActive: true,
          features: [
            "Up to 250 active regular customers",
            "Up to 5 barista & manager accounts",
            "Up to 10 active reward offerings",
            "Free exposure on Discover (Featured Cafe)",
            "Searchable customer directory & return history",
            "Custom cafe branding & cover visuals",
            "Priority WhatsApp & phone support",
          ],
        },
        {
          name: "Pro Unlimited",
          description: "For high-volume cafe hubs and multi-branch specialty brands demanding full power and maximum visibility.",
          price: 899,
          billingPeriod: "month",
          maxCustomers: 1000,
          maxStaff: 20,
          maxRewards: 50,
          isUnlimitedCustomers: true,
          isUnlimitedRewards: true,
          isPopular: false,
          isActive: true,
          features: [
            "Unlimited active regular customers",
            "Unlimited barista & manager accounts",
            "Unlimited reward tiers & seasonal specials",
            "Priority placement in Discover searches",
            "Digital online menu showcase (Coming soon)",
            "Advanced customer retention analytics (Coming soon)",
            "Dedicated account manager & staff onboarding",
          ],
        },
      ];

      try {
        await Plan.insertMany(initialPlans);
        plans = await Plan.find({ isActive: true })
          .select(
            "name description price billingPeriod features maxCustomers maxRewards maxStaff isUnlimitedCustomers isUnlimitedRewards isPopular"
          )
          .sort({ price: 1, createdAt: 1 })
          .lean();
      } catch (seedErr) {
        console.warn("[Public Plan API] Plan seeding notice:", seedErr.message);
      }
    }

    const formatted = (plans || []).map((p) => ({
      id: p._id ? p._id.toString() : p.id,
      name: p.name,
      description: p.description,
      price: p.price ?? 0,
      currency: "EGP",
      billingPeriod: p.billingPeriod || "month",
      features: p.features || [],
      maxCustomers: p.maxCustomers,
      maxRewards: p.maxRewards,
      maxStaff: p.maxStaff,
      isUnlimitedCustomers: Boolean(p.isUnlimitedCustomers),
      isUnlimitedRewards: Boolean(p.isUnlimitedRewards),
      isPopular: Boolean(p.isPopular),
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: {
        plans: formatted,
      },
    });
  } catch (error) {
    console.error("[Public Plan API] Error fetching plans:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching plans",
    });
  }
};

module.exports = {
  getPublicPlans,
};
