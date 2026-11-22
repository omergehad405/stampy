# Notch - Project Architecture & File Documentation

This document provides a comprehensive map of the **Notch** digital loyalty platform codebase, detailing the overall architecture, directory hierarchy, and the exact purpose and responsibility of every file.

---

## 1. High-Level Architecture Overview

Notch is structured as a full-stack unified Node.js application combining **Next.js (App Router)** for the frontend and **Express.js + MongoDB (Mongoose)** for the backend API:

- **Unified Server (`server.js`)**: Runs Express and mounts the Next.js request handler on a single port (`PORT 5000` by default). In serverless or standard Next.js deployments, `pages/api/[[...all]].js` delegates requests to Express (`backend/app/expressApp.js`).
- **Frontend Architecture (`app/`)**:
  - `(auth)`: Customer authentication flows (Login, Forgot Password, Reset Password).
  - `(customer)`: Customer loyalty experience (Home, My Cafes, Cafe Detail, Rewards, Stamp QR, Profile).
  - `dashboard`: Café Owner & Barista portal (QR Scanner for visits/redemptions, Customer management, Rewards catalog, Staff members, Settings, Profile).
  - `admin`: Super Admin portal (Platform metrics, Cafe approvals, Customer management, Subscription plans, System announcements, Settings).
  - `components/`: Modular UI, layout containers (Navbar, NotificationBox), and providers (Auth, Theme, Toast).
  - `stores/`: Client-side state using **Zustand** (Auth session, Loyalty state, Notifications, Admin/Dashboard UI state).
  - `lib/`: Standardized REST API client layers (`apiClient.js`, `authApi.js`, `cafeApi.js`, `dashboardApi.js`, `adminApi.js`).
- **Backend Architecture (`backend/`)**:
  - `backend/app/expressApp.js`: Express app instance configured with CORS, JSON parser, cookie parser, and route endpoints.
  - `backend/config/db.js`: MongoDB database connection logic using Mongoose.
  - `backend/app/models/`: Mongoose schemas for Users, Cafes, Rewards, Redemptions, Plans, Announcements, and Activity.
  - `backend/app/controllers/`: Business logic and database operations for Auth, Cafes, Rewards, Admin, and Dashboard.
  - `backend/app/routing/`: Express route definitions.
  - `backend/app/middlewares/`: Authentication and role-based access control (`authMiddleware.js`).
  - `backend/utils/`: JWT token generator and Nodemailer transactional email utility.
  - `backend/scripts/`: Migration, seeding, and automated endpoint verification scripts.

---

## 2. Directory & File Reference

### Root Directory

| File | Purpose |
| :--- | :--- |
| `server.js` | The unified application entry point. Initializes MongoDB connection, configures the Express API app, attaches the Next.js request handler, and listens on the configured port. |
| `package.json` | Project manifest defining npm dependencies (Next.js, Express, Mongoose, Zustand, React Query, Framer Motion, Tailwind, etc.) and run scripts (`dev`, `client`, `server`, `build`, `start`, `lint`, `seed:admin`). |
| `package-lock.json` | Pinned dependency tree lockfile for reproducible installations. |
| `next.config.mjs` | Next.js configuration enabling Turbopack Tailwind CSS loaders, image domain whitelisting (Unsplash), and experimental flags. |
| `postcss.config.mjs` | PostCSS configuration configuring `@tailwindcss/postcss`. |
| `eslint.config.mjs` | ESLint configuration file with Next.js core Web Vitals presets. |
| `jsconfig.json` | JavaScript compiler options setting up the path alias `@/*` targeting the project root. |
| `AGENTS.md` | Core project rules and architectural instructions for AI coding agents (brand colors `#F2EBDA`, `#3B2418`, `#8EC5FF`, security boundaries, idempotency, and stack choices). |
| `cafedashbaord.md` | Product specification and feature outline for the cafe management dashboard. |
| `README.md` | General project documentation, introduction, setup instructions, and feature guide. |
| `.gitignore` | Defines files, build outputs (`.next/`), and directories ignored by Git. |
| `.env` | Environment variables containing MongoDB URIs, JWT secrets, email/SMTP settings, and port configuration. |
| `.htaccess` | Apache web server configuration for URL rewriting and proxy handling on shared host environments. |
| `PROJECT_STRUCTURE.md` | This document: comprehensive directory structure and file-by-file reference. |

