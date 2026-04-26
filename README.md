# Thread Tales by Teju

An e-commerce web application for handmade jewelry and accessories.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Shadcn/UI |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Auth | JWT + Google OAuth |
| Payments | Razorpay |
| Media | Cloudinary |

## Project Structure

```
ThreadTalesByTeju/
├── frontend/          # React TypeScript app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/           # FastAPI Python app
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── auth/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── alembic/
│   ├── alembic.ini
│   └── requirements.txt
└── README.md
```

---

## Prerequisites

- Node.js 18+
- Python 3.12+
- PostgreSQL 15+
- Yarn

---

## Frontend Setup

```bash
cd frontend
yarn install
yarn start
```

App runs at: `http://localhost:3000`

### Frontend Environment Variables

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

```bash
# Windows PowerShell
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/threadtalesbyteju

# JWT
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
FRONTEND_URL=http://localhost:3000
APP_NAME=Thread Tales by Teju
DEBUG=True
```

### 5. Database Migrations

Make sure PostgreSQL is running and the database `threadtalesbyteju` is created, then run:

```bash
alembic revision --autogenerate -m "initial migration"
alembic upgrade head
```

### 6. Run Backend

```bash
uvicorn app.main:app --reload --port 8000
```

API runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

## Third-Party Services Setup

### Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized origins: `http://localhost:3000`
5. Add redirect URI: `http://localhost:8000/api/v1/auth/google/callback`

### Razorpay
1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Account & Settings → API Keys
3. Generate test keys and copy Key ID and Key Secret

### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret from dashboard
3. Go to Settings → Upload → Add upload preset named `threadtales_products`

---

## Running the Full App

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
yarn start
```

Then open `http://localhost:3000` in your browser.

---

## PowerShell Execution Policy (Windows)

If you get a script execution error when activating venv:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
