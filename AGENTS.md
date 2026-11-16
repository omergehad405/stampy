# AGENTS.md --- Stampy

Project-level instructions for AI coding agents working on **Stampy**, a
QR-based digital loyalty-card platform.

## 1. Product context

Stampy helps cafés and other participating businesses run a digital
stamp/visit loyalty program.

### Core customer journey

1.  A customer registers once and gets a persistent customer account.
2.  Stampy provides that customer with a unique QR code associated with
    their loyalty card.
3.  The customer presents the QR code when visiting a participating
    café.
4.  An authorized café barista opens the staff dashboard and scans the
    customer's QR code.
5.  The system validates the customer and the business context, then
    records the visit.
6.  The customer can view their card progress and any reward they have
    unlocked.

### Core roles

-   **Customer:** owns an account and loyalty card, displays their QR
    code, and views visit/reward progress.
-   **Barista / café staff:** uses an authorized business account or
    staff session to scan customer QR codes and confirm visits.

Do not assume that a customer QR code grants staff access or that
scanning alone bypasses server-side validation.

### Product rules and open decisions

The following are sensible proposed defaults, not hard-coded product
decisions unless they are already implemented or explicitly confirmed: -
Prevent duplicate visit entries for the same customer and café on the
same calendar day. - Make visit recording idempotent so repeated
scans/network retries cannot create extra stamps. - Unlock a reward
automatically when the configured stamp target is reached. - Keep each
café's customers, staff, loyalty settings, visits, and rewards isolated
from other cafés. - Make stamp targets, reward descriptions, and program
rules configurable per café.

Before implementing or changing these rules, inspect the existing code
and data model. If a rule is not yet settled, keep it configurable and
document the assumption rather than spreading a hard-coded value through
the app.

## 2. Technology choices

Use the project's existing package configuration as the source of truth.
The intended frontend stack is: - **Next.js** (App Router where the
project is configured for it) - **Tailwind CSS** - **TanStack Query**
for server state, fetching, caching, and mutations - **Zustand** for
small, shared client/UI state - **React Icons** for icons - **Framer
Motion** for purposeful interface animation

Do not replace these choices or introduce a competing library without a
clear technical reason and approval.

The backend, database, authentication provider, QR scanning library, and
deployment platform are not fixed by this document. Inspect the
repository and follow the established implementation. Do not invent
infrastructure or add a backend service simply because it is common for
this type of app.

Use the language already established by the repository. For a new file,
follow the neighboring files and project configuration; do not migrate
JavaScript to TypeScript or vice versa as part of an unrelated task.

## 3. Design system

Use these brand colors consistently:

  Purpose                                       Color       Hex
  --------------------------------------------- ----------- -----------
  Main background                               Cream       `#F2EBDA`
  Primary text / secondary brand color          Brown       `#3B2418`
  Buttons / highlights / interactive emphasis   Baby blue   `#8EC5FF`

Guidelines: - Keep the visual language warm, friendly, clear, and
modern. - Maintain readable contrast, especially for small labels,
QR-related instructions, and status messages. - Use the cream background
as the main canvas, brown for typography and important structure, and
baby blue for primary actions and highlights. - Do not introduce extra
brand colors casually. Use semantic colors for success, warning, and
error only when needed and keep them visually restrained. - Prefer
consistent spacing, typography, border radii, and component states over
one-off styling. - Design mobile-first: customers are likely to show
their QR code from a phone, and staff may scan using a phone or
tablet. - Make loading, empty, error, disabled, and success states
intentional---not just the happy path.

## 4. Architecture and implementation

-   Inspect the existing project structure before editing. Preserve its
    conventions and avoid broad rewrites.
-   Keep route/page components focused on composition. Move reusable UI
    into components and domain behavior into appropriate hooks,
    services, or modules.
-   Separate presentation from data access and business rules.
-   Use TanStack Query for remote/server data. Do not mirror query
    results into Zustand without a specific reason.
-   Use Zustand only for genuinely shared client state, such as
    temporary UI state or a multi-step client-side flow. Avoid turning
    it into a second server cache.
-   Keep forms controlled and validated consistently with the project's
    existing form approach.
-   Reuse existing components, utilities, and design tokens before
    creating new ones.
-   Avoid giant components, duplicated business logic, unnecessary
    abstractions, and premature generic frameworks.
-   Do not add dependencies for functionality that can be implemented
    cleanly with the current stack.
-   Keep secrets and private configuration in environment variables.
    Never expose server secrets through client-side code or commit
    `.env` files.
-   Follow the framework's server/client component boundaries. Add
    client components only where browser APIs, state, event handlers, or
    client-side libraries require them.
-   Use semantic HTML and accessible labels, keyboard states, focus
    indicators, and touch-friendly controls.
-   Keep animations subtle and purposeful. Respect reduced-motion
    preferences and avoid animating essential content in a way that
    delays use.