---

### Scripts & Public Assets

#### `scripts/`
| File | Purpose |
| :--- | :--- |
| `scripts/rename-brand.js` | Utility script to bulk rename legacy brand names and strings across the project files to "Notch". |

#### `public/`
| File | Purpose |
| :--- | :--- |
| `public/.htaccess` | Apache configuration for public static assets. |
| `public/loginPageDesctop.png` | Marketing/hero graphic displayed on the desktop login screen. |
| `public/logo.png` | Primary Notch brand logo image. |
| `public/logo_motion.mp4` | Short video animation of the Notch brand logo used in loading/splash states. |
| `public/notch_logo_animation.mp4` | Alternate animated logo video clip for splash screens and intros. |

---

### Serverless API Fallback (`pages/api/`)

| File | Purpose |
| :--- | :--- |
| `pages/api/[[...all]].js` | Catch-all Next.js API route that connects to MongoDB and forwards requests to `backend/app/expressApp.js`, enabling serverless deployment (e.g. Vercel) without running `server.js`. |

---

### Backend (`backend/`)

#### Configuration & Utilities
| File | Purpose |
| :--- | :--- |
| `backend/config/db.js` | Establishes and manages the Mongoose connection to MongoDB with connection pooling and caching. |
| `backend/utils/generateToken.js` | Generates signed JSON Web Tokens (JWT) for authenticated customer, staff, and admin sessions. |
| `backend/utils/sendEmail.js` | Configures Nodemailer to dispatch transactional emails (e.g., password reset links, verification codes). |
| `backend/.env.example` | Template demonstrating required environment variable keys for the backend. |
| `backend/routes/authRoutes.js` | Compatibility shim re-exporting `backend/app/routing/authRoutes.js`. |

#### Express Application & Middleware
| File | Purpose |
| :--- | :--- |
| `backend/app/expressApp.js` | Express app initialization. Configures CORS rules, body parsers, cookie parser, health-check endpoint (`/api/health`), and mounts all API routers. |
| `backend/app/middlewares/authMiddleware.js` | Middleware functions: `protect` (verifies JWT from Bearer header or cookie), `adminOnly` (restricts to role `admin`), `cafeStaffOnly` (restricts to cafe staff/owners), and subscription plan checks. |

#### Database Models (`backend/app/models/`)
| File | Purpose |
| :--- | :--- |
| `backend/app/models/User.js` | Mongoose schema for all users (customers, staff, admins): credentials, profile, member code, personal QR code payload, and role definitions. |
| `backend/app/models/Cafe.js` | Mongoose schema for cafes: name, slug, logo, cover image, stamp card configuration, address, opening hours, social links, subscription status, and linked staff accounts. |
| `backend/app/models/Reward.js` | Mongoose schema for cafe loyalty rewards: title, stamp cost, description, validity dates, stock limits, and active status. |
| `backend/app/models/Redemption.js` | Mongoose schema recording reward redemptions: customer ID, cafe ID, reward ID, redemption code/QR, status (`pending`, `completed`, `cancelled`), and completion timestamps. |
| `backend/app/models/Plan.js` | Mongoose schema for business subscription plans: plan name, pricing, tier limits (max customers, staff accounts, rewards). |
| `backend/app/models/Announcement.js` | Mongoose schema for system announcements displayed to customers or cafe dashboards. |
| `backend/app/models/Activity.js` | Mongoose schema recording audit history: stamp grants, reward redemptions, staff actions, and visit timestamps. |

