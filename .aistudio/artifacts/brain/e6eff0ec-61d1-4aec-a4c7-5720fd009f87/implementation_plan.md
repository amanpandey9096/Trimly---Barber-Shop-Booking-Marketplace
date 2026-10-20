# Trimly Customer Login Portal & Personalized Bookings Dashboard

Upgrade the Trimly barber shop booking platform with a dedicated customer authentication system, client-side session management with clear demo indicators, protected customer routes, personalized dashboard overview, comprehensive appointment history with filtering and live actions (rescheduling and cancellation), customer profile settings, and persistent INR pricing.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Authentication & Persistence Scope**: Following the project prompt, customer authentication is implemented with a production-ready frontend auth architecture (email/password, phone number identifier support, demo accounts, route protection, session logout). It is explicitly badged as a simulated demo session in the UI with notifications indicating that multi-device synchronization requires cloud backend integration (e.g. Supabase or Firebase).
>
> **Currency Standardization**: All pricing across shops, services, cards, booking modals, tickets, dashboard summary metrics, and booking records is standardized to Indian Rupees (INR, ₹), maintaining uniform formatting (e.g., `₹450`, `₹1,200`) and eliminating any legacy dollar references.

- **Confirmed Decision 1**: Dedicated URL-like view routing for `/login`, `/signup`, `/forgot-password`, `/customer/dashboard`, `/customer/bookings`, and `/customer/profile`, allowing clean navigation while preserving single-page responsiveness.
- **Confirmed Decision 2**: Protected routes automatically redirect unauthenticated guests to `/login`, preserving their intended destination or pending booking configuration in memory.
- **Confirmed Decision 3**: Complete appointment lifecycle support: Active appointments can be rescheduled (with interactive date and time slot picker) or cancelled (with a confirmation modal and policy review); completed/cancelled appointments remain in history as read-only with a "Book Again" shortcut.

---

## 1. Overview & Core Concept

- **What It Does**: Trimly's new customer portal gives barber shop customers a personalized account hub where they can sign in using their email or phone number, view upcoming and past grooming sessions, modify or reschedule appointments, manage profile details, and enjoy a seamless booking journey where selected slots are preserved across login.
- **Target Audience**: Everyday grooming clients looking for guaranteed barber appointments without standing or waiting in barbershop queues, plus barbershop enthusiasts who frequently visit preferred local styling salons.
- **Key Value**: Eliminates physical salon waiting time while providing full control over appointments, booking history, and personal grooming preferences in a premium Indian salon marketplace context.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Authentication Journey**:
   - Customer clicks **Login** or **Sign Up** from the main navbar or when prompted during booking.
   - Dedicated screens (`/login`, `/signup`, `/forgot-password`) with email/phone identification, password visibility toggle, remember-me support, client validation, and 1-click test credentials for instant evaluation.
   - Upon successful login, the customer is routed to `/customer/dashboard` (or back to their in-progress booking wizard).

2. **Customer Dashboard Overview (`/customer/dashboard`)**:
   - Warm welcome banner: `"Welcome back, [Customer Name]!"` with quick date display and demonstration badge.
   - High-contrast summary metric cards: **Upcoming Appointments**, **Completed Appointments**, **Cancelled Appointments**, and **Total Bookings**.
   - **Next Upcoming Appointment Hero Card**: Highlights the immediate next booking with shop photo, service, barber, date, start/end time, duration, total INR price (`₹`), status badge (`Confirmed`), and direct action buttons (`View Details`, `Reschedule`, `Cancel`).
   - Quick action: Prominent **"Book a Barber"** button directing to the Explore page.

3. **My Bookings History (`/customer/bookings`)**:
   - Tabbed filtering: **All Bookings**, **Upcoming**, **Confirmed**, **Completed**, and **Cancelled**.
   - Rich booking cards featuring shop branding, address, service pills, assigned barber avatar, timestamp, duration, INR amount, and action menu.
   - **Interactive Modal**: View detailed booking summary, salon address, cancellation policy, and shop phone contact.
   - **Reschedule Flow**: Date selector and real-time slot generator checking conflict rules before confirming new time.
   - **Cancellation Flow**: Policy warning dialog confirming slot release before marking status as `cancelled`.
   - **Empty States**: Scannable empty state with helpful illustration and a direct "Find a Barber" button.

4. **Customer Profile Settings (`/customer/profile`)**:
   - Form fields for Full Name, Email Address, and Phone Number.
   - Real-time validation and active feedback toasts.
   - Changes immediately update the customer session, the global registered accounts store, and autofill future booking modal interactions.
   - Account security card with change password modal and secure logout action.

5. **Booking Flow State Preservation**:
   - If an unauthenticated guest configures a shop, service, date, and slot in the booking wizard, clicking "Proceed to Confirm" prompts them to login or register.
   - Upon authentication, their configured slot is restored and re-verified against availability before final confirmation.

### Visual Identity & Theme

- **Color Palette**: Warm off-white canvas (`#FAF8F5`), rich obsidian typography (`#18181B`), warm amber accents (`#D97706` / `#B45309`), soft stone borders (`#E7E5E4`), and emerald status accents (`#059669`).
- **Typography & Tabular Numerals**: Display font `Plus Jakarta Sans` for clean editorial structure, body font with high legibility, and `tabular-nums` / `font-mono` on all prices (`₹`), references (`TRM-XXXXX`), and appointment times (`2:30 PM`).
- **Responsive Workspace Layout**: Desktop sidebar navigation ($260\text{px}$) with contextual breadcrumbs and mobile bottom/drawer navigation for customer dashboard sections.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client Auth Engine with Extensible Adapter Pattern**:
  - *Chosen Approach*: Implement a modular `AuthContext`/`authService` managing session state, demo accounts, credential validation, and password-masking rules. Include clear visual badges explaining demo vs. cloud backend sync.
  - *Why*: Allows zero-friction evaluation and immediate testability in AI Studio without blocking on cloud credential setup, while remaining 100% architecturally compliant for backend drop-in.
  - *Alternative Considered*: Requiring external API credentials right away would break offline preview and testability.

