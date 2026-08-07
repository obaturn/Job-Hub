# JobHub frontend

The JobHub frontend is a React 19 and Vite application for the Phase 1.2 authentication experience.

## Run locally

```bash
npm install
npm run dev
```

Create a `.env` file when the API is not running on the default port:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Available routes

- `/` — JobHub landing page
- `/register` — registration
- `/verify-email/pending` — verification waiting state
- `/verify-email?token=...` — token-driven email verification
- `/login` — login and Remember Me
- `/forgot-password` — password recovery request
- `/reset-password?token=...` — token-driven password reset
- `/profile/setup` — protected Phase 1.3 placeholder

The frontend keeps the access token in memory and sends credentialed requests so the backend can manage the refresh-token cookie. The API must allow credentialed CORS from the frontend origin.

## Validation

```bash
npm run lint
npm run build
```