#### Controllers (`backend/app/controllers/`)
| File | Purpose |
| :--- | :--- |
| `backend/app/controllers/authController.js` | Authentication handlers: registration (customer/staff), login, logout, current user profile (`/me`), update profile, forgot-password, and reset-password. |
| `backend/app/controllers/cafeController.js` | Customer-facing cafe operations: list cafes, get cafe by slug, join cafe membership, leave cafe, and retrieve cafe details. |
| `backend/app/controllers/cafeRewardController.js` | Reward handlers: retrieve available rewards for a cafe, claim reward, process redemption, and validate redemption codes. |
| `backend/app/controllers/adminCafeController.js` | Admin cafe management: view all cafes, approve/reject applications, edit cafe details, suspend cafes, and view cafe metrics. |
| `backend/app/controllers/adminCustomerController.js` | Admin customer management: view all registered customers, inspect stamp balances, adjust customer records, or block users. |
| `backend/app/controllers/adminPlanController.js` | Admin subscription management: create, update, or remove subscription tiers and pricing plans. |
| `backend/app/controllers/adminAnnouncementController.js` | Admin announcement management: create, publish, and delete system banners and notices. |

#### Routing (`backend/app/routing/`)
| File | Purpose |
| :--- | :--- |
| `backend/app/routing/authRoutes.js` | Routes for `/api/auth` (login, register, logout, me, forgot-password, reset-password). |
| `backend/app/routing/cafeRoutes.js` | Routes for `/api/cafes` (public cafe listing, slug lookups, joining loyalty programs). |
| `backend/app/routing/cafeRewardRoutes.js` | Routes for `/api/rewards` and `/api/dashboard/rewards` (reward listings, redemptions, creation). |
| `backend/app/routing/dashboardCafeRoutes.js` | Routes for `/api/dashboard/cafe` (staff scan verification, stamp awarding, cafe profile updates, metrics). |
| `backend/app/routing/announcementRoutes.js` | Public/customer route for fetching active broadcast announcements. |
| `backend/app/routing/adminCafeRoutes.js` | Routes for `/api/admin/cafes` (admin-level cafe CRUD and approvals). |
| `backend/app/routing/adminCustomerRoutes.js` | Routes for `/api/admin/customers` (admin customer inspections). |
| `backend/app/routing/adminPlanRoutes.js` | Routes for `/api/admin/plans` (admin subscription plan controls). |
| `backend/app/routing/adminAnnouncementRoutes.js` | Routes for `/api/admin/announcements` (admin announcement creation & management). |

#### Database Scripts (`backend/scripts/`)
| File | Purpose |
| :--- | :--- |
| `backend/scripts/seedAdmin.js` | CLI script to seed an initial super-administrator user in the database. |
| `backend/scripts/backfillQr.js` | Script that generates and updates QR code tokens/payloads for users who do not have one. |
| `backend/scripts/testAuth.js` | Automated script testing customer registration, login, and `/me` endpoint responses. |
| `backend/scripts/testCafeAuth.js` | Automated script testing staff authentication and cafe-scoped permissions. |
| `backend/scripts/testAdminCafes.js` | Automated script testing admin endpoints for listing and managing cafes. |
| `backend/scripts/testAdminPlans.js` | Automated script testing admin subscription tier CRUD operations. |
| `backend/scripts/testAdminAnnouncements.js` | Automated script testing creation and retrieval of administrative announcements. |
| `backend/scripts/testPasswordReset.js` | Automated script testing password reset token creation and verification flow. |
| `backend/scripts/testRewards.js` | Automated script testing reward creation, stamp deduction, and redemption flow. |

---

### Frontend Core & Shared (`app/`)

#### Global Setup & Root Files
| File | Purpose |
| :--- | :--- |
| `app/layout.js` | Global root HTML layout: loads fonts, attaches `ThemeProvider`, `ToastProvider`, `CustomerAuthProvider`, and mounts the global `SplashScreen`. |
| `app/page.js` | Root index route (`/`): re-exports and renders the customer home page (`app/(customer)/home/page.jsx`). |
| `app/globals.css` | Global stylesheet with Tailwind CSS imports, color variables, scrollbar styling, and custom utilities. |
| `app/favicon.ico` | Application browser tab favicon. |

