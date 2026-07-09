# 💃 Danzup Studio

A premium, full-stack web application for **Danzup Studio**—a professional dance, fitness, and celebrations academy. Built using a modern React + Vite frontend and a secure Node.js + Express + MongoDB backend.

---

## ✨ Features

- **Luxury User Interface**: High-end modern dark design with curated gold gradients, glassmorphism panels, 3D card tilt effects, and smooth scroll animations.
- **Single Page Application (SPA)**: Robust client-side routing powered by React Router v7 with seamless page transitions and scroll-to-top helpers.
- **Interactive Bookings**: Multi-purpose free trial booking modal (Dance, Garba, Yoga) and wedding choreography inquiry forms.
- **Admin Portal**: Secure password-protected administrative dashboard to view, status-track, and manage contact submissions and bookings.
- **Automated Notifications**: Full integration with Nodemailer for instant email alerts to administrators upon new inquiries.
- **Production-Ready Security**: Secure Express headers via Helmet.js, rate limiting to prevent abuse, clean CORS management, and SQL/NoSQL injection protections.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite** (Next-generation dev server & bundler)
- **React Router v7** (Decoupled navigation & SPA routing)
- **Bootstrap 5** (Responsive layout scaffolding & utility classes)
- **FontAwesome 6** (Luxury vector icons)

### Backend
- **Node.js** & **Express.js** (Server framework)
- **MongoDB** & **Mongoose** (Database & schema modeling)
- **Nodemailer** (Automated email service)
- **Helmet** & **Express-Rate-Limit** (Security headers & rate limiter)

---

## 📂 Project Structure

```text
Denzup/
├── dist/                   # Compiled frontend assets (production build)
├── frontend/               # React + Vite client application
│   ├── src/
│   │   ├── assets/         # Static images & styling variables
│   │   ├── components/     # Reusable UI components (Navbar, Footer, BookingModal, etc.)
│   │   ├── pages/          # Page views (LandingPage, AboutPage, ClassesPage, etc.)
│   │   ├── App.jsx         # App routing & root state
│   │   └── main.jsx        # Client entry point
│   ├── vite.config.js      # Vite configurations & proxy settings
│   └── package.json        # Frontend dependencies
├── models/                 # Mongoose schemas (Contact, Booking, Admin)
│   └── utils/              # Email handlers & DB initializers
├── routes/                 # Express backend API endpoints
├── server.js               # Entry point Express backend server
├── app.yaml                # Google App Engine deployment configuration
├── package.json            # Root scripts & backend dependencies
└── README.md               # Project documentation
```

---

## 🚀 Setup & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas connection URI)
- A Google Account (to configure a Gmail App Password for SMTP alerts)

### Step-by-Step Guide

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Denzup
   ```

2. **Install all dependencies:**
   This root-level script will install dependencies for both the backend server and the frontend directory.
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables:**
   Create a `.env` file at the root level:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   
   # SMTP Email Settings
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ADMIN_EMAIL=recipient_email_for_inquiries@gmail.com
   ```
   *Note: For `EMAIL_PASS`, generate an **App Password** from your Google Account settings. Standard passwords will be blocked by Google SMTP servers.*

4. **Run Development Servers:**
   Launch both the Express backend API and the Vite dev server concurrently:
   ```bash
   npm run dev-all
   ```
   - Frontend client: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

5. **Build for Production:**
   To bundle the frontend application assets into the production folder (`dist/`):
   ```bash
   npm run build-frontend
   npm start
   ```
   The backend Express server will now serve the compiled client directly at: `http://localhost:5000`

---

## 🔒 API Reference

### Client Inquiries
- `POST /api/contact/submit` — Submit a general inquiry
- `POST /api/bookings/create` — Create a trial class booking

### Admin Panel
- `POST /api/admin/login` — Secure admin authentication
- `GET /api/admin/contacts` — Fetch all contact requests (authenticated)
- `PUT /api/admin/contacts/:id/status` — Update inquiry status (authenticated)
- `GET /api/admin/bookings` — Fetch all class bookings (authenticated)
- `PUT /api/admin/bookings/:id/status` — Update booking status (authenticated)
- `GET /api/admin/stats` — Fetch dashboard analytical counts (authenticated)

### System Health
- `GET /api/health` — Returns server uptime and status checks

---

## 🛠️ Deploying to Google App Engine

This codebase is pre-configured with `app.yaml` for GCP App Engine:

1. Build the frontend:
   ```bash
   npm run build-frontend
   ```
2. Deploy using Google Cloud SDK:
   ```bash
   gcloud app deploy
   ```

---

## 📝 License
This project is licensed under the MIT License.
