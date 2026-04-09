# One Campus

One Campus is a frontend prototype for a student portal focused on day-to-day academic visibility, including attendance, class schedule, and campus notices.

## Project Status

- Prototype stage (frontend only)
- Authentication flow is mocked for local UI demonstration
- No backend API integration yet

## Overview

The current app provides a login screen and a multi-page student portal after sign-in.

- Login/Register screen at `/`
- Student dashboard at `/dashboard`
- Smart noticeboard at `/notices`
- Attendance analytics at `/attendance`
- Marks and results at `/marks`
- Letter generator at `/letters`
- Student profile at `/profile`

All post-login routes are rendered inside a shared sidebar layout with mobile and desktop navigation.

## Tech Stack

- React 19
- React Router DOM 7
- Tailwind CSS 4
- Vite 8
- ESLint 9

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

From the repository root, install dependencies in the frontend app:

```bash
cd frontend
npm install
```

### Run Locally

Start the Vite dev server from the frontend directory:

```bash
cd frontend
npm run dev
```

The Vite development server will print a local URL (typically `http://localhost:5173`).

## Available Scripts

Run these from the `frontend` directory:

- `npm run dev` - Starts local development server
- `npm run build` - Builds production assets
- `npm run preview` - Serves the production build locally
- `npm run lint` - Runs ESLint checks

## Current Features

- Login/Register UI toggle on a single page
- Route-based navigation across six authenticated student pages
- Shared responsive sidebar layout with active-route highlighting
- Dashboard cards for attendance, upcoming class, notices, and CGPA
- Smart noticeboard with category filters, search, and attachment preview modal
- Attendance analytics with charts and subject-wise shortage/safe-bunk indicators
- Marks module with IA tab, VTU results tab, and SGPA trend visualization
- Letter generator with compose, history, save/delete, and print-ready preview
- Profile management with personal/academic/security sections and completion meter
- Responsive utility-first styling using Tailwind CSS

## Known Limitations

- Login currently navigates directly to the dashboard (no credential verification)
- No persistent user session or logout logic wired to backend
- All module data is static/mock and not fetched from APIs
- Backend integration markers are comments only (no real service calls yet)
- No automated tests are configured yet

## Roadmap

- Add backend authentication and secure session handling
- Connect dashboard cards to live student data APIs
- Add role-based views (student, faculty, admin)
- Introduce tests (unit and integration)
- Add CI checks for lint and build

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Run lint and build checks:

	```bash
	cd frontend
	npm run lint
	npm run build
	```

4. Open a pull request with a clear summary.

## Notes

The app is intentionally frontend-only right now. All post-login data and flows are mocked locally until backend integration is added.