#### Shared Components (`app/components/`)
| File | Purpose |
| :--- | :--- |
| `app/components/layout/Navbar.jsx` | Fixed bottom/top navigation bar for customer views (Home, My Cafes, QR Code modal trigger, Profile). |
| `app/components/layout/NotificationBox.jsx` | Floating notification drawer displaying notifications and system alerts. |
| `app/components/providers/CustomerAuthProvider.jsx` | Client-side provider syncing the current authenticated customer session into the Zustand loyalty store on mount. |
| `app/components/providers/ThemeProvider.jsx` | Wraps the application with `next-themes` provider for light/dark mode support. |
| `app/components/providers/ToastProvider.jsx` | Mounts `react-toastify` container for unified application notifications and feedback alerts. |
| `app/components/ui/QRCodeImage.jsx` | Reusable component that renders QR codes cleanly using HTML Canvas or dynamic SVG generation with fallback loaders. |
| `app/components/ui/SplashScreen.jsx` | Animated branded splash screen overlay with logo video that fades out when the application finishes loading. |
| `app/components/ui/ThemeToggle.jsx` | Interactive button toggling light and dark theme modes. |

#### Client State Stores (`app/stores/`)
| File | Purpose |
| :--- | :--- |
| `app/stores/useLoyaltyStore.js` | Core customer store: maintains user profile, membership list, stamp balances, reward redemptions, and cached activities. Synchronizes with local storage. |
| `app/stores/useNotificationStore.js` | Manages unread notification counts, notification items list, mark-as-read, and drawer open/close state. |
| `app/stores/useDashboardAuthStore.js` | Manages authenticated cafe staff/owner session, JWT token, and active cafe workspace. |
| `app/stores/useDashboardStore.js` | Manages cafe staff dashboard UI state, active filter tabs, scanner modal status, and cached metrics. |
| `app/stores/useAdminAuthStore.js` | Manages super-admin authentication credentials, session token, and admin profile data. |
| `app/stores/useAdminStore.js` | Admin UI store managing filter states, selected records, and modal display states. |

#### API Client Layer (`app/lib/`)
| File | Purpose |
| :--- | :--- |
| `app/lib/apiClient.js` | Centralized fetch wrapper handling `API_BASE` resolution, auth header attachment (`Bearer <token>`), and error formatting. |
| `app/lib/authApi.js` | Client-side API functions for user register, login, logout, getMe, updateProfile, forgotPassword, and resetPassword. |
| `app/lib/cafeApi.js` | Customer API functions: get cafes list, get cafe by slug, join cafe, leave cafe, redeem reward, and get redemptions. |
| `app/lib/dashboardApi.js` | Staff/Business API functions: scan customer QR, award stamp, complete reward redemption, fetch cafe customers, update cafe settings. |
| `app/lib/adminApi.js` | Platform Admin API functions: fetch system stats, approve/manage cafes, manage customers, manage plans, manage announcements. |

---

### Authentication Route Group (`app/(auth)/`)

| File | Purpose |
| :--- | :--- |
| `app/(auth)/login/page.js` | Dual-purpose login & registration page for customers with form toggle, input validation, and redirect logic. |
| `app/(auth)/forgot-password/page.js` | Password recovery page prompting users for their registered email to request a reset link. |
| `app/(auth)/reset-password/page.js` | New password form parsing the reset token from URL parameters and submitting updated credentials. |

---

### Customer Route Group (`app/(customer)/`)

#### Group Layout
| File | Purpose |
| :--- | :--- |
| `app/(customer)/layout.jsx` | Main customer layout container wrapping views with the main background, `Navbar`, and customer session listeners. |

