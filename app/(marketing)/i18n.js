"use client";

import { create } from "zustand";

export const I18N_CONTENT = {
  en: {
    common: {
      brand: "Notch",
      tagline: "Digital loyalty platform for independent cafes in Egypt",
      startForFree: "Start for free",
      exploreCafes: "Explore Cafes",
      login: "Log in",
      customerCard: "Customer Card",
      cafePartner: "Cafe Partner",
      allRightsReserved: "All rights reserved.",
      builtForEgypt: "Built for independent cafes in Egypt",
      noAppDownload: "No app download required",
    },
    header: {
      brandSub: "DIGITAL LOYALTY",
      nav: {
        features: "Features",
        howItWorks: "How It Works",
        pricing: "Pricing",
      },
      auth: {
        login: "Log in",
        account: "Open my account",
        dashboard: "Open dashboard",
      },
      langSwitch: "العربية",
      langAria: "Switch language to Arabic",
      themeToggle: "Toggle light or dark theme",
      menuOpen: "Open menu",
      menuClose: "Close menu",
    },
    footer: {
      description:
        "Turn one-time cafe visitors into loyal regulars and get discovered by new coffee enthusiasts across Egypt. A simple QR repeat-reward engine, instant digital menus, and free platform exposure.",
      location: "Cairo & Alexandria, Egypt",
      platformTitle: "Platform",
      communityTitle: "Community",
      legalTitle: "Legal & Safety",
      links: {
        features: "Features",
        howItWorks: "How It Works",
        pricing: "Pricing",
        cafeDashboard: "Cafe Dashboard",
        about: "About Notch",
        partnerCafes: "Partner Cafes in Egypt",
        applyCafe: "Apply Your Cafe",
        customerLogin: "Customer Login",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      },
      builtForCafes: "Built for independent coffee shops in Egypt.",
    },
    hero: {
      badge: "Built for Independent Cafes in Egypt",
      trusted: "Trusted by {count} cafes",
      headlinePrefix: "Turn one-time visitors into",
      headlineHighlight: "lifelong regulars.",
      subline: "QR rewards that bring customers back. Digital menus and free discovery included.",
      ctaPrimary: "Start for free",
      ctaSecondary: "Explore Cafes",
      trustItems: [
        { label: "No app download", id: "app" },
        { label: "Setup in minutes", id: "setup" },
        { label: "Free to start", id: "free" },
      ],
      socialProof: {
        text: "Loved by cafe owners across Egypt",
        rating: "5.0 rating",
      },
      mockup: {
        cafeName: "Al-Moez Specialty Coffee",
        category: "Specialty Espresso Bar • Zamalek",
        sampleBadge: "Live Preview",
        tabRewards: "Rewards",
        tabMenu: "Menu",
        tabQr: "My QR",
        visitRewards: "Visit Rewards",
        visitsCount: "{current}/{target} Visits",
        rewardText: "Free flat white or iced latte at 8 visits",
        showQrBtn: "Show QR Code at Checkout",
        freeTag: "FREE",
        floatingDiscovery: {
          title: "Free Discovery",
          subtitle: "Featured in Cairo",
        },
        floatingReward: {
          title: "3 Visits to Free Drink",
          subtitle: "5 of 8 completed",
        },
        floatingGrowth: {
          title: "+32% returning guests",
          subtitle: "128 visits this week",
        },
        menuItems: [
          { name: "Spanish Latte (Iced)", desc: "Signature condensed milk blend", price: "95 EGP" },
          { name: "V60 Ethiopian Yirgacheffe", desc: "Floral, jasmine, light roast", price: "110 EGP" },
          { name: "Pistachio Butter Croissant", desc: "Baked fresh daily in-house", price: "85 EGP" },
        ],
        menuNote: "Updated live by cafe • No paper reprint needed",
        qrHeading: "Your Personal Loyalty Pass",
        qrSubheading: "Valid across all participating cafes in Egypt",
        qrCodeHint: "Member Code: EG-8821",
        qrInstruction: "Keep this screen visible when approaching the counter",
      },
    },
    home: {
      problems: {
        tag: "The Cafe Challenge in Egypt",
        title: "Why great coffee shops struggle to keep and find customers",
        subtitle:
          "Egypt's coffee scene is booming, with incredible new cafes opening every week. But relying on foot traffic alone leaves cafe owners facing three major hurdles:",
        items: [
          {
            title: "Guests Visit Once and Never Return",
            description:
              "Customers love your coffee, but with dozens of spots around, they forget to return. Without an incentive to come back, you lose repeat revenue every single day.",
          },
          {
            title: "No Way to Know or Reach Your Customers",
            description:
              "You serve hundreds of cups daily, but you don't know who your regulars are, how often they drop by, or what brings them through the door.",
          },
          {
            title: "Hidden from New People & Costly Printed Menus",
            description:
              "Passersby don't know your cafe exists, and updating printed menus with price shifts or seasonal drinks is slow, expensive, and wasteful.",
          },
        ],
      },
      howItWorks: {
        tag: "How Notch Works",
        title: "Effortless for coffee lovers. Powerful for cafe teams.",
        subtitle:
          "No app to download from an app store, no complicated sign-up. A fast mobile web routine that takes just one second at the counter.",
        customersTitle: "For Coffee Lovers",
        cafesTitle: "For Cafe Owners & Teams",
        customerSteps: [
          {
            step: "01",
            title: "Discover & Check the Menu",
            description:
              "Browse local independent cafes in your neighborhood, view prices and signature drinks before you even leave home.",
          },
          {
            step: "02",
            title: "Show Your QR on Each Visit",
            description:
              "When paying at checkout, display your personal QR code on your phone. The barista scans it in a single second.",
          },
          {
            step: "03",
            title: "Get Rewarded for Coming Back",
            description:
              "Collect stamps with every visit. When you hit the cafe's target, enjoy a free coffee, pastry, or special treat.",
          },
        ],
        cafeSteps: [
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
      digitalMenu: {
        tag: "Online Digital Menu",
        title: "Your cafe's menu on every customer's phone",
        subtitle:
          "Give customers a fast, clean digital menu they can browse from anywhere. Update prices and seasonal items in seconds without reprinting costs.",
        items: [
          {
            title: "Instant Live Updates",
            description:
              "Change coffee bean origins, seasonal drinks, or pastry prices in seconds from your dashboard. Never print paper menus again.",
          },
          {
            title: "Browse Before Visiting",
            description:
              "Customers exploring your cafe can check your specialty drinks, pour-over selections, and bakery offerings right from their phone.",
          },
          {
            title: "Digital Table Ordering & Requests",
            description:
              "Interactive table QR ordering and direct drink customization are currently in development for Egyptian cafes.",
            comingSoon: true,
          },
        ],
      },
      exposure: {
        tag: "Free Platform Exposure",
        title: "Get discovered by coffee enthusiasts across Egypt",
        subtitle:
          "Paid social ads are expensive and fleeting. Notch puts your cafe directly in front of active coffee lovers who are actively looking for new spots to visit.",
        items: [
          {
            title: "Featured in Discover",
            description:
              "Cafes on our marketing plans are highlighted in the Discover section, showing your photos, location, and rewards to users browsing for coffee.",
            badge: "Organic Exposure",
          },
          {
            title: "Zero Extra Advertising Spend",
            description:
              "No complex ad managers or cost-per-click charges. Your cafe exposure is built directly into your Notch subscription.",
            badge: "Included Free",
          },
          {
            title: "Turn Browsers into Walk-in Guests",
            description:
              "Coffee lovers in Cairo, Giza, and Alexandria discover your menu and reward perks, giving them an immediate reason to stop by.",
            badge: "Real Foot Traffic",
          },
        ],
      },
      customerBenefits: {
        tag: "For Coffee Lovers",
        title: "Discover great cafes and get rewarded for visiting",
        subtitle:
          "Explore the best independent coffee shops across Egypt and get treated for being a regular.",
        freeLabel: "Free for Coffee Lovers",
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
      },
      cafeFeatures: {
        tag: "For Cafe Owners & Managers",
        title: "Everything your cafe needs to grow repeat revenue",
        subtitle:
          "A clean, responsive dashboard engineered for busy Egyptian coffee bars and thoughtful managers.",
        items: [
          {
            title: "Repeat-Customer Engine",
            description:
              "Set your visit target (e.g. 6, 8, or 10 visits) and reward regulars with free drinks or treats to keep them coming back.",
          },
          {
            title: "1-Second QR Scanner Terminal",
            description:
              "Works smoothly in any mobile, tablet, or POS browser with camera access. Includes quick manual code entry as a backup.",
          },
          {
            title: "Customer Directory & Visit History",
            description:
              "See who your customers are, total lifetime visits, and your most loyal regulars with searchable profiles.",
          },
          {
            title: "Free Exposure on Discover",
            description:
              "Your cafe is shown to coffee lovers browsing the platform in your city, driving new foot traffic at zero extra advertising cost.",
          },
          {
            title: "Staff Workstation Accounts",
            description:
              "Give your floor team barista access to scan visits while keeping sensitive business settings and financials restricted to owners.",
          },
          {
            title: "Live Visit Activity Log",
            description:
              "Review every stamp grant, visit timestamp, and reward redemption in a transparent, real-time activity feed.",
          },
        ],
      },
      platformNote: {
        badge: "Roadmap for Egypt",
        headline: "More growth tools for Egyptian cafes are on the way",
        detail:
          "We are building Notch hand-in-hand with independent coffee shops in Egypt. More tools to understand your regulars and streamline counter operations are coming soon.",
      },
      faq: {
        tag: "Frequently Asked Questions",
        title: "Questions & Answers",
        subtitle: "Clear answers for coffee lovers and cafe owners.",
        items: [
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
        ],
      },
      finalCta: {
        badge: "Built for Egypt's Coffee Scene",
        headline: "Ready to turn visitors into regulars?",
        subline:
          "Join independent coffee shops across Cairo, Giza, and Alexandria growing repeat visits with Notch.",
        ctaCafe: "Start for free",
        ctaCustomer: "Explore as Customer",
      },
    },
    featuresPage: {
      badge: "Platform Capabilities",
      title: "A Growth Engine for Egyptian Cafes",
      subtitle:
        "Everything your coffee shop needs to turn one-time visitors into loyal regulars, showcase your digital menu, and get discovered by new coffee enthusiasts.",
      sectionTitle: "Cafe Staff & Counter Tools",
      sectionSubtitle:
        "A fast, responsive terminal and management system built for busy Egyptian coffee counters.",
    },
    howItWorksPage: {
      badge: "Step-by-Step Walkthrough",
      title: "How Notch Works",
      subtitle:
        "Everything designed to save precious seconds at the coffee counter. Here is how both sides of the experience connect seamlessly.",
      customerTitle: "The Customer Experience",
      customerSubtitle: "From discovering a neighborhood spot to claiming your free flat white.",
      cafeTitle: "The Cafe Barista Workflow",
      cafeSubtitle: "Speed-optimized for morning rush hours with zero bulky hardware.",
    },
    pricingPage: {
      badge: "Cafe Subscriptions",
      title: "Transparent plans for every coffee shop",
      subtitle:
        "Customers always collect stamps for free. Choose the tier that matches your monthly regulars and staff setup.",
      trialNote: "Start for free on our Starter plan. Upgrade anytime as your cafe grows.",
      faqTitle: "Pricing & Plan Questions",
      faqSubtitle: "Need custom limits or multi-location support? Contact us for tailored setups.",
      month: "/mo",
      currency: "EGP",
      freeForever: "Free",
      mostPopular: "Most Popular",
      ctaPaid: "Apply for this Plan",
      ctaFree: "Start Free Today",
      noCreditCard: "No credit card required to start",
      compareTitle: "Detailed Plan Comparison",
      compareSubtitle: "Side-by-side breakdown of features and limits across all tiers.",
      featureLabels: {
        digital_menu: "Digital online menu showcase",
        activity_history: "Live visit activity log",
        multi_staff: "Multi-staff barista accounts",
        promotional_campaigns: "Free exposure on Discover (Featured Cafe)",
        unlimited_customers: "Unlimited regular customers",
        unlimited_rewards: "Unlimited reward offerings",
      },
      table: {
        featureCol: "Feature / Capability",
        visitsCol: "Monthly Visit Scans",
        rewardsCol: "Active Reward Items",
        staffCol: "Barista Staff Accounts",
        analyticsCol: "Visit Activity Log",
        menuCol: "Online Digital Menu",
        exposureCol: "Discover Exposure",
        trialCol: "Free Trial",
        unlimited: "Unlimited",
        trialValue: "7 days free trial",
        included: "Included",
        notIncluded: "—",
      },
    },
    contactPage: {
      tag: "Partner With Us in Egypt",
      title: "Bring Notch to your cafe counter",
      subtitle:
        "Tell us about your coffee shop, your location, and let's start turning one-time visitors into your most loyal regulars.",
      stepsTitle: "What happens after you apply?",
      step1: "We confirm your cafe details and customize your stamp targets.",
      step2: "We issue your manager login and barista staff invitations.",
      step3: "Your staff starts scanning visits immediately—no new hardware required.",
      directInquiries: "Direct inquiries:",
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
        submitting: "Submitting...",
        successTitle: "Application Received!",
        successMessage:
          "Thank you for reaching out! Our team in Cairo will contact you via WhatsApp or phone within 1 business day with your portal invite.",
        submitAnother: "Submit another application",
      },
    },
    aboutPage: {
      badge: "About Notch",
      title: "Helping independent cafes grow regulars",
      p1: "Notch is a growth platform for independent cafes in Egypt. We help coffee shops turn one-time guests into loyal regulars through frictionless QR stamp rewards, online digital menus, and community exposure.",
      p2: "Customers use a single persistent QR code across all participating cafes. Every cafe configures its own stamp targets, reward items, and staff accounts in a fully isolated, private dashboard.",
      p3: "We are proud to support Egypt's thriving specialty coffee culture in Cairo, Giza, Alexandria, and beyond.",
      contactLink: "contact our team",
    },
    privacyPage: {
      badge: "Legal & Data Protection",
      title: "Privacy Policy",
      lastUpdated: "Last updated: November 2026",
      s1Title: "1. Information We Collect",
      s1Text:
        "Notch collects basic account information required to provide loyalty services: name, email address, voluntary phone number, and transaction logs of stamps earned and rewards redeemed at participating cafes.",
      s2Title: "2. How Your Loyalty QR Code Works",
      s2Text:
        "Your personal customer QR code contains only an opaque, cryptographically generated token identifier. It does not expose your password, payment information, or contact details to anyone scanning the code.",
      s3Title: "3. Data Isolation Between Cafes",
      s3Text:
        "Each cafe's visit logs, stamp configuration, and customer activity are scoped securely to that business. One cafe cannot view another cafe's private data, revenue, or staff operations.",
      s4Title: "4. Contact Us",
      s4Text:
        "For privacy inquiries or account deletion requests, please contact our support team via our Contact page.",
    },
    termsPage: {
      badge: "Platform Terms",
      title: "Terms of Service",
      lastUpdated: "Last updated: November 2026",
      s1Title: "1. Platform Purpose",
      s1Text:
        "Notch provides a digital loyalty platform connecting coffee consumers with participating independent cafes. We facilitate visit stamp tracking and reward redemptions.",
      s2Title: "2. Fair Loyalty Usage & Anti-Abuse",
      s2Text:
        "Customer visits may only be recorded in person during an actual purchase at the cafe counter. Attempting to automate scans, spoof QR identifiers, or award unauthorized stamps constitutes grounds for immediate account suspension.",
      s3Title: "3. Cafe Responsibility for Rewards",
      s3Text:
        "Participating cafes configure and honor their own rewards (such as free drinks or pastries) in accordance with their posted store policies and stock availability.",
      s4Title: "4. Inquiries",
      s4Text: "Questions regarding these terms may be submitted through our Contact page.",
    },
  },
  ar: {
    common: {
      brand: "نوتش",
      tagline: "منصة الولاء الرقمية للكافيهات المستقلة في مصر",
      startForFree: "ابدأ مجاناً",
      exploreCafes: "استكشف الكافيهات",
      login: "تسجيل الدخول",
      customerCard: "بطاقة الزبون",
      cafePartner: "شريك كافيه",
      allRightsReserved: "جميع الحقوق محفوظة.",
      builtForEgypt: "صُمم للكافيهات المستقلة في مصر",
      noAppDownload: "بدون تحميل تطبيق",
    },
    header: {
      brandSub: "بطاقة ولاء رقمية",
      nav: {
        features: "المميزات",
        howItWorks: "كيف يعمل",
        pricing: "الأسعار",
      },
      auth: {
        login: "تسجيل الدخول",
        account: "حسابي الشخصي",
        dashboard: "لوحة التحكم",
      },
      langSwitch: "English",
      langAria: "التبديل إلى اللغة الإنجليزية",
      themeToggle: "تبديل المظهر الليلي أو النهاري",
      menuOpen: "فتح القائمة",
      menuClose: "إغلاق القائمة",
    },
    footer: {
      description:
        "حوّل زوار المرة الأولى إلى زبائن دائمين واكتسب محبي قهوة جدد في أنحاء مصر. نظام ولاء رقمي برمز QR، منيو إلكتروني فوري، وظهور مجاني للكافيه.",
      location: "القاهرة والإسكندرية، مصر",
      platformTitle: "المنصة",
      communityTitle: "المجتمع",
      legalTitle: "القانون والأمان",
      links: {
        features: "المميزات",
        howItWorks: "كيف يعمل",
        pricing: "الأسعار",
        cafeDashboard: "لوحة تحكم الكافيه",
        about: "عن نوتش",
        partnerCafes: "الكافيهات الشريكة في مصر",
        applyCafe: "سجل كافيهك",
        customerLogin: "دخول الزبائن",
        privacy: "سياسة الخصوصية",
        terms: "شروط الخدمة",
      },
      builtForCafes: "صُمم خصيصاً لكافيهات القهوة المستقلة في مصر.",
    },
    hero: {
      badge: "صُمم للكافيهات المستقلة في مصر",
      trusted: "موثوق من أكثر من {count} كافيه",
      headlinePrefix: "حوّل زوار المرة الأولى إلى",
      headlineHighlight: "زبائن دائمين مدى الحياة.",
      subline: "مكافآت QR تُعيد الزبائن لكافيهك. منيو رقمي وظهور مجاني للزبائن.",
      ctaPrimary: "ابدأ مجاناً",
      ctaSecondary: "استكشف الكافيهات",
      trustItems: [
        { label: "بدون تحميل تطبيق", id: "app" },
        { label: "إعداد خلال دقائق", id: "setup" },
        { label: "البداية مجاناً", id: "free" },
      ],
      socialProof: {
        text: "محل ثقة أصحاب الكافيهات في أنحاء مصر",
        rating: "تقييم 5.0",
      },
      mockup: {
        cafeName: "قهوة المعز المختصة",
        category: "اسبريسو بار مختص • الزمالك، القاهرة",
        sampleBadge: "معاينة حية",
        tabRewards: "المكافآت",
        tabMenu: "المنيو",
        tabQr: "رمز QR",
        visitRewards: "مكافآت الزيارات",
        visitsCount: "{current}/{target} زيارات",
        rewardText: "فلات وايت أو لاتيه مثلج مجاناً عند 8 زيارات",
        showQrBtn: "أظهر رمز QR عند الدفع",
        freeTag: "مجاناً",
        floatingDiscovery: {
          title: "ظهور مجاني",
          subtitle: "مميز في القاهرة",
        },
        floatingReward: {
          title: "3 زيارات للمشروب المجاني",
          subtitle: "اكتمل 5 من 8",
        },
        floatingGrowth: {
          title: "+32% عودة الزبائن",
          subtitle: "128 زيارة هذا الأسبوع",
        },
        menuItems: [
          { name: "سبانيش لاتيه (مثلج)", desc: "مزيج الحليب المكثف المميز", price: "95 ج.م" },
          { name: "V60 إثيوبي ييرغاتشيف", desc: "إيحاءات زهرية، ياسمين، تحميص خفيف", price: "110 ج.م" },
          { name: "كرواسون زبدة بالفستق", desc: "طازج يومياً داخل الكافيه", price: "85 ج.م" },
        ],
        menuNote: "تحديث فوري من الكافيه • بدون إعادة طباعة ورقية",
        qrHeading: "بطاقة الولاء الرقمية الخاصة بك",
        qrSubheading: "تعمل في جميع الكافيهات الشريكة في مصر",
        qrCodeHint: "رمز العضوية: EG-8821",
        qrInstruction: "أظهر هذه الشاشة للباريستا عند الكاونتر",
      },
    },
    home: {
      problems: {
        tag: "تحديات الكافيهات في مصر",
        title: "لماذا تواجه الكافيهات الرائعة صعوبة في الاحتفاظ بالزبائن؟",
        subtitle:
          "مشهد القهوة في مصر ينمو بسرعة مذهلة مع كافيهات جديدة كل أسبوع. لكن الاعتماد على المارة وحده يضع الكافيه أمام 3 عقبات رئيسية:",
        items: [
          {
            title: "الزبائن يزورون مرة واحدة ولا يعودون",
            description:
              "الزبائن يعجبهم مذاق قهوتك، لكن مع وجود عشرات الخيارات حولهم ينسون العودة. وبدون دافع واضح للرجوع، تخسر دخلاً متكرراً يومياً.",
          },
          {
            title: "لا توجد طريقة للتعرف على زبائنك",
            description:
              "تقدم مئات الأكواب يومياً، لكنك لا تعرف من هم زبائنك الدائمون، وكم مرة يترددون عليك، وما الذي يفضلونه.",
          },
          {
            title: "غياب الظهور وتكاليف طباعة المنيو الورقي",
            description:
              "الكثير من عشاق القهوة لا يعرفون بوجود كافيهك، وتحديث المنيو الورقي مع تغير الأسعار أو المواسم مكلف وبطيء.",
          },
        ],
      },
      howItWorks: {
        tag: "كيف يعمل نوتش",
        title: "بسيط جداً للزبائن. قوي وسريع لفريق الكافيه.",
        subtitle:
          "بدون تحميل أي تطبيق من المتاجر، وبدون تسجيل معقد. مسح سريع عبر متصفح الموبايل يستغرق ثانية واحدة فقط عند الكاونتر.",
        customersTitle: "لعشاق القهوة",
        cafesTitle: "لأصحاب وفريق الكافيه",
        customerSteps: [
          {
            step: "01",
            title: "اكتشف الكافيه وتصفح المنيو",
            description:
              "استكشف كافيهات القهوة المختصة المستقلة في منطقتك، وتعرف على الأسعار والمشروبات قبل مغادرة منزلك.",
          },
          {
            step: "02",
            title: "أظهر رمز QR عند كل زيارة",
            description:
              "عند الدفع عند الكاونتر، أظهر رمز QR الخاص بك على شاشة هاتفك، ليمسحه الباريستا في ثانية واحدة.",
          },
          {
            step: "03",
            title: "اكسب مكافآت مقابل ولائك",
            description:
              "اجمع الختم الرقمي مع كل زيارة. وعند اكتمال بطاقتك، استمتع بقهوة أو حلوى مجانية من الكافيه.",
          },
        ],
        cafeSteps: [
          {
            step: "01",
            title: "اضبط إعدادات كافيهك",
            description:
              "أنشئ ملف كافيهك، ارفع المنيو، وحدد هدف الزيارات (مثلاً 8 زيارات = مشروب مجاني) والمكافأة المطلوبة.",
          },
          {
            step: "02",
            title: "امسح الزيارة في ثانية واحدة",
            description:
              "يفتح الباريستا الماسح عبر أي متصفح موبايل أو تابلت. مسحة واحدة بالكاميرا تسجل الزيارة فوراً.",
          },
          {
            step: "03",
            title: "شاهد نمو الزبائن والظهور المجاني",
            description:
              "راقب ارتفاع معدل عودة الزبائن مع اكتساب عملاء جدد عبر منصة نوتش بدون أي تكاليف إعلانية إضافية.",
          },
        ],
      },
      digitalMenu: {
        tag: "المنيو الرقمي الفوري",
        title: "منيو كافيهك على هاتف كل زبون",
        subtitle:
          "امنح زبائنك منيو رقمي سريع وأنيق يمكنهم تصفحه من أي مكان. حدّث الأسعار والمشروبات الموسمية في ثوانٍ بدون طباعة ورقية.",
        items: [
          {
            title: "تحديث فوري للأسعار",
            description:
              "غيّر محاصيل القهوة، المشروبات الموسمية، أو أسعار المخبوزات من لوحة التحكم في ثوانٍ وتخلص من تكاليف الطباعة.",
          },
          {
            title: "تصفح المنيو قبل الطلب",
            description:
              "يمكن للزبائن تصفح مشروباتك المختصة والخيارات المتاحة قبل الوصول للكاونتر لتسريع طوابير الطلب.",
          },
          {
            title: "الطلب المباشر من الطاولة",
            description:
              "ميزة الطلب التفاعلي برمز QR من الطاولة وتخصيص المشروبات قيد التطوير حالياً لكافيهات مصر.",
            comingSoon: true,
          },
        ],
      },
      exposure: {
        tag: "ظهور مجاني على المنصة",
        title: "اكتسب محبي قهوة جدد في مدينتك",
        subtitle:
          "الإعلانات الممولة مكلفة ومؤقتة. يضع نوتش كافيهك مباشرة أمام عشاق القهوة الباحثين عن أماكن جديدة لزيارتها.",
        items: [
          {
            title: "ظهور مميز في قسم الاستكشاف",
            description:
              "يظهر كافيهك في قسم الاستكشاف على المنصة مع صورك ومنيو ومكافآتك لكل من يبحث عن كافيهات جديدة.",
            badge: "ظهور طبيعي",
          },
          {
            title: "بدون ميزانيات إعلانية إضافية",
            description:
              "لا توجد إدارات إعلانية معقدة أو دفع بالنقرة. ظهور كافيهك مدمج مباشرة ضمن اشتراكك.",
            badge: "مدمج مجاناً",
          },
          {
            title: "تحويل متصفحي المنصة لزبائن حقيقيين",
            description:
              "يكتشف عشاق القهوة في القاهرة والجيزة والإسكندرية كافيهك ومكافآتك، مما يمنحهم سبباً فورياً للزيارة.",
            badge: "زيارات حقيقية",
          },
        ],
      },
      customerBenefits: {
        tag: "لعشاق القهوة",
        title: "اكتشف كافيهات رائعة واكسب مكافآت مع كل فنجان",
        subtitle:
          "استكشف أفضل محامص وكافيهات القهوة المستقلة في مصر واحصل على مشروبات وحلويات مجانية لكونك زبوناً وفياً.",
        freeLabel: "مجاناً دائماً لعشاق القهوة",
        items: [
          {
            title: "اكتشف كافيهات جديدة في مصر",
            description:
              "اعثر على محامص القهوة المختصة والمقاهي الهادئة في القاهرة والجيزة والإسكندرية وغيرها.",
            badge: "استكشف وتعرف",
          },
          {
            title: "تصفح المنيو والأسعار مسبقاً",
            description:
              "تعرف على المشروبات المختصة، خيارات التقطير V60، الأسعار، ومواعيد العمل من هاتفك مباشرة.",
            badge: "منيو رقمي",
          },
          {
            title: "عُد مجدداً واحصل على مكافأتك",
            description:
              "كل زيارة تقربك من فلات وايت، سبانيش لاتيه، أو كرواسون طازج مجاني تقديراً لولائك.",
            badge: "مكافآت مجانية",
          },
          {
            title: "رمز QR واحد لكل الكافيهات",
            description:
              "حساب رقمي واحد يعمل عبر جميع الكافيهات الشريكة. بدون بطاقات بلاستيكية أو بطاقات مفقودة.",
            badge: "حساب موحد",
          },
        ],
      },
      cafeFeatures: {
        tag: "لأصحاب ومديري الكافيهات",
        title: "كل ما تحتاجه لزيادة عودة الزبائن وأرباح الكافيه",
        subtitle:
          "لوحة تحكم ذكية وسريعة مصممة خصيصاً لكاونترات القهوة النشطة في مصر.",
        items: [
          {
            title: "محرك عودة الزبائن",
            description:
              "حدد هدف الزيارات (مثلاً 6 أو 8 أو 10 زيارات) وكافئ زبائنك لضمان تكرار زياراتهم لكافيهك دون غيره.",
          },
          {
            title: "ماسح QR الكاونتر في ثانية",
            description:
              "يعمل بسلاسة عبر أي متصفح موبايل أو تابلت مع دعم الإدخال اليدوي كخيار بديل سريع.",
          },
          {
            title: "دليل الزبائن وسجل الزيارات",
            description:
              "تعرف على زبائنك، إجمالي زياراتهم، وزبائنك الأكثر ولاءً مع إمكانية البحث في الملفات الشخصية.",
          },
          {
            title: "ظهور مجاني في الاستكشاف",
            description:
              "يظهر كافيهك للزبائن الباحثين عن كافيهات جديدة في مدينتك لجذب زبائن جدد بدون إعلانات مدفوعة.",
          },
          {
            title: "حسابات خاصة بالباريستا",
            description:
              "امنح فريقك حسابات مسح الزيارات فقط مع الحفاظ على خصوصية أرقام العمل والإعدادات للمالكين.",
          },
          {
            title: "سجل حركات الزيارات المباشر",
            description:
              "تابع كل ختم يُمنح، وأوقات الزيارات، واستبدال المكافآت في سجل لحظي شفاف ومحمي.",
          },
        ],
      },
      platformNote: {
        badge: "خارطة طريق مصر",
        headline: "المزيد من أدوات النمو لكافيهات مصر في الطريق",
        detail:
          "نبني نوتش يداً بيد مع أصحاب الكافيهات المستقلة في مصر. المزيد من أدوات فهم الزبائن وتسريع الكاونتر قادمة قريباً.",
      },
      faq: {
        tag: "الأسئلة الشائعة",
        title: "الأسئلة والأجوبة",
        subtitle: "إجابات واضحة لأصحاب الكافيهات وعشاق القهوة.",
        items: [
          {
            question: "هل نوتش مجاني للزبائن؟",
            answer:
              "نعم، مجاني تماماً بنسبة 100%! لا يدفع الزبائن في مصر أي مقابل لاستخدام نوتش. يستغرق إنشاء الحساب 10 ثوانٍ فقط، ويمكنك جمع المكافآت عبر جميع الكافيهات الشريكة.",
          },
          {
            question: "زبائني غير معتادين على كروت الولاء في مصر — هل سينجح ذلك؟",
            answer:
              "نعم بالتأكيد، لأن الزبائن لا يحتاجون لمعرفة أي شيء معقد عن 'برامج الولاء'. عند الدفع عند الكاونتر، يفتح الزبون ببساطة رمز QR الخاص به على هاتفه، يمسحه الباريستا في ثانية واحدة، ويكسب ختماً يقربه من مشروب أو صنف مجاني. العملية سريعة وبديهية وتمنحه سبباً فورياً للعودة مجدداً.",
          },
          {
            question: "هل يحتاج الزبائن أو فريق الباريستا لتحميل تطبيق من App Store أو Google Play؟",
            answer:
              "لا يلزم تحميل أي تطبيق. تم بناء نوتش كتطبيق ويب تقدمي فائق السرعة يعمل مباشرة في متصفح أي هاتف. يمكن للزبائن وفريق العمل تثبيته بضغطة واحدة على الشاشة الرئيسية.",
          },
          {
            question: "كيف يعمل الظهور المجاني في المنصة للكافيهات؟",
            answer:
              "تظهر الكافيهات المشتركة في باقاتنا المتقدمة في قسم الاستكشاف على نوتش. عندما يبحث عشاق القهوة في منطقتك عن أماكن جديدة، يُعرض كافيهك وصورك ومنيوهاتك ومكافآتك أمامهم بدون أي تكاليف إعلانية إضافية.",
          },
          {
            question: "هل يمكنني تعديل منيو كافيهي ومكافآته في أي وقت؟",
            answer:
              "نعم بكل سهولة! لديك تحكم كامل من لوحة التحكم. يمكنك تعديل الأسعار، وإضافة مشروبات موسمية (مثل مشروبات رمضان أو الصيف)، وتحديث أهداف المكافآت في أي وقت دون أي تكاليف طباعة ورقية.",
          },
          {
            question: "كيف يمسح الباريستا رموز QR للزبائن؟",
            answer:
              "يفتح الباريستا بوابة العمل على أي هاتف ذكي، تابلت، أو متصفح نقطة البيع. تقوم الكاميرا بمسح رمز QR في ثانية واحدة وتأكيد الزيارة فوراً. كما يتوفر خيار إدخال الرمز يدوياً كخيار احتياطي سريع.",
          },
          {
            question: "كيف أنضم ككافيه شريك في مصر؟",
            answer:
              "كل ما عليك هو ملء نموذج الطلب في صفحة تواصل معنا. سيقوم فريقنا المحلي في القاهرة بمراجعة تفاصيل كافيهك، وإعداد ملفك ومكافآتك، وتجهيز بوابتك للبدء خلال أقل من 24 ساعة.",
          },
        ],
      },
      finalCta: {
        badge: "صُمم لمشهد القهوة في مصر",
        headline: "جاهز لتحويل زوار كافيهك إلى زبائن دائمين؟",
        subline:
          "انضم إلى الكافيهات المستقلة في القاهرة والجيزة والإسكندرية التي تنمي عودة زبائنها مع نوتش.",
        ctaCafe: "ابدأ مجاناً",
        ctaCustomer: "استكشف كزبون",
      },
    },
    featuresPage: {
      badge: "إمكانيات المنصة",
      title: "محرك نمو الكافيهات المستقلة في مصر",
      subtitle:
        "كل ما يحتاجه كافيهك لتحويل زوار المرة الأولى إلى زبائن دائمين، وعرض منيو إلكتروني، واكتساب محبي قهوة جدد.",
      sectionTitle: "أدوات الكاونتر وفريق العمل",
      sectionSubtitle:
        "نظام كاونتر فائق السرعة وإدارة ذكية مصممة لضغط أوقات الذروة في كافيهات مصر.",
    },
    howItWorksPage: {
      badge: "دليل خطوة بخطوة",
      title: "كيف يعمل نوتش",
      subtitle:
        "صُمم كل شيء لتوفير الثواني الثمينة عند كاونتر القهوة. إليك كيف تتكامل التجربة بين الزبون والكافيه.",
      customerTitle: "تجربة الزبون",
      customerSubtitle: "من استكشاف كافيه في منطقتك وحتى استلام مشروبك المجاني.",
      cafeTitle: "سير عمل الباريستا في الكافيه",
      cafeSubtitle: "سرعة استثنائية في أوقات الذروة الصباحية بدون أي أجهزة إضافية.",
    },
    pricingPage: {
      badge: "اشتراكات الكافيهات",
      title: "خطط واضحة وشفافة لكل كافيه",
      subtitle:
        "الزبائن يجمعون المكافآت دائماً مجاناً. اختر الخطة التي تناسب عدد زبائنك وفريق عملك.",
      trialNote: "ابدأ مجاناً مع خطة Starter، ورقّ اشتراكك في أي وقت مع نمو كافيهك.",
      faqTitle: "أسئلة الخطط والأسعار",
      faqSubtitle: "تحتاج حدود مخصصة أو دعماً لفروع متعددة؟ تواصل معنا لتجهيز خطة مخصصة.",
      month: "/شهرياً",
      currency: "ج.م",
      freeForever: "مجاناً",
      mostPopular: "الأكثر طلباً",
      ctaPaid: "اختر هذه الخطة",
      ctaFree: "ابدأ مجاناً اليوم",
      freeTrialNotice: "تجربة مجانية لمدة 7 أيام على الخطة المجانية",
      noCreditCard: "بدون الحاجة لبطاقة بنكية",
      compareTitle: "مقارنة تفصيلية بين الخطط",
      compareSubtitle: "مقارنة شاملة للمميزات والحدود بين كافة الباقات المتاحة.",
      featureLabels: {
        digital_menu: "عرض المنيو الرقمي أونلاين (قريباً)",
        activity_history: "سجل نشاط الزيارات المباشر",
        multi_staff: "حسابات باريستا متعددة لفريق العمل",
        promotional_campaigns: "ظهور مجاني في صفحة الاستكشاف (كافيه مميز)",
        unlimited_customers: "عدد زبائن دائمين غير محدود",
        unlimited_rewards: "عروض مكافآت غير محدودة",
      },
      table: {
        featureCol: "الميزة والإمكانية",
        visitsCol: "حد مسح الزيارات الشهري",
        rewardsCol: "عروض المكافآت النشطة",
        staffCol: "حسابات الباريستا",
        analyticsCol: "سجل نشاط الزيارات",
        menuCol: "منيو رقمي أونلاين",
        exposureCol: "ظهور في الاستكشاف",
        trialCol: "فترة تجريبية",
        unlimited: "غير محدود",
        trialValue: "تجربة مجانية 7 أيام",
        included: "متضمن",
        notIncluded: "—",
      },
    },
    contactPage: {
      tag: "شارك معنا في مصر",
      title: "أطلق نوتش على كاونتر كافيهك",
      subtitle:
        "أخبرنا عن كافيهك وموقعك، ودعنا نبدأ معاً في تحويل زوار المرة الأولى إلى زبائنك الأكثر ولاءً.",
      stepsTitle: "ماذا يحدث بعد تقديم طلبك؟",
      step1: "نؤكد تفاصيل كافيهك ونخصص أهداف الأختام والمكافآت المطلوبة.",
      step2: "نصدر بيانات دخول المدير ودعوات الباريستا لفريق العمل.",
      step3: "يبدأ فريقك مسح الزيارات فوراً وبدون أي أجهزة خاصة.",
      directInquiries: "للتواصل المباشر:",
      form: {
        cafeNameLabel: "اسم الكافيه",
        cafeNamePlaceholder: "مثال: قهوة المعز المختصة",
        ownerNameLabel: "اسم المالك أو المدير",
        ownerNamePlaceholder: "مثال: أحمد مصطفى",
        emailLabel: "البريد الإلكتروني للعمل",
        emailPlaceholder: "ahmed@almoezcoffee.com",
        phoneLabel: "رقم الهاتف (مصر)",
        phonePlaceholder: "+20 10x xxx xxxx",
        cityLabel: "المدينة / الحي",
        cityPlaceholder: "مثال: الزمالك، القاهرة أو سموحة، الإسكندرية",
        planLabel: "الخطة المطلوبة",
        messageLabel: "أخبرنا عن كافيهك ومتوسط عدد الزوار يومياً",
        messagePlaceholder: "نقدم القهوة لنحو 180 محباً للقهوة يومياً في القاهرة الجديدة...",
        submitBtn: "إرسال طلب الانضمام",
        submitting: "جاري الإرسال...",
        successTitle: "تم استلام طلبك بنجاح!",
        successMessage:
          "شكراً لتواصلك معنا! سيتواصل معك فريقنا في القاهرة عبر الواتساب أو الهاتف خلال يوم عمل واحد لتفعيل حساب كافيهك.",
        submitAnother: "إرسال طلب آخر",
      },
    },
    aboutPage: {
      badge: "عن نوتش",
      title: "مساعدة الكافيهات المستقلة على تنمية زبائنها الدائمين",
      p1: "نوتش منصة نمو للكافيهات المستقلة في مصر، نساعد المقاهي على تحويل الزوار إلى زبائن أوفياء عبر أختام رقمية سريعة برمز QR، ومنيو إلكتروني، وظهور مجتمعي.",
      p2: "يستخدم الزبون رمز QR موحد ودائم يعمل عبر جميع الكافيهات الشريكة. ويدير كل كافيه أهدافه ومكافآته وفريقه بشكل آمن ومستقل تماماً.",
      p3: "فخورون بدعم ثقافة القهوة المختصة المزدهرة في القاهرة والجيزة والإسكندرية وجميع أنحاء مصر.",
      contactLink: "تواصل مع فريقنا",
    },
    privacyPage: {
      badge: "الخصوصية وحماية البيانات",
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: نوفمبر 2026",
      s1Title: "1. المعلومات التي نجمعها",
      s1Text:
        "يجمع نوتش المعلومات الأساسية اللازمة لتقديم الخدمة: الاسم، البريد الإلكتروني، رقم الهاتف الاختياري، وسجل الزيارات والأختام والمكافآت المستبدلة.",
      s2Title: "2. كيف يعمل رمز QR الخاص بك",
      s2Text:
        "يحتوي رمز QR الخاص بك على معرّف مشفر آمن فقط. ولا يشارك أبداً كلمات المرور أو أرقام البطاقات أو بياناتك الخاصة مع من يمسح الرمز.",
      s3Title: "3. عزل البيانات بين الكافيهات",
      s3Text:
        "بيانات وسجلات كل كافيه معزولة ومحمية بالكامل عن أي كافيه آخر. لا يمكن لأي كافيه الاطلاع على بيانات أو أرباح أو زبائن كافيه منافس.",
      s4Title: "4. التواصل معنا",
      s4Text:
        "لأي استفسار بخصوص الخصوصية أو لطلب حذف الحساب، يرجى التواصل معنا عبر صفحة الاتصال بنا.",
    },
    termsPage: {
      badge: "شروط المنصة",
      title: "شروط الخدمة",
      lastUpdated: "آخر تحديث: نوفمبر 2026",
      s1Title: "1. الغرض من المنصة",
      s1Text:
        "يوفر نوتش منصة ولاء رقمية تربط عشاق القهوة بالكافيهات المستقلة الشريكة، لتسهيل جمع الأختام والحصول على المكافآت.",
      s2Title: "2. الاستخدام العادل ومنع الاحتيال",
      s2Text:
        "يجب تسجيل الزيارة بحضور الزبون الفعلي عند الشراء عند الكاونتر. أي محاولة للتزييف أو منح أختام غير مصرح بها تؤدي إلى إيقاف الحساب فوراً.",
      s3Title: "3. مسؤولية الكافيه عن المكافآت",
      s3Text:
        "الكافيهات الشريكة مسؤولة عن تحديد مكافآتها والوفاء بها (مثل المشروبات المجانية أو المخبوزات) وفق سياساتها المعلنة وتوفر المخزون.",
      s4Title: "4. الاستفسارات",
      s4Text: "يمكن تقديم أي استفسار بشأن الشروط عبر صفحة الاتصال بنا.",
    },
  },
};

const getInitialLang = () => {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("notch_marketing_lang");
    return saved === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
};

export const useMarketingLanguage = create((set) => ({
  language: getInitialLang(),
  setLanguage: (lang) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", lang);
      try {
        localStorage.setItem("notch_marketing_lang", lang);
      } catch {}
    }
    set({ language: lang });
  },
  toggleLanguage: () => {
    set((state) => {
      const next = state.language === "en" ? "ar" : "en";
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", next);
        try {
          localStorage.setItem("notch_marketing_lang", next);
        } catch {}
      }
      return { language: next };
    });
  },
}));
