/**
 * Catalog of participating cafes on the Notch platform.
 * Supports multi-cafe discovery, QR routing, and individual cafe settings.
 */

export const CAFES_CATALOG = {
  "coffee-house": {
    id: "cafe-coffee-house",
    slug: "coffee-house",
    name: "Coffee House",
    tagline: "Specialty Coffee Roasters & Artisan Bakery",
    category: "Specialty Coffee & Bakery",
    isActive: true,
    isVerified: true,
    establishedYear: 2021,
    stampTarget: 10,
    accentColor: "#3B2418",

    // Visual assets
    coverImage:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Warm ambiance inside Coffee House",
    logoImage:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    logoAlt: "Coffee House Logo",

    // About Section
    about: {
      shortDescription:
        "Welcome to Coffee House. We are an independent specialty coffee bar and neighborhood bakery dedicated to ethical sourcing, precision brewing, and handcrafted pastries.",
      fullDescription:
        "Founded in 2021, Coffee House was born from a passion for single-origin coffees and traditional baking. We roast weekly micro-batches highlighting notes from micro-lot farms across Ethiopia, Colombia, and Guatemala. Every morning our bakers roll fresh croissants, sourdough loaves, and seasonal tarts.",
      highlights: [
        "Direct-Trade Specialty Beans",
        "Fresh Daily Artisan Bakery",
        "High-Speed Fiber Wi-Fi",
        "Pet-Friendly Garden Patio",
        "Plant-Based & Oat Milk Options",
        "Handcrafted Cold Brew on Tap",
      ],
    },

    // Location & Navigation
    location: {
      address: "42 Bloomsbury Street",
      district: "Bloomsbury",
      city: "London",
      postcode: "WC1B 3QJ",
      fullAddress: "42 Bloomsbury Street, Bloomsbury, London WC1B 3QJ",
      directionsHint: "2 mins walk from British Museum • Opposite St. George Gardens",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=42+Bloomsbury+Street+London+WC1B+3QJ",
    },

    // Operating Schedule
    openingHours: {
      timezone: "Europe/London",
      schedule: [
        { day: "Monday", open: "07:30", close: "19:00", isClosed: false },
        { day: "Tuesday", open: "07:30", close: "19:00", isClosed: false },
        { day: "Wednesday", open: "07:30", close: "19:00", isClosed: false },
        { day: "Thursday", open: "07:30", close: "20:00", isClosed: false },
        { day: "Friday", open: "07:30", close: "21:00", isClosed: false },
        { day: "Saturday", open: "08:30", close: "21:00", isClosed: false },
        { day: "Sunday", open: "08:30", close: "18:00", isClosed: false },
      ],
      holidayNotice: "Open on Bank Holidays (Sunday hours apply)",
    },

    // Contact
    contact: {
      phone: "+44 20 7946 0912",
      displayPhone: "+44 (0) 20 7946 0912",
      email: "hello@coffeehouse.london",
    },

    // Website
    website: {
      url: "https://coffeehouse.london",
      displayUrl: "coffeehouse.london",
    },

    // Social Media
    socialMedia: {
      instagram: {
        handle: "@coffeehouselondon",
        url: "https://instagram.com",
        followersCount: "14.2k",
      },
      facebook: {
        handle: "CoffeeHouseLondon",
        url: "https://facebook.com",
      },
      tiktok: {
        handle: "@coffeehouse",
        url: "https://tiktok.com",
      },
      whatsapp: {
        handle: "+44 7700 900123",
        url: "https://wa.me/447700900123",
      },
    },

    // Rewards Catalog for Coffee House
    rewards: [
      {
        id: "rew-ch-1",
        name: "Free Classic Coffee",
        category: "Coffee & Drinks",
        description: "Any single-origin espresso, Americano, or house batch drip brew of your choice.",
        stampsRequired: 5,
        tag: "Most Popular",
        iconType: "coffee",
      },
      {
        id: "rew-ch-2",
        name: "Fresh Artisan Dessert",
        category: "Bakery & Sweets",
        description: "Flaky almond croissant, warm cinnamon roll, or daily baked pastry slice.",
        stampsRequired: 8,
        tag: "Chef's Pick",
        iconType: "dessert",
      },
      {
        id: "rew-ch-3",
        name: "20% Off Total Bill",
        category: "Special Discount",
        description: "Enjoy 20% off your entire beverage and food order at the cashier.",
        stampsRequired: 10,
        tag: "Best Value",
        iconType: "discount",
      },
      {
        id: "rew-ch-4",
        name: "Signature Specialty Drink",
        category: "Specialty",
        description: "Any large seasonal latte, cold brew tonic, or handcrafted iced blend.",
        stampsRequired: 12,
        tag: "Premium",
        iconType: "specialty",
      },
      {
        id: "rew-ch-5",
        name: "Whole Bean Coffee (250g)",
        category: "Retail Merch",
        description: "A freshly roasted bag of our signature cafe blend to take home.",
        stampsRequired: 15,
        tag: "Exclusive",
        iconType: "beans",
      },
    ],

    // Menu preview
    menuPreview: {
      isAvailable: true,
      note: "Browse our signature drink and food categories below.",
      categories: [
        {
          id: "cat-espresso",
          title: "Espresso & Pourovers",
          count: "12 specialties",
          description: "Single-origins, flat whites, pour-overs & seasonal blends",
        },
        {
          id: "cat-bakery",
          title: "Artisan Bakery",
          count: "8 items daily",
          description: "Almond croissants, cinnamon buns & sourdough toasties",
        },
        {
          id: "cat-iced",
          title: "Iced & Cold Brew",
          count: "6 drinks",
          description: "Nitro cold brew, iced matcha & seasonal tonic spritz",
        },
      ],
    },
  },

  "bread-house": {
    id: "cafe-bread-house",
    slug: "bread-house",
    name: "Bread House & Bakery",
    tagline: "Authentic Sourdough & French Viennoiserie",
    category: "Artisan Bakery & Coffee",
    isActive: true,
    isVerified: true,
    establishedYear: 2019,
    stampTarget: 8,
    accentColor: "#92400e",

    // Visual assets
    coverImage:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Golden artisanal sourdough loaves and baguettes at Bread House",
    logoImage:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80",
    logoAlt: "Bread House Bakery Logo",

    // About Section
    about: {
      shortDescription:
        "Bread House is an authentic French bakery crafting slow-fermented organic breads, buttery croissants, and exquisite sweet pastries daily.",
      fullDescription:
        "At Bread House, baking is an art of patience. Every loaf of sourdough goes through 36 hours of cold fermentation using our decades-old natural starter. Pair our crusty breads or warm pain au chocolat with carefully extracted single-origin espresso or specialty tea.",
      highlights: [
        "36-Hour Natural Sourdough",
        "100% French Butter Pastries",
        "Specialty Roaster Coffee",
        "Baked Fresh Twice Every Day",
        "Organic & Heritage Grains",
      ],
    },

    // Location
    location: {
      address: "18 Baker Street",
      district: "Marylebone",
      city: "London",
      postcode: "W1U 3BW",
      fullAddress: "18 Baker Street, Marylebone, London W1U 3BW",
      directionsHint: "3 mins walk from Baker Street Underground • Near Regent's Park",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=18+Baker+Street+London+W1U+3BW",
    },

    // Operating Schedule
    openingHours: {
      timezone: "Europe/London",
      schedule: [
        { day: "Monday", open: "07:00", close: "18:00", isClosed: false },
        { day: "Tuesday", open: "07:00", close: "18:00", isClosed: false },
        { day: "Wednesday", open: "07:00", close: "18:00", isClosed: false },
        { day: "Thursday", open: "07:00", close: "18:30", isClosed: false },
        { day: "Friday", open: "07:00", close: "19:00", isClosed: false },
        { day: "Saturday", open: "08:00", close: "19:00", isClosed: false },
        { day: "Sunday", open: "08:30", close: "17:00", isClosed: false },
      ],
      holidayNotice: "Open 8:00 AM - 4:00 PM on Bank Holidays",
    },

    // Contact
    contact: {
      phone: "+44 20 7946 0831",
      displayPhone: "+44 (0) 20 7946 0831",
      email: "bonjour@breadhouse.london",
    },

    // Website
    website: {
      url: "https://breadhouse.london",
      displayUrl: "breadhouse.london",
    },

    // Social Media
    socialMedia: {
      instagram: {
        handle: "@breadhouselondon",
        url: "https://instagram.com",
        followersCount: "19.8k",
      },
      facebook: {
        handle: "BreadHouseLondon",
        url: "https://facebook.com",
      },
      tiktok: {
        handle: "@breadhousebakery",
        url: "https://tiktok.com",
      },
      whatsapp: {
        handle: "+44 7700 900555",
        url: "https://wa.me/447700900555",
      },
    },

    // Rewards Catalog for Bread House
    rewards: [
      {
        id: "rew-bh-1",
        name: "Fresh Butter Croissant",
        category: "Pastry",
        description: "Our signature flaky, multi-layered French butter croissant or pain au chocolat.",
        stampsRequired: 4,
        tag: "Customer Favorite",
        iconType: "dessert",
      },
      {
        id: "rew-bh-2",
        name: "Artisan Sourdough Loaf",
        category: "Breads",
        description: "A freshly baked whole country sourdough or seeded rye loaf to take home.",
        stampsRequired: 6,
        tag: "Baker's Choice",
        iconType: "dessert",
      },
      {
        id: "rew-bh-3",
        name: "Morning Combo (Coffee + Pastry)",
        category: "Combos",
        description: "Any specialty coffee or tea accompanied by a fresh morning pastry of choice.",
        stampsRequired: 8,
        tag: "Best Value",
        iconType: "coffee",
      },
      {
        id: "rew-bh-4",
        name: "Baker's Gift Box",
        category: "Special",
        description: "Assorted box of 4 gourmet pastries and house-made fruit preserves.",
        stampsRequired: 12,
        tag: "Exclusive",
        iconType: "specialty",
      },
    ],

    // Menu Preview
    menuPreview: {
      isAvailable: true,
      note: "Explore our daily oven selections.",
      categories: [
        {
          id: "cat-sourdough",
          title: "Heritage Sourdough",
          count: "6 daily varieties",
          description: "Country white, seeded rye, walnut & olive sourdoughs",
        },
        {
          id: "cat-pastries",
          title: "Viennoiserie",
          count: "9 baked items",
          description: "Almond croissants, escargot, cinnamon babka & brioche",
        },
        {
          id: "cat-sandwiches",
          title: "Artisan Baguettes",
          count: "5 sandwiches",
          description: "Jambon-beurre, brie & fig, and roasted garden vegetables",
        },
      ],
    },
  },

  "the-roasted-bean": {
    id: "cafe-bloomsbury-01",
    slug: "the-roasted-bean",
    name: "The Roasted Bean & Co.",
    tagline: "Single-Origin Micro-Roasters",
    category: "Micro-Roastery & Brew Bar",
    isActive: true,
    isVerified: true,
    establishedYear: 2021,
    stampTarget: 10,
    accentColor: "#3B2418",

    coverImage:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Warm roasting room and espresso bar",
    logoImage:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    logoAlt: "The Roasted Bean Logo",

    about: {
      shortDescription:
        "Specialty roastery focused on ethically sourced, single-origin micro-lots with precise manual brewing.",
      fullDescription:
        "Every bean roasted at our facility has a story. We partner with smallholder cooperatives around the equatorial belt, roast in 5kg batches, and cup every profile to ensure exceptional clarity and sweetness.",
      highlights: [
        "Single-Origin Filter Flights",
        "In-House Small Batch Roasting",
        "Direct Farmer Relationships",
        "Cupping & Tasting Workshops",
      ],
    },

    location: {
      address: "12 Neal Street",
      district: "Covent Garden",
      city: "London",
      postcode: "WC2H 9PU",
      fullAddress: "12 Neal Street, Covent Garden, London WC2H 9PU",
      directionsHint: "1 min walk from Covent Garden tube station",
      googleMapsUrl: "https://www.google.com/maps",
    },

    openingHours: {
      timezone: "Europe/London",
      schedule: [
        { day: "Monday", open: "08:00", close: "18:00", isClosed: false },
        { day: "Tuesday", open: "08:00", close: "18:00", isClosed: false },
        { day: "Wednesday", open: "08:00", close: "18:00", isClosed: false },
        { day: "Thursday", open: "08:00", close: "19:00", isClosed: false },
        { day: "Friday", open: "08:00", close: "19:00", isClosed: false },
        { day: "Saturday", open: "09:00", close: "19:00", isClosed: false },
        { day: "Sunday", open: "09:30", close: "17:00", isClosed: false },
      ],
      holidayNotice: "Open on Bank Holidays",
    },

    contact: {
      phone: "+44 20 7946 0444",
      displayPhone: "+44 (0) 20 7946 0444",
      email: "info@roastedbean.coffee",
    },

    website: {
      url: "https://roastedbean.coffee",
      displayUrl: "roastedbean.coffee",
    },

    socialMedia: {
      instagram: {
        handle: "@roastedbeancoffee",
        url: "https://instagram.com",
        followersCount: "11.5k",
      },
      facebook: {
        handle: "RoastedBeanCo",
        url: "https://facebook.com",
      },
    },

    rewards: [
      {
        id: "rew-trb-1",
        name: "Single-Origin Espresso Flight",
        category: "Tasting",
        description: "Taste three contrasting origins pulled back-to-back by our head barista.",
        stampsRequired: 5,
        tag: "Roaster Pick",
        iconType: "coffee",
      },
      {
        id: "rew-trb-2",
        name: "Nitro Cold Brew on Tap",
        category: "Cold Coffee",
        description: "Creamy, naturally sweet cold brew infused with nitrogen bubbles.",
        stampsRequired: 7,
        tag: "Refreshing",
        iconType: "coffee",
      },
      {
        id: "rew-trb-3",
        name: "Whole Bean Bag (250g)",
        category: "Retail",
        description: "Freshly roasted single-origin bag of your preferred roast profile.",
        stampsRequired: 10,
        tag: "Best Value",
        iconType: "beans",
      },
    ],

    menuPreview: {
      isAvailable: true,
      note: "Explore our micro-lot roasts.",
      categories: [
        {
          id: "cat-origins",
          title: "Single-Origins",
          count: "8 rotating lots",
          description: "Ethiopia Yirgacheffe, Colombia Huila, Kenya Nyeri",
        },
      ],
    },
  },
};