## 5. Loyalty, QR, and data integrity

These rules are especially important because visits can affect rewards
and business records.

-   Treat the QR code as an identifier or short-lived/rotatable
    token---not as proof that a visit is valid by itself.
-   Do not put passwords, personal details, email addresses, or other
    sensitive data directly in the QR payload.
-   Validate every scan on the trusted server side against the
    authenticated staff member, the relevant café, the customer, and the
    loyalty program's current status.
-   Enforce authorization on every protected operation. Hiding a button
    in the UI is not authorization.
-   Scope all business-owned reads and writes to the authenticated
    business/tenant. Never trust a café ID supplied only by the browser.
-   Make visit creation atomic and idempotent. Protect against
    double-clicks, repeated scans, retries, and concurrent requests.
-   Record enough audit information to understand who confirmed a visit,
    for which café and customer, and when, subject to the project's
    privacy policy.
-   Do not allow customers to award stamps to themselves or modify
    visit/reward records through client-side state.
-   Derive reward eligibility from trusted visit/program data. Do not
    trust a reward status sent by the client.
-   Handle invalid, expired, already-used, or unsupported QR codes with
    clear messages that do not expose private account information.
-   Use the café's configured timezone when applying any per-day visit
    rule. Do not assume the server timezone is the café's local
    timezone.
-   If the one-visit-per-day rule is enabled, enforce it in the
    backend/data layer as well as the UI.

## 6. Security and privacy

-   Apply least-privilege access for customers, baristas, and business
    administrators if that role exists in the repository.
-   Check both authentication and resource ownership for customer cards,
    visits, and rewards.
-   Validate and sanitize untrusted input at the appropriate boundary.
-   Do not log authentication tokens, QR secrets, passwords, or
    unnecessary personal data.
-   Avoid exposing whether an arbitrary email or phone number belongs to
    an account.
-   Use secure session/token handling consistent with the chosen auth
    provider.
-   Keep error responses useful but avoid leaking stack traces, internal
    IDs, secrets, or tenant data.
-   Consider rate limiting and abuse prevention for authentication and
    QR scan/visit endpoints where the backend supports them.

## 7. Code quality and workflow

Before making changes: 1. Read the relevant files and nearby patterns.
2. Identify the smallest complete implementation that satisfies the
request. 3. Check whether the behavior already exists to avoid
duplicating it. 4. Note any assumptions that affect product behavior or
data integrity.

While making changes: - Keep existing functionality and styling unless
the task explicitly asks to change them. - Do not delete existing
classes, components, routes, or code just to make a change easier. -
Keep naming clear and consistent with the repository. - Handle loading,
error, empty, and success states for user-facing async flows. - Avoid
placeholder data in production paths. If mock/static data is needed for
a demo, keep it clearly separated from real services. - Do not silently
change API contracts, database fields, or authentication behavior.

After making changes: - Run the relevant lint, type-check, test, and
build commands that are available in `package.json`. - Add or update
tests for important business rules, especially duplicate visit
prevention, tenant isolation, authorization, and reward eligibility. -
Report what changed, which checks were run, and anything not verified. -
If a command cannot be run, say so rather than claiming it passed.

## 8. UI and UX expectations

-   Build responsive layouts for small phones, larger phones, tablets,
    and desktop.
-   Make the customer's QR code easy to find, display, and scan: provide
    adequate size, contrast, quiet zone, and a clear brightness/scan
    instruction where useful.
-   Never make the QR code the only way to identify an account in staff
    workflows; provide a safe fallback lookup if the product supports
    one.
-   Give immediate, clear feedback after a scan: validating, accepted,
    already recorded, invalid, or failed.
-   Prevent accidental repeated submissions while a scan or visit
    mutation is in progress.
-   Keep customer-facing language simple and reassuring. Keep staff
    actions fast and unambiguous.
-   Ensure controls have visible focus states and accessible names; do
    not communicate status by color alone.

## 9. Agent boundaries

-   Do not make product decisions that materially affect loyalty
    economics, fraud controls, privacy, or business permissions without
    checking existing requirements or asking.
-   Do not add payments, subscriptions, analytics tracking, marketing
    automation, multi-branch support, or extra roles unless requested or
    already part of the project.
-   Do not assume that every business is a café forever; keep domain
    wording and data structures reasonably adaptable where this does not
    add needless complexity.
-   Do not rewrite the app or reorganize unrelated folders for a
    narrowly scoped task.
-   If repository code conflicts with this document, inspect the
    implementation and report the conflict. Preserve working behavior
    unless the task explicitly authorizes a change.

## 10. Definition of done

A task is complete when: - The requested behavior works in the relevant
user role and screen size. - Authorization and data integrity are
enforced at the trusted boundary, not only in the UI. - Existing flows
remain intact. - Relevant loading, empty, error, and success states are
handled. - Relevant checks have been run and their results reported. -
Any unresolved product assumption is clearly called out.
