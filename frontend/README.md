# 💻 Danzup Studio - Frontend Client

This is the frontend client application for **Danzup Studio**, built using **React 19**, **Vite**, **Bootstrap 5**, and **React Router v7**. 

It features a fully responsive, modern dark-themed user interface with luxury gold accents, glassmorphic UI elements, custom interactive modals, and smooth CSS animations.

---

## 🚀 Features & Capabilities

- **Single Page Application (SPA)**: Rapid navigation with zero page reloads via React Router v7.
- **Scroll restoration**: Automatically resets window scroll to the top on page routing using the custom `<ScrollToTop />` helper.
- **Trial Booking System**: Interactive modal that enables prospective students to book free trial sessions for Dance, Garba, and Yoga classes.
- **Interactive Galleries**: Responsive image grids supporting hover zoom, translation animations, and perfect aspect ratios using Bootstrap `.ratio-1x1` container configurations.
- **Secure Admin Workspace**: Administrative pages (`/admin`) protecting access to analytical insights, bookings tracking, and contact details with full authentication state synchronization.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) (Functional components & hooks)
- **Tooling**: [Vite](https://vite.dev/) (Ultra-fast HMR and bundle compilation)
- **Scaffolding**: [Bootstrap 5](https://getbootstrap.com/) (Grid systems, breadcrumbs, modals, and flexbox utilities)
- **Routing**: [React Router v7](https://reactrouter.com/) (Declarative route matching)
- **Linting**: [Oxlint](https://github.com/oxc-project/oxlint) (Modern, high-performance JS linter)
- **Styling**: Custom CSS variables, responsive keyframe animations, and HSL tailored dark-mode tokens defined in `src/index.css`.

---

## 📂 Directories & Component Mapping

```text
frontend/
├── dist/                   # Production build directory (generated on build)
├── public/                 # Static assets (favicons, manifest, metadata)
├── src/
│   ├── assets/             # Branding assets, logos, and local stylesheets
│   ├── components/         # Reusable presentation and utility components
│   │   ├── BookingModal.jsx       # Trial booking and details form
│   │   ├── Footer.jsx             # Brand info & quick links with SPA routes
│   │   ├── Navbar.jsx             # Fixed glassmorphic navigation header
│   │   ├── ScrollToTop.jsx        # Route change scroll listener
│   │   ├── StatCounter.jsx        # Numeric reveal trigger observer
│   │   ├── TestimonialsSlider.jsx # Swipeable customer review sliders
│   │   └── WhatsAppFloat.jsx      # WhatsApp direct chat floating button
│   ├── image/              # High-quality optimized gallery photos
│   ├── pages/              # Fully structured route pages
│   │   ├── AboutPage.jsx          # Studio background, philosophy, & trainers info
│   │   ├── AdminDashboardPage.jsx # Protected panels for viewing bookings/contacts
│   │   ├── AdminLoginPage.jsx     # Admin authentication gateway form
│   │   ├── CelebrationsPage.jsx   # Wedding choreo, Navratri prep, & event displays
│   │   ├── ClassesPage.jsx        # Schedules, batch info, and programs
│   │   ├── ContactPage.jsx        # Inquiry forms & direct contact details
│   │   ├── GalleryPage.jsx        # Local performance photo showcases
│   │   ├── LandingPage.jsx        # App landing portal & hero sections
│   │   └── StudioLookPage.jsx     # High-resolution studio interior photos
│   ├── App.jsx             # Top-level Routing definitions
│   ├── index.css           # Core styling system, HSL color tokens, & global overrides
│   └── main.jsx            # DOM renderer initialization entry point
├── vite.config.js          # Vite HMR, alias, and local API proxy configurations
└── package.json            # Client packages configuration
```

---

## 💻 Local Development

### 1. Installation
Install all client-side dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
*The dev server will run by default at `http://localhost:5173`. API calls to `/api/*` and static local assets are configured via `vite.config.js` to proxy directly to the backend server running at `http://localhost:5000`.*

### 3. Linting
Verify code quality and check for warnings using Oxlint:
```bash
npm run lint
```

### 4. Build for Production
Compile and optimize source code into static html, css, and js assets under the output directory (`dist/`):
```bash
npm run build
```
