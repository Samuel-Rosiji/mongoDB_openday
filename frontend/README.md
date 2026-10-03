# Frontend (Vite + React)

## First-time setup

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install react-leaflet leaflet
```

Copy env and add Mapbox (recommended for demo):

```bash
cp .env.example .env
```

Edit `frontend/.env` — set `VITE_MAPBOX_TOKEN` to your **public** token (`pk.`…).

See [Mapbox setup](#mapbox-map--eircode) below.

## Implement (order)

1. Map centered on Dublin + list UI
2. Use mock from `docs/api-contract.md` until `/near` is ready
3. Wire filters → `GET /api/resources/near`
4. Resource detail + report form
5. Add community resource form
6. Dashboard → `GET /api/stats`

## Mapbox (map + Eircode)

1. Sign in at [mapbox.com](https://www.mapbox.com/).
2. Open [Access tokens](https://account.mapbox.com/access-tokens/).
3. Use the **Default public token** or create a token with scopes:
   - `styles:read` (map tiles)
   - `geocoding` (address / Eircode search)
4. Restrict URL to `http://localhost:*` for hackathon (optional).
5. Paste into `frontend/.env`:
   ```
   VITE_MAPBOX_TOKEN=pk.eyJ...
   ```
6. Restart: `npm run dev`.

Without a token the app falls back to OpenStreetMap tiles and weaker geocoding.

## Kiosk (train station / bus shelter screen)

Set in `frontend/.env` — fixed **You are here**, no GPS:

```
VITE_KIOSK_MODE=true
VITE_KIOSK_LAT=53.3509
VITE_KIOSK_LNG=-6.2499
VITE_KIOSK_LABEL=Connolly Station
```

Restart `npm run dev`. Map searches from this point; blue dot = you are here.

## Run

```bash
npm run dev
```

http://localhost:5173
