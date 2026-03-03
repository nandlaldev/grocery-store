# Grocery Store – Node + Express + MongoDB + React + EJS Admin

Full-stack grocery app: **backend** (Node, Express, MongoDB), **frontend** (React + Vite), and **admin** (EJS).

## Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, Multer (uploads)
- **Frontend**: React 19, Vite, React Router, Tailwind CSS 3.4
- **Admin**: EJS views served by Express, session-based login

## Quick start

### 1. MongoDB

Ensure MongoDB is running (e.g. local or Atlas). Set `MONGODB_URI` in backend `.env` if needed.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, optional PORT
npm install
npm run seed-admin   # creates admin@... / admin123 (or set ADMIN_EMAIL, ADMIN_PASSWORD)
npm run dev
```

API: `http://localhost:4000`  
Admin: `http://localhost:4000/admin` (login with admin email/password from seed).

### 3. Frontend

```bash
cd grocery-store
npm install
npm run dev
```

App: `http://localhost:5173`. Vite proxies `/api` and `/uploads` to the backend.

### 4. Production build

- **Backend**: `npm start` (set `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `SESSION_SECRET`).
- **Frontend**: Set `VITE_API_URL` to your backend URL (e.g. `https://api.yoursite.com`), then `npm run build`. Serve the `dist` folder with any static host.

## API

- `POST /api/auth/register` – body: `{ fullName, email, password }`
- `POST /api/auth/login` – body: `{ email, password }`
- `GET /api/products` – query: `?category=&search=`
- `GET /api/products/categories`
- `GET /api/products/:id`
- `POST /api/cart` – body: `{ productId, quantity }` (auth)
- `GET /api/cart` (auth)
- `PUT /api/cart/:productId` – body: `{ quantity }` (auth)
- `DELETE /api/cart/:productId` (auth)
- `POST /api/orders` – body: `{ fullName, phone, address, city, pincode }` (auth)
- `GET /api/orders` (auth)

Admin product CRUD is session-based at `/admin` (EJS); API product create/update/delete require JWT with admin role.

## Create first admin

From `backend`:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npm run seed-admin
```

Then log in at `/admin/login`.
