# 🛡️ Phishing Defender

A production-style phishing detection web app built with Flask (API) and React (Vite + Tailwind), featuring JWT auth, URL analysis, history, and a modern dashboard UI.


## Demo Video
Coming soon

## Tech
- Backend: Flask, JWT, SQLAlchemy, Migrate, CORS, python-dotenv
- Frontend: React (Vite), TailwindCSS, React Router, Axios, React Hot Toast, Recharts, Framer Motion, lucide-react
- DB: SQLite (local) — upgradeable to PostgreSQL via `DATABASE_URL`

### UI Highlights
- Minimal, modern radial gauge (green → yellow → red) with smooth animations
- Subtle page transitions and microinteractions
- Dark mode enabled by default with a navbar toggle

## Run Locally (Windows PowerShell)

### 1) Backend
```powershell
cd "backend"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Create .env
Copy-Item .env.example .env
# Initialize DB (first run only)
$env:FLASK_APP="app:create_app"; $env:FLASK_ENV="development"
flask db init
flask db migrate -m "init"
flask db upgrade
flask run
```
API runs at http://127.0.0.1:5000

### 2) Frontend
```powershell
cd "frontend"
npm install
npm run dev
```
App runs at http://localhost:5173

## .env (backend)
```
FLASK_ENV=development
JWT_SECRET_KEY=your_secret_here
DATABASE_URL=sqlite:///phishing.db
CORS_ORIGINS=http://localhost:5173
```

## API Summary
- POST /api/register — { email, password }
- POST /api/login — { email, password } → { access_token }
- GET  /api/profile — JWT required
- POST /api/check-url — { url } → risk_score, status, reasons
- GET  /api/history — list of scans (current user)
- POST /api/profile/password — { new_password }

## Notes
- JWT is stored in localStorage by the frontend and sent as `Authorization: Bearer <token>`
- URL analysis uses heuristics: HTTPS, redirects, suspicious keywords, length/encoding, subdomains, hyphens, reachability
- Tailwind CSS is pre-configured; dark mode enabled (default)

## Next Steps
- Add WHOIS age check, email alerts, admin dashboard, and tests
