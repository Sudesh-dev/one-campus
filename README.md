# One Campus

One Campus is a frontend prototype for a student portal focused on day-to-day academic visibility, including attendance, class schedule, and campus notices.

## Project Status

- Prototype stage (frontend only)
- Authentication flow is mocked for local UI demonstration
- No backend API integration yet

## Overview

The current app provides two main screens:

- Login/Register screen at `/`
- Student dashboard at `/dashboard`

After sign-in, the dashboard presents a quick academic snapshot such as attendance, next class, and recent notices.

## Tech Stack

- React 19
- React Router DOM 7
- Tailwind CSS 4
- Vite 8
- ESLint 9

## Project Structure

```text
one-campus/
├─ README.md
└─ frontend/
	├─ package.json
	├─ index.html
	├─ vite.config.js
	├─ public/
	└─ src/
		├─ App.jsx
		├─ main.jsx
		└─ pages/
			├─ Login.jsx
			└─ Dashboard.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

From the repository root:

```bash
cd frontend
npm install
```

### Run Locally

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
- Route-based navigation between login and dashboard
- Dashboard cards for attendance, upcoming class, and notices
- Responsive utility-first styling using Tailwind CSS

## Known Limitations

- Login currently navigates directly to the dashboard (no credential verification)
- No persistent user session or logout logic wired to backend
- Dashboard data is static and not fetched from APIs

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

The existing `frontend/README.md` is the generated Vite template and can be updated later with module-specific frontend documentation.