#### Home View (`app/(customer)/home/`)
| File | Purpose |
| :--- | :--- |
| `app/(customer)/home/page.jsx` | Main customer dashboard aggregating stats, active stamp cards, reward teasers, and discovered cafes. |
| `app/(customer)/home/components/WelcomeHeader.jsx` | Displays user greeting, member code badge, and notification button. |
| `app/(customer)/home/components/LoyaltyOverviewStats.jsx` | Metric pills displaying total stamps collected, available rewards, and joined cafes. |
| `app/(customer)/home/components/CustomerQrModal.jsx` | Fullscreen modal displaying the customer's personal member QR code for baristas to scan. |
| `app/(customer)/home/components/ActiveLoyaltyCards.jsx` | Carousel/grid displaying stamp progress cards for each cafe the customer has joined. |
| `app/(customer)/home/components/AvailableRewardsSection.jsx` | Section listing rewards the customer has unlocked and can redeem immediately. |
| `app/(customer)/home/components/DiscoverCafesSection.jsx` | Browse/search list of partner cafes nearby that the customer can join. |
| `app/(customer)/home/components/RecentActivityTimeline.jsx` | Timeline of recent visits, stamps earned, and rewards redeemed. |
| `app/(customer)/home/components/HowNotchWorks.jsx` | Visual onboarding explainer walking through the 3-step visit, scan, and earn flow. |
| `app/(customer)/home/components/HomeSkeleton.jsx` | Skeleton loading placeholder for the home view while initial data fetches. |

#### My Cafes View (`app/(customer)/my-cafes/`)
| File | Purpose |
| :--- | :--- |
| `app/(customer)/my-cafes/page.jsx` | Page dedicated to managing joined cafes and discovering new loyalty spots. |
| `app/(customer)/my-cafes/components/MyCafesHeader.jsx` | Header banner with search input and category filter tabs. |
| `app/(customer)/my-cafes/components/MyCafesOverview.jsx` | Summary card showing total active memberships and stamp balance totals. |
| `app/(customer)/my-cafes/components/JoinedCafesGrid.jsx` | Grid of joined cafe cards with current stamp counts and quick link to cafe details. |
| `app/(customer)/my-cafes/components/JoinedCafeCard.jsx` | Individual cafe card component showing logo, stamp count badge, and navigation action. |
| `app/(customer)/my-cafes/components/SuggestedCafesSection.jsx` | Recommended cafes the customer has not yet joined. |
| `app/(customer)/my-cafes/components/MyCafesEmptyState.jsx` | Friendly empty state view when the customer hasn't joined any loyalty programs yet. |

#### Customer Profile View (`app/(customer)/profile/`)
| File | Purpose |
| :--- | :--- |
| `app/(customer)/profile/page.jsx` | Customer account settings and profile page. |
| `app/(customer)/profile/components/ProfileHeader.jsx` | Profile avatar, user name, email, member since date, and edit profile trigger. |
| `app/(customer)/profile/components/ProfileOverview.jsx` | High-level summary of lifetime visits, total rewards claimed, and active memberships. |
| `app/(customer)/profile/components/PersonalInformation.jsx` | Displays contact information (email, phone, member ID). |
| `app/(customer)/profile/components/EditProfileModal.jsx` | Modal dialog allowing users to update their name, phone number, and preferences. |
| `app/(customer)/profile/components/ProfileLogout.jsx` | Logout button trigger that opens the confirmation dialog. |
| `app/(customer)/profile/components/LogoutConfirmModal.jsx` | Confirmation modal verifying the customer wants to end their active session. |

#### Cafe Experience & Detail (`app/(customer)/cafe/`)
##### Data & Helpers (`app/(customer)/cafe/data/`)
| File | Purpose |
| :--- | :--- |
| `app/(customer)/cafe/data/cafesCatalog.js` | Static catalog dataset and helper lookup functions for cafes used as mock/demo data and fallbacks. |
| `app/(customer)/cafe/data/cafeData.js` | Legacy mock dataset retained for test fixtures and visual demonstrations. |
| `app/(customer)/cafe/data/useCafeData.js` | Custom hook querying cafe details by slug, combining API data with local fallback logic. |

