from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["caremap"]


@app.get("/api/resources/near")
def get_nearby_resources(lat: float, lng: float, radius: int = 5000, category: str = None):
    query = {
        "location": {
            "$nearSphere": {
                "$geometry": {"type": "Point", "coordinates": [lng, lat]},
                "$maxDistance": radius
            }
        }
    }
    if category:
        query["category"] = category

    results = list(db.resources.find(query))
    for doc in results:
        doc["_id"] = str(doc["_id"])
    return JSONResponse(content=results)


@app.get("/api/stats")
def get_stats():
    pipeline = [
        {"$group": {
            "_id": "$category",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}}
    ]
    by_category = list(db.resources.aggregate(pipeline))
    total = db.resources.count_documents({})
    pending_reports = db.reports.count_documents({"status": "active"})

    return JSONResponse(content={
        "total_resources": total,
        "by_category": by_category,
        "active_reports": pending_reports
    })

@app.post("/api/reports")
async def create_report(report: dict):
    doc = {
        "category": report["category"],       # "food", "shelter", "wifi", "health", "advice"
        "description": report["description"],
        "location": {
            "type": "Point",
            "coordinates": [report["lng"], report["lat"]]
        },
        "address": report.get("address", ""),
        "contact": report.get("contact", ""),
        "createdAt": datetime.utcnow(),
        "expiresAt": datetime.utcnow() + timedelta(hours=report.get("ttl_hours", 4))
    }
    result = db.reports.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Report created"}