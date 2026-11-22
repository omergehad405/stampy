/**
 * Central copy & content configuration for Notch marketing pages.
 * Tailored specifically for cafes and coffee lovers in Egypt.
 * Positioned as a cafe growth platform: repeat-customer engine, digital menu, and free exposure.
 */

export const BRAND = {
  name: "Notch",
  shortName: "Notch",
  tagline: "The Growth Platform for Independent Cafes in Egypt",
  description:
    "Turn one-time cafe visitors into loyal regulars and get discovered by new coffee enthusiasts across Egypt. A simple QR repeat-reward engine, instant digital menus, and free platform exposure.",
  copyrightYear: 2026,
};

export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Cafe Dashboard", href: "/login?as=cafe" },
  ],
  community: [
    { label: "Partner Cafes in Egypt", href: "/contact" },
    { label: "Apply Your Cafe", href: "/contact" },
    { label: "Customer Login", href: "/login?as=customer" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  socials: [
    { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { name: "Twitter / X", href: "https://x.com", icon: "x" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  ],
};

export const HERO_CONTENT = {
  badge: "Built for Independent Cafes in Egypt",
  headlinePrefix: "Turn one-time visitors into",
  headlineHighlight: "lifelong regulars.",
  subline:
    "Notch helps cafes in Egypt keep customers coming back and get discovered by new coffee lovers. A frictionless QR reward engine, online digital menus, and free discovery exposure—all in one place.",
  ctaCustomer: "Explore Cafes & Get Rewards",
  ctaCustomerHref: "/login?as=customer",
  ctaCafe: "Grow Your Cafe",
  ctaCafeHref: "/contact",
  mockup: {
    cafeName: "Al-Moez Specialty Coffee",
    category: "Specialty Espresso Bar • Zamalek, Cairo (Sample)",
    targetStamps: 8,
    currentStamps: 5,
    rewardText: "Free flat white or iced latte at 8 visits",
    memberCode: "EG-8821",
    scanHint: "Show your QR to the barista at the counter",
    menuHint: "Spanish Latte, V60 Ethiopian, Pistachio Croissant",
    discoveryTag: "Featured on Cairo Discover",
  },
};

export const PROBLEMS_CONTENT = {
  tag: "The Cafe Challenge in Egypt",
  title: "Why great coffee shops struggle to keep and find customers",
  subtitle:
    "Egypt's coffee scene is booming, with incredible new cafes opening every week. But relying on foot traffic alone leaves cafe owners facing three major hurdles:",
  items: [
    {
      title: "Guests Visit Once and Never Return",
      description:
        "Customers love your coffee, but with dozens of spots around, they forget to return. Without an incentive to come back, you lose repeat revenue every single day.",
      icon: "users-lost",
    },
    {
      title: "No Way to Know or Reach Your Customers",
      description:
        "You serve hundreds of cups daily, but you don't know who your regulars are, how often they drop by, or what brings them through the door.",
      icon: "chart-empty",
    },
    {
      title: "Hidden from New People & Costly Printed Menus",
      description:
        "Passersby don't know your cafe exists, and updating printed menus with price shifts or seasonal drinks is slow, expensive, and wasteful.",
      icon: "menu-alert",
    },
  ],
};

export const HOW_IT_WORKS_CONTENT = {
  tag: "How Notch Works",
  title: "Effortless for coffee lovers. Powerful for cafe teams.",
  subtitle:
    "No app to download from an app store, no complicated sign-up. A fast mobile web routine that takes just one second at the counter.",
  customerSteps: [
    {
      step: "01",
      title: "Discover & Check the Menu",
      description:
        "Browse local independent cafes in your neighborhood, view prices and signature drinks before you even leave home.",
      role: "Customer",
    },
    {
      step: "02",
      title: "Show Your QR on Each Visit",
      description:
        "When paying at checkout, display your personal QR code on your phone. The barista scans it in a single second.",
      role: "Customer",
    },
    {
      step: "03",
      title: "Get Rewarded for Coming Back",
      description:
        "Collect stamps with every visit. When you hit the cafe's target, enjoy a free coffee, pastry, or special treat.",
      role: "Customer",
    },
  ],
  cafeRow: {
    tag: "For Cafe Teams",
    title: "How Egyptian cafes use Notch on shift",
    steps: [
      {
        step: "01",
        title: "Set Up Your Cafe",
        description:
          "Create your cafe profile, upload your menu, set your visit target (e.g. 8 visits = free drink), and define rewards.",
      },
      {
        step: "02",
        title: "Scan Visits in 1 Second",
        description:
          "Baristas open the scanner on any mobile, tablet, or POS browser. One quick scan records the customer's visit.",
      },
      {
        step: "03",
        title: "See Regulars Grow & Get Discovered",
        description:
          "Watch your return rates climb while new customers discover your cafe on the platform at zero extra advertising cost.",
      },
    ],
  },
  scannerDeepDive: {
    title: "How does scanning work at the counter?",
    description:
      "We built Notch for fast-paced cafe counters where every second counts. Here is how simple and safe it is:",
    securityPoints: [
      "One stamp awarded per visit to prevent accidental double-scans",
      "Single-use reward QR codes that automatically complete upon counter redemption",
      "No passwords or sensitive personal data stored inside the customer's QR code",
      "Fast camera scanning works on any smartphone or tablet browser without new POS hardware",
    ],
  },
};

export const ONLINE_MENU_CONTENT = {
  tag: "Online Digital Menu",
  title: "Your cafe's menu on every customer's phone",
  subtitle:
    "Give customers a fast, clean digital menu they can browse from anywhere. Update prices and seasonal items in seconds without reprinting costs.",
  highlights: [
    {
      title: "Instant Live Updates",
      description:
        "Change coffee bean origins, seasonal drinks, or pastry prices in seconds from your dashboard. Never print paper menus again.",
      icon: "refresh",
      comingSoon: false,
    },
    {
      title: "Browse Before Visiting",
      description:
        "Customers exploring your cafe can check your specialty drinks, pour-over selections, and bakery offerings right from their phone.",
      icon: "smartphone",
      comingSoon: false,
    },
    {
      title: "Digital Table Ordering & Requests",
      description:
        "Interactive table QR ordering and direct drink customization are currently in development for Egyptian cafes.",
      icon: "layers",
      comingSoon: true,
    },
  ],
};

export const EXPOSURE_CONTENT = {
  tag: "Free Platform Exposure",
  title: "Get discovered by coffee enthusiasts across Egypt",
  subtitle:
    "Paid social ads are expensive and fleeting. Notch puts your cafe directly in front of active coffee lovers who are actively looking for new spots to visit.",
  points: [
    {
      title: "Featured in Discover",
      description:
        "Cafes on our marketing plans are highlighted in the Discover section, showing your photos, location, and rewards to users browsing for coffee.",
      badge: "Organic Exposure",
      comingSoon: false,
    },
    {
      title: "Zero Extra Advertising Spend",
      description:
        "No complex ad managers or cost-per-click charges. Your cafe exposure is built directly into your Notch subscription.",
      badge: "Included Free",
      comingSoon: false,
    },
    {
      title: "Turn Platform Browsers into Walk-in Guests",
      description:
        "Coffee lovers in Cairo, Giza, and Alexandria discover your menu and reward perks, giving them an immediate reason to stop by.",
      badge: "Real Foot Traffic",
      comingSoon: false,
    },
  ],
};

export const CUSTOMER_BENEFITS = {
  tag: "For Coffee Lovers",
  title: "Discover great cafes and get rewarded for visiting",
  subtitle:
    "Explore the best independent coffee shops across Egypt and get treated for being a regular.",
  items: [
    {
      title: "Discover New Cafes Across Egypt",
      description:
        "Find hidden specialty roasters and neighborhood gems in Cairo, Giza, Alexandria, and beyond.",
      badge: "Explore & Discover",
    },
    {
      title: "Browse the Menu Before You Leave",
      description:
        "Check signature drinks, pour-over options, prices, and opening hours right from your phone.",
      badge: "Digital Menu",
    },
    {
      title: "Come Back and Get Rewarded",
      description:
        "Every visit counts towards a free flat white, iced Spanish latte, or fresh pastry. Free treats for enjoying your daily coffee.",
      badge: "Free Treats",
    },
    {
      title: "One Personal QR for Every Cafe",
      description:
        "One clean account works across all participating cafes. No wallets, no cards—just your phone.",
      badge: "One Account",
    },
  ],
};

export const CAFE_FEATURES = {
  tag: "For Cafe Owners & Managers",
  title: "Everything your cafe needs to grow repeat revenue",
  subtitle:
    "A clean, responsive dashboard engineered for busy Egyptian coffee bars and thoughtful managers.",
  features: [
    {
      title: "Repeat-Customer Engine",
      description:
        "Set your visit target (e.g. 6, 8, or 10 visits) and reward regulars with free drinks or treats to keep them coming back.",
      icon: "gift",
      comingSoon: false,
    },
    {
      title: "1-Second QR Scanner Terminal",
      description:
        "Works smoothly in any mobile, tablet, or POS browser with camera access. Includes quick manual code entry as a backup.",
      icon: "scanner",
      comingSoon: false,
    },
    {
      title: "Customer Directory & Visit History",
      description:
        "See who your customers are, total lifetime visits, and your most loyal regulars with searchable profiles.",
      icon: "users",
      comingSoon: false,
    },
    {
      title: "Free Exposure on Discover",
      description:
        "Your cafe is shown to coffee lovers browsing the platform in your city, driving new foot traffic at zero extra advertising cost.",
      icon: "sparkles",
      comingSoon: false,
    },
    {
      title: "Staff & Barista Workstation Accounts",
      description:
        "Give your floor team barista access to scan visits while keeping sensitive business settings and financials restricted to owners.",
      icon: "shield",
      comingSoon: false,
    },
    {
      title: "Live Visit Activity Log",
      description:
        "Review every stamp grant, visit timestamp, and reward redemption in a transparent, real-time activity feed.",
      icon: "list",
      comingSoon: false,
    },
    {
      title: "Digital Online Menu",
      description:
        "Publish your signature beverages and prices online. Interactive ordering and self-service editing are currently in progress.",
      icon: "menu",
      comingSoon: true,
    },
    {
      title: "Advanced Customer Retention Analytics",
      description:
        "Cohort visit frequency, peak hour analysis, and repeat customer retention graphs are currently in development.",
      icon: "analytics",
      comingSoon: true,
    },
  ],
};

export const PLATFORM_NOTE = {
  headline: "More growth tools for Egyptian cafes are on the way",
  detail:
    "We are building Notch hand-in-hand with independent coffee shops in Egypt. More tools to understand your regulars and streamline counter operations are coming soon.",
  badge: "Roadmap for Egypt",
};

export const FAQ_ITEMS = [
  {
    question: "Is Notch free for customers?",
    answer:
      "Yes, completely free! Customers in Egypt never pay to use Notch. Creating an account takes 10 seconds, and you can collect rewards across all participating cafes.",
  },
  {
    question: "My customers aren't used to loyalty cards in Egypt — will this work?",
    answer:
      "Yes, because customers don't need to know anything about 'loyalty cards'. When paying at checkout, they simply open their personal QR code on their phone, the barista scans it in a second, and they earn a stamp towards a free drink or pastry. It is fast, intuitive, and gives them an instant reason to come back.",
  },
  {
    question: "Do customers or baristas need to install an app from the App Store or Google Play?",
    answer:
      "No app download is required. Notch is built as a lightning-fast progressive web app that runs in any phone browser. Customers and staff can pin it to their home screen with one tap.",
  },
  {
    question: "How does the free exposure work for cafes?",
    answer:
      "Cafes on our Growth and Pro plans are highlighted in the Discover section of Notch. When coffee lovers in your city browse for new spots, your cafe, menu, and rewards are displayed to them at no extra advertising cost. We provide genuine, organic visibility to people who already love visiting cafes.",
  },
  {
    question: "Can I update my cafe's menu and rewards anytime?",
    answer:
      "Yes! You have full control from your dashboard. You can adjust prices, add seasonal drinks (like Ramadan or summer specials), and update reward requirements anytime with zero reprinting costs.",
  },
  {
    question: "How do baristas scan customer QR codes?",
    answer:
      "Baristas open the Notch Staff Portal on any smartphone, tablet, or POS browser. The camera terminal scans the customer's QR code in one second and confirms the visit immediately. There is also a manual code entry option as a backup.",
  },
  {
    question: "How do I join as a cafe in Egypt?",
    answer:
      "Simply fill out the inquiry form on our Contact & Apply page. Our local team in Cairo will review your cafe details, set up your profile and rewards, and help your baristas start scanning in less than 24 hours.",
  },
];

export const CONTACT_PAGE_CONTENT = {
  tag: "Partner With Us in Egypt",
  title: "Bring Notch to your cafe counter",
  subtitle:
    "Tell us about your coffee shop, your location, and let's start turning one-time visitors into your most loyal regulars.",
  contactEmail: "info@notchloyalty.com",
  form: {
    cafeNameLabel: "Cafe Name",
    cafeNamePlaceholder: "e.g. Al-Moez Specialty Coffee",
    ownerNameLabel: "Owner / Manager Name",
    ownerNamePlaceholder: "e.g. Ahmed Mostafa",
    emailLabel: "Work Email Address",
    emailPlaceholder: "ahmed@almoezcoffee.com",
    phoneLabel: "Phone Number (Egypt)",
    phonePlaceholder: "+20 10x xxx xxxx",
    cityLabel: "City / District",
    cityPlaceholder: "e.g. Zamalek, Cairo or Smouha, Alexandria",
    planLabel: "Interested Plan Tier",
    messageLabel: "Tell us about your cafe & estimated daily guests",
    messagePlaceholder: "We serve about 180 coffee lovers daily in New Cairo and want to reward returning guests...",
    submitBtn: "Submit Cafe Application",
    successTitle: "Application Received!",
    successMessage:
      "Thank you for reaching out! Our team in Cairo will contact you via WhatsApp or phone within 1 business day with your portal invite.",
  },
};
