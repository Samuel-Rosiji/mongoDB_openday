# CareMap Dublin — mongoDB_openday

MVP: find nearby support resources (food, shelter, hygiene, etc.) in Dublin using MongoDB geospatial queries.

## Repo layout

| Path | Owner |
|------|--------|
| `backend/` | FastAPI + MongoDB |
| `frontend/` | Vite + React + Leaflet |
| `docs/api-contract.md` | Shared API — discuss before changing |

## Prerequisites

- MongoDB Atlas cluster + connection string
- Python 3.11+
- Node 20+

## Setup

1. Copy `.env.example` → `backend/.env` and `frontend/.env` (see comments in example file).
2. **Backend:** see `backend/README.md`
3. **Frontend:** see `frontend/README.md`

## Run locally

```bash
# Terminal 1 — backend (port 8000)
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

## Demo script

1. Allow location (or use Dublin default).
2. Filter **Food + Hygiene**, **Open now**.
3. Open a resource → report an issue.
4. Add a **community** resource.
5. Open dashboard → stats.

## Git workflow

- Small PRs per folder: `backend/*`, `frontend/*`
- Do not commit `.env` files
- API changes → update `docs/api-contract.md` in the same PR