##### Cafe Detail Page (`app/(customer)/cafe/[slug]/`)
| File | Purpose |
| :--- | :--- |
| `app/(customer)/cafe/[slug]/page.jsx` | Dynamic route page for a specific cafe. Renders stamp card, quick actions, rewards preview, and details. |
| `app/(customer)/cafe/[slug]/CafeTopBar.jsx` | Top navigation bar for the cafe page with back button, cafe name, and share button. |
| `app/(customer)/cafe/[slug]/components/CafeHeader.jsx` | Hero banner with cover image, cafe avatar, title, address, and join/leave button. |
| `app/(customer)/cafe/[slug]/components/PublicCafeHero.jsx` | Welcoming hero component presented to visitors who haven't yet joined the cafe's loyalty program. |
| `app/(customer)/cafe/[slug]/components/JoinLoyaltyCard.jsx` | CTA card inviting customers to tap to join the cafe's stamp program. |
| `app/(customer)/cafe/[slug]/components/StampProgress.jsx` | Stamp card progress bar displaying current stamps earned out of total required for a reward. |
| `app/(customer)/cafe/[slug]/components/StampsGrid.jsx` | Interactive visual grid displaying stamped and unstamped slots (e.g. coffee cup icons). |
| `app/(customer)/cafe/[slug]/components/CafeQrCard.jsx` | Card prompting the customer to show their QR code to the barista at the counter. |
| `app/(customer)/cafe/[slug]/components/CafeQrModal.jsx` | Popup modal presenting the customer's QR code scaled up for scanning at this cafe. |
| `app/(customer)/cafe/[slug]/components/RewardsPreview.jsx` | Preview section showcasing rewards that can be unlocked at this cafe. |
| `app/(customer)/cafe/[slug]/components/RecentActivity.jsx` | Displays recent visit dates and stamps awarded specifically at this cafe. |
| `app/(customer)/cafe/[slug]/components/CafeAboutTeaser.jsx` | Teaser snippet of the cafe's story and specialty with a link to full info. |
| `app/(customer)/cafe/[slug]/components/CafeMenuTeaser.jsx` | Preview of the cafe's featured drinks or signature menu items. |
| `app/(customer)/cafe/[slug]/components/CafeGreeting.jsx` | Personalized greeting message recognizing the customer's loyalty tier at the cafe. |
| `app/(customer)/cafe/[slug]/components/CafeOpeningHours.jsx` | Clean accordion/table displaying weekly operating hours. |
| `app/(customer)/cafe/[slug]/components/CafeSocialLinks.jsx` | Links to the cafe's Instagram, website, Facebook, or Google Maps listing. |
| `app/(customer)/cafe/[slug]/components/CafeInformation.jsx` | Contact card with phone number, full address, and directions link. |
| `app/(customer)/cafe/[slug]/components/QRCodeGraphic.jsx` | Graphic display wrapper around QR code generation. |
| `app/(customer)/cafe/[slug]/components/QrScrollBadge.jsx` | Floating bottom indicator that reveals the QR code button when scrolled past the hero. |
| `app/(customer)/cafe/[slug]/components/WelcomeStampModal.jsx` | Celebration modal that triggers when a customer earns their first stamp or joins. |
| `app/(customer)/cafe/[slug]/components/CafeSkeleton.jsx` | Loading skeleton placeholder for the cafe detail view. |
| `app/(customer)/cafe/[slug]/components/CafeNotFound.jsx` | 404 error view rendered when a requested cafe slug does not exist. |

##### Cafe Sub-pages (`info/` & `rewards/`)
| File | Purpose |
| :--- | :--- |
| `app/(customer)/cafe/[slug]/info/page.jsx` | Dedicated "About & Info" page for the cafe with full story, menu, hours, and location. |
| `app/(customer)/cafe/[slug]/rewards/page.jsx` | Dedicated rewards page for this cafe listing redeemable items, claimed rewards, and redemption history. |
| `app/(customer)/cafe/[slug]/rewards/components/RewardsPageHeader.jsx` | Header for the cafe rewards page with title and back navigation. |
| `app/(customer)/cafe/[slug]/rewards/components/StampBalanceCard.jsx` | Card displaying current stamp count available to spend on rewards. |
| `app/(customer)/cafe/[slug]/rewards/components/RewardsTabs.jsx` | Tab selector switching between "Available Rewards" and "Redeemed Rewards". |
| `app/(customer)/cafe/[slug]/rewards/components/AvailableRewards.jsx` | Grid of available reward items with "Redeem" action buttons. |
| `app/(customer)/cafe/[slug]/rewards/components/RewardCard.jsx` | Card displaying single reward details: image, title, stamp cost, and redeem button. |
| `app/(customer)/cafe/[slug]/rewards/components/RewardVisual.jsx` | Visual artwork/icon representing reward categories (free coffee, pastry, discount). |
| `app/(customer)/cafe/[slug]/rewards/components/MyRewardsSection.jsx` | Section listing rewards currently held by the user waiting to be claimed at the counter. |
| `app/(customer)/cafe/[slug]/rewards/components/RewardsHistory.jsx` | Historical log of previously redeemed and completed rewards. |
| `app/(customer)/cafe/[slug]/rewards/components/RedeemConfirmationModal.jsx` | Safety dialog confirming the customer wants to exchange stamps for a reward. |
| `app/(customer)/cafe/[slug]/rewards/components/RedemptionQrModal.jsx` | Displays the single-use redemption QR code for the barista to scan and hand over the reward. |
| `app/(customer)/cafe/[slug]/rewards/components/RewardsJoinNotice.jsx` | Banner prompting users to join the cafe program before redeeming rewards. |
| `app/(customer)/cafe/[slug]/rewards/components/RewardsNotFound.jsx` | Empty state when a cafe has no active loyalty rewards published. |

