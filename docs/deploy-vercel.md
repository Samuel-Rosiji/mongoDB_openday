# Deploy CareMap (Vercel + API)

Vercel hosts **only** the Vite frontend. The FastAPI backend must run elsewhere (e.g. [Render](https://render.com)) with `MONGO_URI` from Atlas.

## 1. Backend (Render — ~5 min)

1. [Render](https://dashboard.render.com/) → **New** → **Web Service** → connect `mongoDB_openday` repo.
2. **Root Directory:** `backend`
3. **Runtime:** Python 3
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Environment:** `MONGO_URI` = your Atlas connection string (same as local `.env`).
7. Deploy → copy the URL, e.g. `https://caremap-api.onrender.com`

Test: `https://YOUR-API.onrender.com/health` → `{"ok":true}`

Atlas → **Network Access** → allow `0.0.0.0/0` (or Render’s IPs) so the API can reach MongoDB.

## 2. Frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import GitHub `mongoDB_openday`.
2. **Root Directory:** `frontend` (Edit → set folder to `frontend`).
3. Framework should detect **Vite** (see `frontend/vercel.json`).
4. **Environment variables** (Production):

   | Name | Value |
   |------|--------|
   | `VITE_API_URL` | `https://YOUR-API.onrender.com` (no trailing slash) |
   | `VITE_MAPBOX_TOKEN` | your `pk.` token |
   | `VITE_DEMO` | `true` (optional, hides dev hint) |

5. **Deploy**.

6. **Mapbox:** [Access tokens](https://account.mapbox.com/access-tokens/) → edit token → **URL restrictions** → add your Vercel URL (`https://your-app.vercel.app/*`).

After the API URL is set, trigger **Redeploy** on Vercel (env vars are baked in at build time).

## 3. CLI (optional)

```bash
cd frontend
npx vercel login
npx vercel link
npx vercel env add VITE_API_URL
npx vercel env add VITE_MAPBOX_TOKEN
npx vercel --prod
```

## Troubleshooting

- **Map works, list empty:** wrong `VITE_API_URL` or API asleep (Render free tier cold start — wait ~30s).
- **CORS errors:** redeploy backend with latest `main.py` (`allow_origin_regex` for `*.vercel.app`).
- **Tiles blank:** Mapbox token missing or URL not allowed on Mapbox dashboard.
