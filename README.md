# 🛡️ Phishing Defender (SaaS)

A production-style phishing detection web app built with Flask (API) and React (Vite + Tailwind), featuring JWT auth, URL analysis, history, and a modern dashboard UI.

## Tech
- Backend: Flask, JWT, SQLAlchemy, Migrate, CORS, python-dotenv
- Frontend: React (Vite), TailwindCSS, React Router, Axios, React Hot Toast, Recharts
- DB: SQLite (local) — upgradeable to PostgreSQL via `DATABASE_URL`

## Run Locally (Windows PowerShell)

### 1) Backend
```powershell
cd "phishing-saas/backend"
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
cd "phishing-saas/frontend"
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
- Tailwind CSS is pre-configured; dark mode enabled

## Next Steps
- Add WHOIS age check, email alerts, admin dashboard, and tests

Some URLs:
1.red:
http://update-security-check.now123.biz
http://paypal.com-user-login-confirmation.ga
http://bankofamerica-login-alert.cf
https://amazon-support-billing-error.tk
http://google-verify-user-login.ml
http://dropboxsecurefiles.gq

2.green:
https://www.google.com
https://github.com
https://openai.com
https://docs.python.org
https://vercel.com
https://developer.mozilla.org
https://www.microsoft.com