/**
 * Retrieve a cafe by slug or fallback to the primary cafe.
 */
export function getCafeBySlug(slug) {
  if (!slug) return CAFES_CATALOG["coffee-house"];
  return CAFES_CATALOG[slug] || null;
}

/**
 * Get list of all registered cafes.
 */
export function getAllRegisteredCafes() {
  return Object.values(CAFES_CATALOG);
}

/**
 * Register a new cafe in the catalog (e.g., created by Super Admin).
 */
export function registerCafeCatalogEntry(slug, cafeData) {
  if (!slug) return null;
  CAFES_CATALOG[slug] = {
    id: cafeData.id || `cafe-${slug}`,
    slug,
    ...cafeData,
  };
  return CAFES_CATALOG[slug];
}

/**
 * Update a cafe entry in the catalog (e.g., from the Cafe Dashboard).
 */
export function updateCafeCatalogEntry(slug, updatedData) {
  if (!slug) slug = "coffee-house";
  if (CAFES_CATALOG[slug]) {
    CAFES_CATALOG[slug] = {
      ...CAFES_CATALOG[slug],
      ...updatedData,
    };
    return CAFES_CATALOG[slug];
  } else {
    CAFES_CATALOG[slug] = {
      slug,
      ...updatedData,
    };
    return CAFES_CATALOG[slug];
  }
}
