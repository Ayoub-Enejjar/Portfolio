# replit.md

## Overview

This is a personal portfolio website for Ayoub Enejjar, a Computer Science student. It consists of a static frontend (dark-themed profile card with animations, service cards, and a contact form) and a Node.js/Express backend API that handles contact form submissions and stores them in MongoDB. The site is deployed on Netlify (frontend) and the backend is a separate Express server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Technology:** Vanilla HTML, CSS, and TypeScript (compiled to JavaScript). Despite the repo name referencing Angular, there is no Angular framework in use — it's a plain static site.
- **Structure:** The main frontend lives in the `MultipleFiles/` directory with `index.html`, `projet.css`, `projet.ts`, and compiled `projet.js`.
- **Styling:** Custom CSS with CSS variables for theming (dark theme with gold accents). Uses Google Fonts (Inter, Playfair Display). Features glassmorphism effects, sticky header with backdrop blur, scroll-reveal animations via IntersectionObserver, and 3D hover effects on service cards.
- **TypeScript:** A simple `tsconfig.json` targets ES2016 with strict mode. The TS file compiles to `projet.js` which is loaded by the HTML. TypeScript is listed as a root dependency.
- **Serving:** The `serve` npm package is available at the root level for serving static files locally.

### Backend
- **Technology:** Node.js with Express 5.x
- **Location:** `backend/` directory with its own `package.json`
- **API Design:** RESTful API with a single resource endpoint at `/api/contact`
  - `POST /api/contact` — Saves a contact form submission (name, email, optional meetingDate/meetingTime, message)
  - `GET /api/contact` — Retrieves all contact messages sorted by newest first
- **Database:** MongoDB via Mongoose 8.x. The connection string is loaded from a `.env` file using `dotenv`.
- **Data Model:** `ContactMessage` schema with fields: name (required), email (required, validated with regex), meetingDate (optional), meetingTime (optional), message (required), createdAt (auto-generated).
- **Middleware:** CORS enabled for all origins, JSON body parsing via `express.json()`.
- **Error Handling:** Mongoose validation errors return 400 with specific messages; other errors return 500.

### Key Architectural Decisions
1. **Separate frontend and backend** — The frontend is a static site that can be deployed independently (e.g., Netlify). The backend is a standalone Express server. This means the frontend needs to make API calls to the backend URL for contact form submissions.
2. **No build system for frontend** — No bundler (Webpack, Vite, etc.). TypeScript is compiled manually with `tsc`. The HTML directly references the compiled JS and CSS files.
3. **MongoDB for data storage** — Chosen for flexibility with the contact message schema. Connection requires a `MONGODB_URI` environment variable.

### Environment Variables Required
- `MONGODB_URI` — MongoDB connection string (required for backend)
- `PORT` — Server port (defaults to 3000)

These should be set in a `.env` file in the `backend/` directory.

## External Dependencies

### Frontend (root package.json)
- `serve` — Static file server for local development
- `typescript` — TypeScript compiler

### Backend (backend/package.json)
- `express` (v5.x) — Web framework
- `mongoose` (v8.x) — MongoDB ODM
- `cors` — Cross-origin resource sharing middleware
- `dotenv` — Environment variable loading from `.env` files

### External Services
- **MongoDB** — Database for storing contact form submissions. Requires a running MongoDB instance or cloud service (e.g., MongoDB Atlas). Connection string via `MONGODB_URI` env var.
- **Google Fonts** — Inter and Playfair Display fonts loaded via CDN
- **Netlify** — Frontend deployment target (live at websitecicada.netlify.app)
- **External image hosting** — Profile image loaded from Bing CDN, favicon from Vecteezy