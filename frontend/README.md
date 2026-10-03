# Frontend (Vite + React)

## First-time setup

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install react-leaflet leaflet
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:8000
```

## Implement (order)

1. Map centered on Dublin + list UI
2. Use mock from `docs/api-contract.md` until `/near` is ready
3. Wire filters → `GET /api/resources/near`
4. Resource detail + report form
5. Add community resource form
6. Dashboard → `GET /api/stats`

## Run

```bash
npm run dev
```

http://localhost:5173
