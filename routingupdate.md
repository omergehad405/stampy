# Task: Update Stampy Navigation & Customer Pages Architecture

The project direction has changed slightly. We are simplifying the customer experience and introducing a multi-cafe structure.

You already understand the project, its architecture, components, and design system. Do not redesign the application or rebuild existing functionality.

Your task is to implement the following navigation and page structure changes.

## 1. Global Navigation (Main App Navbar)

Update the existing main customer navbar to contain ONLY these three destinations:

1. Home
2. My Cafes
3. Profile

Important:
- Do NOT modify the existing main Home page.
- Leave the main Home page as it currently is.
- We will plan and design its content separately later.
- Do not add any new content or features to it.
- Only update its navigation destination if required by the new routing structure.

## 2. My Cafes Page (New Page)

Create a new page called `My Cafes`.

Purpose:
This page displays all cafes that the currently authenticated customer has joined.

Each cafe should appear in a clean, attractive card containing:

- Cafe logo.
- Cafe name.
- Current stamp progress (e.g. 6/10).
- A small progress indicator.
- The next available reward or a short reward description.
- An option to open the cafe.

Interaction:
- Clicking a cafe card opens its dedicated cafe experience.
- The customer can browse all cafes they have joined.
- If the customer has not joined any cafes, show a friendly empty state encouraging them to scan a cafe QR code and join a loyalty program.

Important:
- Display only cafes the customer has actually joined.
- Do not show every cafe registered on Stampy.
- Use dynamic data from the existing architecture.
- Do not create fake permanent relationships between customers and cafes.

## 3. Cafe Navigation (New Separate Navbar)

Every cafe should have its own dedicated experience.

When a customer opens a cafe from My Cafes, display a separate cafe-level navigation bar.

This navbar should contain ONLY:

1. Home
2. Rewards
3. Cafe

These destinations belong to the selected cafe, not to the global Stampy application.

The cafe navigation must work independently from the global navigation.

Important UX requirements:
- Do not display the global navbar and cafe navbar simultaneously.
- Provide an easy way to return to My Cafes or switch to another cafe.
- Clearly display the selected cafe's identity where appropriate.
- Switching between cafes must never mix their data.

## 4. Cafe Home Page

Reuse the existing cafe Home page and its current functionality.

It should display the selected cafe's loyalty experience, including:

- Cafe/customer loyalty card.
- Stamp progress.
- Available stamp slots.
- Recent 5 activities.
- Link to full activity history.

The content must always belong to the currently selected cafe.

Do not redesign this page unnecessarily.

## 5. Cafe Rewards Page

Reuse the existing Rewards page and its functionality.

It must display only the rewards belonging to the currently selected cafe.

Do not mix rewards from different cafes.

## 6. Cafe Information Page

Reuse the Cafe page we previously planned and implemented.

It should display the selected cafe's:

- Logo and cover image.
- Name and description.
- Location.
- Opening hours.
- Contact information.
- Website.
- Social media links.

Keep it dynamic and connected to the selected cafe's data.

## 7. Customer Profile Page (New Page)

Create a simple customer Profile page.

This page represents the customer's Stampy account, NOT an individual cafe.

It should include:

- Customer name.
- Email.
- Phone number.
- Account information.
- Edit personal information option.
- Account settings.
- Log out.

Do NOT put cafe information, stamps, or cafe rewards in this page.

Keep it simple and avoid unnecessary features.

## 8. QR Code & Routing Behavior

The application must support unique QR codes for each cafe.

Each QR code identifies its cafe using a unique URL, for example:

- `/cafe/coffee-house`
- `/cafe/bread-house`

Expected behavior:

- A customer scans a cafe QR code.
- The customer is redirected to that cafe's public page.
- The customer can see cafe information and rewards before joining.
- A clear Join Loyalty Program button is displayed if they are not a member.
- If the customer is already authenticated, joining should associate the existing customer account with that cafe.
- If the customer is not authenticated, redirect them through registration/login while preserving the intended cafe destination.
- After successful joining, open that cafe's Home page.
- If the customer has already joined that cafe, open its Home page directly.

A customer must be able to join multiple cafes using one Stampy account.

Each customer-cafe relationship must have its own loyalty card, stamp balance, rewards, and transaction history.

Do not create duplicate loyalty cards when a customer joins the same cafe again.

## 9. Navigation & Routing Architecture

Organize the routing so that:

- Global pages use the global navbar.
- Cafe pages use the cafe navbar.
- Public cafe pages can be accessed through QR URLs without requiring registration.
- Customer-only loyalty functionality requires authentication and cafe membership where appropriate.

Adapt the routes to the existing project architecture rather than forcing a completely new routing structure.

## 10. Implementation Rules

Before making changes:

1. Inspect the existing routing and navigation implementation.
2. Identify reusable components and existing pages.
3. Understand the current customer-cafe relationship and data models.
4. Reuse existing components wherever possible.

During implementation:

- Preserve the existing design system and colors.
- Use existing Tailwind, Framer Motion, and icon conventions.
- Keep components reusable and maintainable.
- Do not duplicate existing functionality.
- Do not modify unrelated pages.
- Do not modify the main Home page content.
- Do not remove existing functionality unnecessarily.
- Do not introduce unnecessary dependencies.

## Expected Final Structure

**Global App:**
- Home (leave unchanged)
- My Cafes (new)
- Profile (new)

**Individual Cafe Experience:**
- Home (existing)
- Rewards (existing)
- Cafe (existing/planned)

The global navigation and cafe navigation must be separate and context-aware.

## Final Goal

Make Stampy a multi-cafe loyalty platform where customers use one account to join and manage multiple cafe loyalty programs.

The experience should remain simple, intuitive, and mobile-first.

Prioritize a clean navigation experience over adding more features.

After implementation, provide a summary of:
- Pages created.
- Navigation changes.
- Routes added or modified.
- Existing components reused.
- Any backend or database changes required.
- Any remaining tasks.