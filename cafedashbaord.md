# Notch – Cafe Dashboard Implementation

The customer-facing website is now completed, including its pages, navigation, routing, and cafe profile experience.

We are now moving to the next major part of Notch: **the Cafe Dashboard**.

Your task is to design and implement a complete, professional dashboard that allows cafe owners and their employees to manage their cafe's loyalty program.

Before making any changes:
- Inspect the existing project structure and understand the current architecture.
- Read the existing project instructions and conventions.
- Understand the current authentication, routing, data models, and reusable components.
- Reuse existing components and functionality wherever possible.
- Do not rebuild or break any existing customer-facing pages.
- Do not unnecessarily modify existing functionality.

## 1. Dashboard Layout

Create a dedicated dashboard layout with:

**Left Sidebar**
- Notch logo.
- Cafe name and logo.
- Navigation links.
- Active navigation state.
- User account information at the bottom.
- Logout action.
- Responsive sidebar behavior.

**Main Content Area**
- Page title and description.
- Breadcrumbs where appropriate.
- Page-specific content.
- Consistent spacing and responsive layouts.
- Reusable page headers and components.

The dashboard should feel like a modern SaaS management platform, not a simple admin template.

## 2. Dashboard Pages

### A. Overview

Create a dashboard overview that gives the cafe owner a quick understanding of their loyalty program performance.

Include:
- Total registered customers.
- Total stamps issued.
- Total rewards redeemed.
- Active customers.
- Recent customer activity.
- Loyalty program performance charts.
- Recent transactions.
- Quick actions such as scanning a QR code, adding a customer, and managing rewards.

Use realistic sample data if live data is not available.

### B. Scan & Manage Visits

This page is responsible for the daily loyalty operations.

Include:
- QR code scanner interface.
- Ability to identify a customer through their Notch QR code.
- Customer information after successful scanning.
- Current stamp card progress.
- Ability to add stamps.
- Ability to redeem available rewards.
- Confirmation dialogs before important actions.
- Clear success and error states.

Design the scanner experience carefully because cafe employees will use it frequently.

Do not simulate successful QR scanning if actual camera integration is not implemented. Provide a proper scanner interface and clearly separate the UI from its integration.

### C. Customers

Create a customer management page.

Include:
- Customers table.
- Customer name, email, registration date, total stamps, and status.
- Search functionality.
- Filtering and sorting.
- Customer details page or detailed view.

The individual customer profile should display:
- Personal information.
- Loyalty card progress.
- Total stamps earned.
- Rewards redeemed.
- Visit history.
- Recent activity.

### D. Rewards

Create a complete rewards management page.

Include:
- Existing rewards.
- Create new reward.
- Edit reward.
- Delete reward.
- Activate/deactivate reward.
- Reward image.
- Reward name.
- Description.
- Required number of stamps.
- Reward availability.

Provide a clean creation form and confirmation dialogs for destructive actions.

The reward management interface should be flexible enough to support different types of rewards in the future.

### E. Cafe Profile

This page is extremely important.

It should allow the cafe owner to manage all the information displayed on the customer-facing Cafe Profile page.

Use the attached customer-facing cafe profile screenshot as the exact reference for the information structure.

The owner should be able to edit:

**Basic Information**
- Cafe name.
- Cafe logo.
- Cover image.
- Cafe category.
- Short description.
- Verification status (display-only, not editable by the cafe owner).

**About Us**
- About description.
- Full story.
- Cafe features and services.

**Location & Address**
- Full address.
- Google Maps location or URL.

**Opening Hours**
- Opening and closing hours for each day.
- Open/closed status.
- Support different schedules for different days.

**Contact Details**
- Phone number.
- Email address.

**Official Website**
- Website URL.

**Social Media**
- Instagram.
- Facebook.
- TikTok.
- WhatsApp.

**Digital Menu**
- Menu categories.
- Category names.
- Category descriptions.
- Category images or icons.

Provide a well-organized editing interface, preferably with sections or tabs.

Include:
- Save changes.
- Cancel changes.
- Image upload previews.
- Form validation.
- Loading and success states.

IMPORTANT: The data managed here must correspond to the existing customer-facing cafe profile. Changes saved by the owner should be reflected on that profile.

Do not create a separate, unrelated cafe profile data structure.

### F. Users & Employees

Create a page that allows the cafe administrator to manage the people who have access to the cafe dashboard.

Include:
- Employees/users table.
- Create new user.
- Edit user information.
- Activate/deactivate accounts.
- Delete users.
- Search and filter users.

When creating a new user, include:
- Full name.
- Email address.
- Password or secure invitation flow.
- Role selection.

