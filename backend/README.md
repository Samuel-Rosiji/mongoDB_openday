# Backend (FastAPI)

## First-time setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pymongo python-dotenv
```

Create `backend/.env` from root `.env.example`.

## Implement (order)

1. `GET /health`
2. MongoDB connection + `2dsphere` index on `resources.location`
3. `POST /api/seed` + Dublin sample data
4. `GET /api/resources/near` (geo + filters)
5. `POST /api/resources`, `POST /api/reports`
6. `GET /api/stats` (aggregations)

## Run

```bash
uvicorn main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs
