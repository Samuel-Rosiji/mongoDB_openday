# Backend — arranque rápido

## 1. Crear `backend/.env` (una vez)

Pedí al compañero la URI de Atlas o copiala del dashboard:

```env
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/caremap?retryWrites=true&w=majority
```

(Sin `<` `>` — contraseña URL-encoded si tiene caracteres raros.)

## 2. Terminal (desde la carpeta `backend/`)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```

## 3. Probar

- http://localhost:8000/health → `{"ok":true}`
- http://localhost:8000/docs → Swagger

## 4. Frontend

En `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Reiniciar `npm run dev`.
