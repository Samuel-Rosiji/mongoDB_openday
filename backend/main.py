import os
from datetime import datetime
from typing import Dict, Optional

import certifi
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise RuntimeError("Set MONGO_URI or MONGODB_URI in backend/.env")

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["caremap"]

app = FastAPI(title="CareMap Dublin API")

_extra_origins = [
    o.strip()
    for o in (os.getenv("CORS_ORIGINS") or "").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        *_extra_origins,
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


class CreateResourceBody(BaseModel):
    name: str
    category: str
    description: str
    contact: str = ""
    hours: str = ""
    openNow: bool = True
    location: dict


class CreateReportBody(BaseModel):
    resourceId: str
    type: str = Field(pattern="^(closed|wrong_info|gone)$")


def serialize_resource(doc: dict, distance_meters: Optional[float] = None) -> dict:
    out = {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "category": doc.get("category", "food"),
        "description": doc.get("description", ""),
        "contact": doc.get("contact", ""),
        "hours": doc.get("hours", ""),
        "openNow": doc.get("openNow", True),
        "source": doc.get("source", "community"),
        "location": doc.get("location"),
    }
    if distance_meters is not None:
        out["distanceMeters"] = round(distance_meters, 1)
    return out


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/api/resources/near")
def get_nearby_resources(
    lat: float,
    lng: float,
    radius: int = 5000,
    categories: Optional[str] = None,
    openNow: bool = False,
):
    pipeline: list = [
        {
            "$geoNear": {
                "near": {"type": "Point", "coordinates": [lng, lat]},
                "distanceField": "distanceMeters",
                "maxDistance": radius,
                "spherical": True,
            }
        },
    ]

    match: dict = {}
    if categories:
        cats = [c.strip() for c in categories.split(",") if c.strip()]
        if cats:
            match["category"] = {"$in": cats}
    if openNow:
        match["$or"] = [{"openNow": True}, {"openNow": {"$exists": False}}]

    if match:
        pipeline.append({"$match": match})

    pipeline.append({"$limit": 50})

    items = []
    for doc in db.resources.aggregate(pipeline):
        items.append(
            serialize_resource(doc, doc.get("distanceMeters")),
        )

    return {"items": items}


@app.get("/api/resources/{resource_id}")
def get_resource(resource_id: str):
    try:
        oid = ObjectId(resource_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")
    doc = db.resources.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Resource not found")
    return serialize_resource(doc)


@app.post("/api/resources", status_code=201)
def create_resource(body: CreateResourceBody):
    doc = {
        "name": body.name,
        "category": body.category,
        "description": body.description,
        "contact": body.contact,
        "hours": body.hours,
        "openNow": body.openNow,
        "source": "community",
        "location": body.location,
        "createdAt": datetime.utcnow(),
    }
    result = db.resources.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_resource(doc)


@app.post("/api/reports", status_code=201)
def create_report(body: CreateReportBody):
    try:
        oid = ObjectId(body.resourceId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid resourceId")

    if not db.resources.find_one({"_id": oid}):
        raise HTTPException(status_code=404, detail="Resource not found")

    doc = {
        "resourceId": oid,
        "type": body.type,
        "status": "pending",
        "createdAt": datetime.utcnow(),
    }
    result = db.reports.insert_one(doc)
    return {
        "id": str(result.inserted_id),
        "resourceId": body.resourceId,
        "type": body.type,
        "status": "pending",
        "createdAt": doc["createdAt"].isoformat() + "Z",
    }


@app.get("/api/stats")
def get_stats():
    total = db.resources.count_documents({})
    verified = db.resources.count_documents({"source": "verified"})
    community = db.resources.count_documents({"source": "community"})
    pending_reports = db.reports.count_documents({"status": "pending"})

    by_category: Dict[str, int] = {
        "food": 0,
        "shelter": 0,
        "hygiene": 0,
        "wifi": 0,
        "social": 0,
    }
    for row in db.resources.aggregate(
        [{"$group": {"_id": "$category", "count": {"$sum": 1}}}],
    ):
        cat = row.get("_id")
        if cat in by_category:
            by_category[cat] = row["count"]

    return {
        "totalResources": total,
        "verified": verified,
        "community": community,
        "byCategory": by_category,
        "pendingReports": pending_reports,
    }