- **Decision 2: Indian Rupee (INR) Standardization Across All Data**:
  - *Chosen Approach*: Update mock shops, services, booking calculations, and receipt views to Indian Rupee figures (e.g., haircuts at `₹350`–`₹650`, premium packages at `₹1,200`–`₹2,500`), with an explicit formatting helper `formatINR(amount)`.
  - *Why*: Fully satisfies prompt requirement #9 ("Display all prices consistently in Indian Rupees... never display dollar-denominated prices").

- **Decision 3: In-Place Modal vs. Dedicated Page Navigation**:
  - *Chosen Approach*: Support both full URL path views (`/login`, `/signup`, `/forgot-password`, `/customer/dashboard`, `/customer/bookings`, `/customer/profile`) and contextual modals for booking-interrupted authentication.
  - *Why*: Delivers a bookmarkable web app feel while ensuring users never lose their selected booking slot.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 TRIMLY WEB                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Top Navbar (Logo, Explore, Services, How It Works, Login / User Profile)    │
├─────────────────────────────────────────────────────────────────────────────┤
│  App Route / View Manager                                                   │
│  ├── /home                   → HomePage (Hero, Search, Featured Shops)      │
│  ├── /explore                → ExplorePage (Maps location, Filters, Cards)  │
│  ├── /shop/:id               → ShopDetailPage (Gallery, Menu, Barbers)      │
│  ├── /login                  → LoginPage (Credentials, Demo logins, Error)  │
│  ├── /signup                 → SignupPage (Name, Email, Phone, Pass, Terms) │
│  ├── /forgot-password        → ForgotPasswordPage (Reset instruction flow)   │
│  └── /customer/* (Protected)                                                │
│      ├── /dashboard          → CustomerDashboardPage (Metrics, Next Hero)   │
│      ├── /bookings           → CustomerBookingsPage (Filters, Reschedule)   │
│      └── /profile            → CustomerProfilePage (Profile Settings, Form) │
├─────────────────────────────────────────────────────────────────────────────┤
│  Global State & Utilities Layer                                             │
│  ├── Auth State Store        → Active User, Registered Users list, Sessions  │
│  ├── Appointments Store      → User Bookings, Statuses, Filter queries      │
│  ├── Booking Engine          → Slot generation, Overlap math, INR pricing   │
│  └── Booking Wizard Modal    → Shop → Service → Barber → Slot → Review      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Mapping

- **UserProfile**:
  ```ts
  interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    isLoggedIn: boolean;
    avatarUrl?: string;
    memberSince: string;
    preferredShopId?: string;
  }
  ```
- **Appointment**:
  ```ts
  interface Appointment {
    id: string;
    bookingRef: string; // "TRM-XXXXX"
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shopId: string;
    shopName: string;
    shopAddress: string;
    shopImage: string;
    serviceId: string;
    serviceName: string;
    serviceDuration: number;
    servicePrice: number; // in INR
    bookingFee: number;   // in INR
    totalPrice: number;   // in INR
    barberId: string;
    barberName: string;
    date: string;         // YYYY-MM-DD
    startTime: string;    // "14:30"
    endTime: string;      // "15:15"
    status: 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
  }
  ```

### Step-by-Step Implementation Strategy

1. **Currency & Booking Calculation Engine (`src/utils/bookingEngine.ts`)**:
   - Add `formatINR(amount: number): string` ensuring consistent `₹` output.
   - Adjust baseline service prices in `barberShops.ts` to realistic INR amounts.
2. **Auth Service & Credentials Manager (`src/utils/authUtils.ts`)**:
   - Support login with either email or phone number.
   - Add validation rules for registration, password strength, and matching passwords.
   - Provide preconfigured demo accounts for fast testing.
3. **Dedicated Authentication Pages**:
   - `src/pages/LoginPage.tsx`
   - `src/pages/SignupPage.tsx`
   - `src/pages/ForgotPasswordPage.tsx`
4. **Customer Portal Views**:
   - `src/pages/CustomerDashboardPage.tsx` (Summary cards, Next upcoming appointment hero, quick actions)
   - `src/pages/CustomerBookingsPage.tsx` (Filter tabs, cancellation confirmation dialog, reschedule modal)
   - `src/pages/CustomerProfilePage.tsx` (Profile editing with instant sync to active session and future bookings)
   - Shared `CustomerLayout.tsx` for desktop sidebar and mobile tab navigation.
5. **Navbar & App Router Integration (`src/App.tsx`, `src/components/Navbar.tsx`)**:
   - Route handling for `/customer/dashboard`, `/customer/bookings`, `/customer/profile`, `/login`, `/signup`, `/forgot-password`.
   - Route protection: redirecting unauthenticated users to `/login`.
   - Preservation of pending booking configuration when authentication is required midway.
6. **Verification & Build Validation**:
   - Run tests and `compile_applet`.
   - Verify desktop and mobile viewports with browser automation screenshots.
