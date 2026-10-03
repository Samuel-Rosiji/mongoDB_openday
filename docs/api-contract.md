# CareMap Dublin — API contract

**Base URL (local):** `http://localhost:8000`  
**Version:** MVP v0 — change only with team agreement.

## Categories

`food` | `shelter` | `hygiene` | `wifi` | `social`

## Source (read-only on create for community)

`verified` | `community` — new resources via API are always `community`.

---

## `GET /health`

**Response 200**

```json
{ "ok": true }
```

---

## `GET /api/resources/near`

| Query param   | Required | Default | Notes                          |
|---------------|----------|---------|--------------------------------|
| `lat`         | yes      | —       | WGS84                          |
| `lng`         | yes      | —       | WGS84                          |
| `radius`      | no       | `5000`  | meters                         |
| `categories`  | no       | all     | comma-separated, e.g. `food,hygiene` |
| `openNow`     | no       | false   | `true` \| `false`              |

**Response 200**

```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Capuchin Day Centre",
      "category": "food",
      "description": "Meals and support services.",
      "contact": "+353 1 872 0770",
      "hours": "Mon–Fri 08:00–16:00",
      "openNow": true,
      "source": "verified",
      "location": {
        "type": "Point",
        "coordinates": [-6.262, 53.352]
      },
      "distanceMeters": 412
    }
  ]
}
```

**Errors:** `400` if `lat` or `lng` missing/invalid.

---

## `GET /api/resources/{id}`

**Response 200:** single resource object (same fields as item above, without `distanceMeters`).

**Response 404:** `{ "detail": "Resource not found" }`

---

## `POST /api/resources`

**Body**

```json
{
  "name": "Community soup run",
  "category": "food",
  "description": "Hot food at the square.",
  "contact": "",
  "hours": "Sat 18:00–20:00",
  "openNow": true,
  "location": {
    "type": "Point",
    "coordinates": [-6.2603, 53.3498]
  }
}
```

**Response 201:** created resource including `id` and `source: "community"`.

---

## `POST /api/reports`

**Body**

```json
{
  "resourceId": "507f1f77bcf86cd799439011",
  "type": "closed"
}
```

`type`: `closed` | `wrong_info` | `gone`

**Response 201**

```json
{
  "id": "...",
  "resourceId": "...",
  "type": "closed",
  "status": "pending",
  "createdAt": "2026-10-03T12:00:00Z"
}
```

---

## `GET /api/stats`

**Response 200**

```json
{
  "totalResources": 18,
  "verified": 10,
  "community": 8,
  "byCategory": {
    "food": 6,
    "hygiene": 4,
    "shelter": 3,
    "wifi": 2,
    "social": 3
  },
  "pendingReports": 2
}
```

---

## `POST /api/seed` (dev only)

Query: `?secret=` must match `SEED_SECRET` if set.

**Response 200:** `{ "inserted": 15, "indexes": ["location_2dsphere"] }`

---

## CORS

Allow origin: `http://localhost:5173`

## GeoJSON note

`location.coordinates` = **`[longitude, latitude]`** (not lat,lng).