---

### Café Staff & Owner Dashboard (`app/dashboard/`)

#### Layout, Auth & Core Pages
| File | Purpose |
| :--- | :--- |
| `app/dashboard/layout.js` | Shell layout for the business portal: includes `DashboardSidebar`, `DashboardHeader`, and wraps routes with `AuthGuard`. |
| `app/dashboard/page.js` | Business overview dashboard: today's scans counter, unique customers, popular rewards, and recent scan feed. |
| `app/dashboard/login/page.js` | Dedicated login page for café owners and baristas. |
| `app/dashboard/scan/page.js` | QR Scanner terminal: camera scanner and manual member-code input for awarding stamps or verifying redemptions. |
| `app/dashboard/customers/page.js` | Customer directory: list of joined patrons, visit histories, stamp counts, and search filter. |
| `app/dashboard/rewards/page.js` | Rewards manager: create, edit, activate/deactivate cafe loyalty rewards and set stamp costs. |
| `app/dashboard/activity/page.js` | Full audit log of visit scans, stamps awarded, staff member identifiers, and redemptions. |
| `app/dashboard/users/page.js` | Staff management: invite, edit, or revoke barista/staff access accounts. |
| `app/dashboard/settings/page.js` | Cafe configuration: update cafe name, address, hours, stamp card target (e.g. 8 or 10 stamps), and branding. |
| `app/dashboard/profile/page.js` | Barista/manager personal profile settings and password change. |

#### Dashboard Components & Data (`app/dashboard/components/` & `data/`)
| File | Purpose |
| :--- | :--- |
| `app/dashboard/components/AuthGuard.jsx` | Client-side protection component redirecting unauthenticated staff or non-business users to dashboard login. |
| `app/dashboard/components/DashboardSidebar.jsx` | Sidebar navigation linking to Overview, Scan, Customers, Rewards, Activity, Staff, and Settings. |
| `app/dashboard/components/DashboardHeader.jsx` | Dashboard top bar displaying active cafe name, current staff user, quick scan button, and logout action. |
| `app/dashboard/components/DashboardPageHeader.jsx` | Standardized page header component with title, subtitle, and action buttons. |
| `app/dashboard/components/DashboardMetricCard.jsx` | Metric widget displaying key performance indicators (e.g., visits today, total stamps, active members). |
| `app/dashboard/components/DashboardAnnouncementBanner.jsx` | Alert banner displaying platform announcements or maintenance notices from super admins. |
| `app/dashboard/components/DashboardPlanLimitBanner.jsx` | Warning banner displayed when a cafe approaches or exceeds their subscription tier limits. |
| `app/dashboard/components/PlanLockedFeature.jsx` | Overlay placeholder blocking access to premium features when on a lower-tier plan. |
| `app/dashboard/data/staffMembers.js` | Default fallback dataset of staff roles and permissions for development and testing. |

---

### Platform Super Admin Portal (`app/admin/`)

