/**
 * Mock Cafe Data for Stampy
 * Isolated business model representing the cafe associated with the customer's loyalty card.
 * In production, this data is retrieved from the server/API.
 */

export const MOCK_CAFE_DATA = {
  id: "cafe-bloomsbury-01",
  name: "The Roasted Bean & Co.",
  tagline: "Specialty Coffee Roasters & Artisan Bakery",
  category: "Specialty Coffee & Bakery",
  isActive: true,
  isVerified: true,
  establishedYear: 2021,

  // Visual assets
  coverImage:
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80",
  coverImageAlt: "Warm ambiance inside The Roasted Bean coffee house",
  logoImage:
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
  logoAlt: "The Roasted Bean & Co. Logo",

  // About Section
  about: {
    shortDescription:
      "Welcome to The Roasted Bean & Co. We are an independent specialty coffee bar and neighborhood bakery dedicated to ethical sourcing, precision brewing, and handcrafted pastries.",
    fullDescription:
      "Founded in 2021, The Roasted Bean & Co. was born from an obsession with single-origin coffees and traditional slow-fermented baking. We roast in small weekly batches to highlight the distinct terroir and floral, fruity notes of beans from micro-lot farms across Ethiopia, Colombia, and Guatemala. Every morning, our bakers arrive before dawn to roll flaky butter croissants, sourdough loaves, and seasonal fruit tarts. Whether you're catching up with friends, settling in with a book, or grabbing your daily flat white on the go, our space is designed to be your cozy home away from home.",
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

  // Direct Communication
  contact: {
    phone: "+44 20 7946 0912",
    displayPhone: "+44 (0) 20 7946 0912",
    email: "hello@roastedbean.coffee",
  },

  // Digital Presence
  website: {
    url: "https://roastedbean.coffee",
    displayUrl: "roastedbean.coffee",
  },

  // Social Media Channels
  socialMedia: {
    instagram: {
      handle: "@roastedbeancoffee",
      url: "https://instagram.com/roastedbeancoffee",
      followersCount: "14.2k",
    },
    facebook: {
      handle: "TheRoastedBeanCo",
      url: "https://facebook.com/TheRoastedBeanCo",
    },
    tiktok: {
      handle: "@roastedbean",
      url: "https://tiktok.com/@roastedbean",
    },
    whatsapp: {
      handle: "+44 7700 900123",
      url: "https://wa.me/447700900123?text=Hello%20The%20Roasted%20Bean!%20I%20have%20an%20inquiry",
    },
  },

  // Future Digital Menu Preview Architecture
  menuPreview: {
    isAvailable: true,
    note: "Digital interactive menu ordering is rolling out soon. Browse our signature categories below.",
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
      {
        id: "cat-brunch",
        title: "All-Day Brunch",
        count: "10 plates",
        description: "Avocado sourdough, granola bowls & brioche sandwiches",
      },
    ],
  },
};