For now, create the UI and data structure for role selection, but DO NOT finalize the roles or implement a hardcoded permission system. We will discuss the role hierarchy and permissions separately.

The page should be designed to support multiple employees under one cafe account.

### G. Activity History

Create a page that records loyalty program activities.

Include:
- Stamps issued.
- Rewards redeemed.
- Customer visits.
- Employee who performed the action.
- Customer involved.
- Date and time.
- Activity type.

Add search, filters, and a clear transaction history table.

### H. Settings

Create a basic settings page containing:
- Account information.
- Password/security settings.
- Notification preferences.
- General dashboard preferences.

Keep this page modular so we can expand it later.

## 3. Dashboard Authentication

Create a dedicated login page for cafe dashboard users.

The login system must support both cafe administrators and employees.

Include:
- Email.
- Password.
- Show/hide password.
- Remember me.
- Forgot password.
- Login button.
- Loading and error states.

Important requirements:
- Dashboard authentication must be separate from customer authentication.
- Only authorized cafe users should access the dashboard.
- Protect all dashboard routes.
- Prevent unauthenticated users from accessing protected pages.
- Associate every dashboard user with their cafe.
- Do not allow public registration of dashboard accounts.
- Only authorized administrators should be able to create employee accounts.

Do not expose passwords or store them as plain text. Use the existing authentication architecture or a secure authentication implementation appropriate to the project.

## 4. Design System

Maintain consistency with Notch's existing visual identity.

Use the established project colors:

- Cream background: #F2EBDA
- Brown: #3B2418
- Baby blue: #8EC5FF

Design direction:
- Modern SaaS dashboard.
- Clean and minimal interface.
- Premium coffee-inspired visual identity.
- Brown surfaces for important sections where appropriate.
- Cream backgrounds.
- Blue primary actions and highlights.
- Subtle borders and shadows.
- Rounded cards and buttons.
- Smooth and purposeful animations.
- Consistent typography and iconography.

Use the existing project's design conventions and libraries.

The dashboard should feel like part of the same Notch product, but its layout should be optimized for desktop management rather than the customer-facing mobile experience.

Ensure full responsiveness for tablets and mobile devices.

## 5. Technical Requirements

- Follow the existing Next.js architecture.
- Use reusable components.
- Keep components modular.
- Maintain clean separation between layouts, pages, components, and business logic.
- Follow existing state management conventions.
- Use the project's existing animation and icon libraries.
- Implement proper loading, empty, success, and error states.
- Ensure all navigation links work.
- Avoid unnecessary dependencies.
- Avoid duplicating existing functionality.
- Keep existing customer-facing routes and functionality intact.

Do not introduce a new technology or replace an existing library without a clear reason.

## 6. Implementation Strategy

Work in an organized sequence:

1. Dashboard route structure and layout.
2. Dashboard login page and authentication routing.
3. Sidebar and navigation.
4. Overview page.
5. Scan & Manage Visits.
6. Customers.
7. Rewards.
8. Cafe Profile.
9. Users & Employees.
10. Activity History.
11. Settings.
12. Responsive optimization and final testing.

Do not rush through the implementation.

Before finishing:
- Test every route.
- Test sidebar navigation.
- Test forms and their validation.
- Test responsive layouts.
- Check that existing customer-facing pages still work.
- Check for console errors and broken imports.
- Ensure there are no dead buttons or nonfunctional navigation elements.

## Final Objective

The goal is to create a complete Cafe Management Dashboard for Notch.

A cafe owner should be able to log in, manage their cafe profile, manage customers and rewards, monitor loyalty activity, scan customer QR codes, and manage their employees from one centralized dashboard.

Focus on building a polished, scalable foundation that we can connect to the final backend and permission system without redesigning everything later.

## Static Cafe QR Stamping

- The cafe QR uses the cafe's unique public slug at `/c/<slug>`. Opening the link only loads the public cafe profile; it must never award a stamp on GET.
- An authenticated customer self-scan and a staff scan of the customer's personal QR both use the same server-side stamp rules and activity records.
- Limit stamps to one per customer per cafe calendar day, using the cafe's configured `openingHours.timezone` (default `Africa/Cairo`). A successful stamp from either path blocks the other path for that day.
- Do not award beyond the cafe's configured stamp target. Record each awarded stamp's source (`self_scan` or `cafe_manual`) and log scan outcomes for auditing.
- The dashboard's printed QR must include the cafe name and support PNG/SVG download and print-to-PDF.
- The atomic join-and-first-stamp operation uses MongoDB transactions; deploy against a replica set or MongoDB Atlas.
- Before rollout, run `npm run migrate:stamp-sources` to mark pre-existing stamp activity as `cafe_manual` and ensure the new daily-stamp index.