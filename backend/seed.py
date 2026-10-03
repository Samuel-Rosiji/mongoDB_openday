from pymongo import MongoClient, GEOSPHERE
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["caremap"]

resources = [
    {
        "name": "Dublin Simon Community",
        "category": "shelter",
        "location": {"type": "Point", "coordinates": [-6.2650, 53.3441]},
        "hours": "24/7",
        "contact": "01 671 5551",
        "description": "Emergency shelter and support services",
        "source": "verified"
    },
    {
        "name": "Merchants Quay Ireland",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.2742, 53.3453]},
        "hours": "Mon-Fri 10am-2pm",
        "contact": "01 524 0139",
        "description": "Day centre, meals, and health services",
        "source": "verified"
    },
    {
        "name": "Capuchin Day Centre",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.2815, 53.3478]},
        "hours": "Mon-Sat 8am-11am",
        "contact": "01 872 4411",
        "description": "Free breakfast and food parcels",
        "source": "verified"
    },
]

# add more real Dublin resources here

db.resources.drop()
db.resources.insert_many(resources)
db.resources.create_index([("location", GEOSPHERE)])

# TTL index for reports
db.reports.drop()
db.reports.create_index("expiresAt", expireAfterSeconds=0)

print(f"Seeded {db.resources.count_documents({})} resources")
print("Indexes created")