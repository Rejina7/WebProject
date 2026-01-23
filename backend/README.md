# Backend

Simple Express API for auth, products, and feedback.

## Endpoints
- `GET /api/health` — health check
- `POST /api/login` — demo login returns token
- `POST /api/signup` — create user
- `GET /api/products` — list products
- `POST /api/products` — add product `{ name, price }`
- `GET /api/feedback` — list feedback
- `POST /api/feedback` — add feedback `{ message }`

## Dev
```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`. Update CORS in `src/server.js` if your frontend runs elsewhere.