#### Layout, Auth & Core Pages
| File | Purpose |
| :--- | :--- |
| `app/admin/layout.js` | Shell layout for platform administrators: includes `AdminSidebar`, `AdminHeader`, and `AdminAuthGuard`. |
| `app/admin/page.js` | Platform overview: total registered cafes, active customers, stamps issued platform-wide, and MRR. |
| `app/admin/login/page.js` | Secure login portal for platform super-administrators. |
| `app/admin/cafes/page.js` | Cafe directory: view all enrolled cafes, approval queues, subscription status, and suspension controls. |
| `app/admin/cafes/[id]/page.js` | Deep-dive page into a specific cafe's operational statistics, staff list, and subscription plan. |
| `app/admin/customers/page.js` | Platform-wide customer directory: lookup customers by email or member code. |
| `app/admin/customers/[id]/page.js` | Individual customer account audit: enrolled cafes, total stamps, and fraud check flags. |
| `app/admin/subscriptions/page.js` | Subscription tier manager: configure plan pricing, customer limits, and billing terms. |
| `app/admin/announcements/page.js` | Broadcast manager: create and publish announcements targeted to customers or cafe dashboards. |
| `app/admin/rewards-activity/page.js` | Platform-wide audit feed of all reward redemptions and stamp transactions. |
| `app/admin/analytics/page.js` | Detailed platform analytics charts: user growth, scan volume over time, and retention metrics. |
| `app/admin/settings/page.js` | Global system settings: maintenance mode toggle, email SMTP settings, and security defaults. |
| `app/admin/profile/page.js` | Admin account credentials and security preferences. |

#### Admin Components (`app/admin/components/`)
| File | Purpose |
| :--- | :--- |
| `app/admin/components/AdminAuthGuard.jsx` | Client-side protection ensuring only users with the `admin` role access admin routes. |
| `app/admin/components/AdminSidebar.jsx` | Navigation sidebar linking to Admin Overview, Cafes, Customers, Subscriptions, Announcements, and Analytics. |
| `app/admin/components/AdminHeader.jsx` | Top header bar displaying administrator identity, live environment tag, and logout action. |
| `app/admin/components/AdminPageHeader.jsx` | Consistent header layout for admin views with breadcrumbs and action triggers. |
| `app/admin/components/AdminMetricCard.jsx` | Statistic card component with value, percentage change, and trend direction indicator. |
| `app/admin/components/AdminBadge.jsx` | Reusable status badge component for states like `Active`, `Pending`, `Suspended`, or `Pro`. |
| `app/admin/components/ConfirmModal.jsx` | Generic confirmation modal for destructive admin actions (e.g., deleting cafes or revoking access). |

---

## 3. Key Data & Control Flows

### Customer Registration & Card Issuance
```
Customer registers at /login
  → apiRegister() [app/lib/authApi.js]
  → POST /api/auth/register [backend/app/controllers/authController.js]
  → User created with unique memberCode and QR token payload [backend/app/models/User.js]
  → Customer logs in → useLoyaltyStore fetches user details [app/stores/useLoyaltyStore.js]
  → QR code displayed in CustomerQrModal via QRCodeImage [app/components/ui/QRCodeImage.jsx]
```

### Visit Scan & Stamp Awarding
```
Barista opens scanner at /dashboard/scan
  → Camera reads customer QR code (or barista enters memberCode)
  → POST /api/dashboard/cafe/scan [backend/app/routing/dashboardCafeRoutes.js]
  → authMiddleware validates barista authorization and active cafe context
  → Checks idempotency and awards stamp [backend/app/models/Activity.js, User.js]
  → Response confirms success → Customer UI reflects updated stamp balance in real time
```

### Reward Redemption Flow
```
Customer reaches target stamps at /cafe/[slug]/rewards
  → Taps "Redeem" → RedeemConfirmationModal opens
  → POST /api/rewards/redeem creates pending Redemption [backend/app/models/Redemption.js]
  → RedemptionQrModal renders unique single-use redemption QR
  → Barista scans redemption QR at /dashboard/scan
  → POST /api/dashboard/cafe/redeem marks redemption completed
  → Audit recorded in Activity log
```
