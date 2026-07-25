# Ayush Chauhan — Portfolio (Full Stack)

A production-ready personal portfolio for **Ayush Chauhan** — JavaScript Developer & Salesforce
Administrator. Built with the MERN stack, JWT auth, an admin dashboard, and a premium dark UI.

## Status: Phase 1 & 2 complete

- ✅ **Phase 1 — Scaffolding**: Full backend (Express + MVC) and frontend (React 19 + Vite +
  Tailwind + Framer Motion) project structure, models, controllers, routes, and pages.
- ✅ **Phase 2 — Real content**: Hero, About, Skills, Projects, Experience, Education wired up
  with Ayush's actual confirmed information. Anything not yet provided (GitHub/LinkedIn links,
  resume PDF, project screenshots, live demo URLs, logo, favicon) is left as a clearly marked,
  editable placeholder — search the codebase for `TODO(Ayush)` to find every one.
- ⏳ **Phase 3 — Integrations** (not started): Wiring real MongoDB Atlas, JWT secrets,
  Cloudinary, and SMTP credentials once you provide them.
- ⏳ **Phase 4 — Deployment**: Vercel (frontend), Render (backend) configs and final domain/SEO
  wiring.

## What you can do right now

The **frontend runs on its own** with real fallback content (`frontend/src/data/siteData.js`),
so you can review the design and copy before any backend/database work happens:

```bash
cd frontend
npm install
npm run dev
```

The **backend** also boots without a database connection (it just logs a warning), so you can
review the API structure:

```bash
cd backend
npm install
npm run dev
```

## Finding what's still missing

Every placeholder is marked one of two ways:

1. A `TODO(Ayush): ...` comment directly above the field in code
   (e.g. `frontend/src/data/siteData.js`, `backend/utils/seedData.js`).
2. A visible in-UI placeholder state (e.g. "Screenshot coming soon", disabled "Live Demo" button).

Grep for every open item at once:

```bash
grep -rn "TODO(Ayush)" backend frontend
```

## What I still need from you before Phase 3

- GitHub profile URL
- LinkedIn profile URL
- Public contact email (or confirm the one in `siteData.js`)
- Resume PDF
- Project screenshots (NexBank, Gym Management System)
- GitHub repo + live demo links for each project
- Confirmed tech stack per project, plus full descriptions/features if you want more than the
  one-line summaries already in the brief
- Logo / favicon (a placeholder monogram is in `frontend/public/favicon.svg` for now)
- Real domain name (for `sitemap.xml`, `robots.txt`, and Open Graph tags)

None of these require credentials — just content. When you're ready to move to Phase 3, you'll
also need to generate (not send me directly — you'll paste these into your own `.env` files):

- MongoDB Atlas connection URI
- JWT secret(s)
- Cloudinary cloud name / API key / API secret
- SMTP email + app password
- Admin login email/password (used once by `backend/utils/seedData.js` to create your admin
  account)

## Project structure

```
ayush-portfolio/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/      # Route logic (MVC)
│   ├── models/           # Mongoose schemas (6 collections)
│   ├── routes/           # Express routers
│   ├── middleware/        # Auth, error handling, rate limiting, uploads
│   ├── utils/             # JWT, email, seed script
│   ├── uploads/           # Local fallback file storage (pre-Cloudinary)
│   └── server.js
└── frontend/
    └── src/
        ├── components/    # Navbar, Hero, About, Skills, Projects, Contact, etc.
        ├── pages/         # Home, ProjectDetails, NotFound, Admin pages
        ├── layouts/       # MainLayout (public), AdminLayout (protected)
        ├── hooks/         # useScrollSpy, useApiData
        ├── context/       # AuthContext (admin JWT session)
        ├── services/      # Axios instance
        └── data/          # Real fallback content + TODO placeholders
```

## Deployment targets (Phase 4)

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
- Images/PDF → Cloudinary
