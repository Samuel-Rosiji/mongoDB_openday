from pymongo import MongoClient, GEOSPHERE
import os
from dotenv import load_dotenv
import certifi
load_dotenv()

client =  MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
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
        "location": {"type": "Point", "coordinates": [-6.2758798599243, 53.349300384521]},
        "hours": "Mon-Sat 07:30-15:00",
        "contact": "01 872 0770",
        "description": "Breakfast, lunch and food parcels for people experiencing homelessness or food poverty",
        "source": "verified"
    },

    {
        "name": "Capuchin Day Centre Showers",
        "category": "hygiene",
        "location": {"type": "Point", "coordinates": [-6.2758798599243, 53.349300384521]},
        "hours": "Mon-Sat",
        "contact": "01 872 0770",
        "description": "Showers, clothing and hygiene support",
        "source": "verified"
    },

    {
        "name": "Capuchin Day Centre Support",
        "category": "social",
        "location": {"type": "Point", "coordinates": [-6.2758798599243, 53.349300384521]},
        "hours": "Mon-Sat",
        "contact": "01 872 0770",
        "description": "Medical, family and homelessness support services",
        "source": "verified"
    },

    {
        "name": "Mendicity Institution",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.2821415, 53.3456647]},
        "hours": "Mon-Fri 08:30-22:30, Sun 09:30-14:30 and 17:30-22:30",
        "contact": "01 677 3308",
        "description": "Free meals and daytime support for people experiencing homelessness",
        "source": "verified"
    },

    {
        "name": "Mendicity Institution Showers",
        "category": "hygiene",
        "location": {"type": "Point", "coordinates": [-6.2821415, 53.3456647]},
        "hours": "Mon-Fri 08:30-22:30, Sun 09:30-14:30 and 17:30-22:30",
        "contact": "01 677 3308",
        "description": "Showers, laundry, toiletries and clean clothing",
        "source": "verified"
    },

    {
        "name": "Mendicity WiFi and Charging",
        "category": "wifi",
        "location": {"type": "Point", "coordinates": [-6.2821415, 53.3456647]},
        "hours": "Mon-Fri 08:30-22:30, Sun 09:30-14:30 and 17:30-22:30",
        "contact": "01 677 3308",
        "description": "Wi-Fi and phone charging facilities",
        "source": "verified"
    },

    {
        "name": "Little Flower Penny Dinners",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.27933788299561, 53.3419876098633]},
        "hours": "Mon-Fri 12:00",
        "contact": "01 453 6621",
        "description": "Warm meals for people in need",
        "source": "verified"
    },

    {
        "name": "Crosscare Community Cafe Dublin 1",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.2482399940491, 53.356231689453]},
        "hours": "Mon-Fri from 08:00",
        "contact": "01 855 5577",
        "description": "Affordable meals and food poverty support",
        "source": "verified"
    },

    {
        "name": "Crosscare Food Support Portland Row",
        "category": "social",
        "location": {"type": "Point", "coordinates": [-6.2482399940491, 53.356231689453]},
        "hours": "Mon-Fri",
        "contact": "01 891 3022",
        "description": "Emergency food provision and food poverty support",
        "source": "verified"
    },

    {
        "name": "Dublin Region Homeless Executive Central Placement Service",
        "category": "shelter",
        "location": {"type": "Point", "coordinates": [-6.2958258, 53.3479928]},
        "hours": "Mon-Fri 10:00-12:00 and 14:00-16:00",
        "contact": "1800 707 707",
        "description": "Assessment and access point for emergency homeless accommodation",
        "source": "verified"
    },

    {
        "name": "Dublin Region Homeless Executive Support",
        "category": "social",
        "location": {"type": "Point", "coordinates": [-6.2958258, 53.3479928]},
        "hours": "Mon-Fri 10:00-12:00 and 14:00-16:00",
        "contact": "1800 707 707",
        "description": "Homelessness assessment, information and accommodation support",
        "source": "verified"
    },

    {
        "name": "Focus Ireland Coffee Shop",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.2646386, 53.3452411]},
        "hours": "Open daily",
        "contact": "01 671 2555",
        "description": "Food, coffee, advice and support for people experiencing homelessness",
        "source": "verified"
    },

    {
        "name": "Focus Ireland Coffee Shop Support",
        "category": "social",
        "location": {"type": "Point", "coordinates": [-6.2646386, 53.3452411]},
        "hours": "Open daily",
        "contact": "01 671 2555",
        "description": "Advice and information on housing, welfare and homelessness",
        "source": "verified"
    },

    {
        "name": "Sophia Housing Association",
        "category": "social",
        "location": {"type": "Point", "coordinates": [-6.28196477890015, 53.3375358581543]},
        "hours": "Mon-Fri 09:00-17:00",
        "contact": "01 473 8300",
        "description": "Housing and support services for people who have experienced homelessness",
        "source": "verified"
    },

    {
        "name": "The Iveagh Hostel",
        "category": "shelter",
        "location": {"type": "Point", "coordinates": [-6.2707, 53.3415]},
        "hours": "24/7",
        "contact": "01 454 0182",
        "description": "Homeless accommodation with meals, bathrooms, laundry and internet access",
        "source": "verified"
    },

    {
        "name": "Cedar House Crosscare Homeless Shelter",
        "category": "shelter",
        "location": {"type": "Point", "coordinates": [-6.2559, 53.3544]},
        "hours": "Contact service for availability",
        "contact": "01 552 3111",
        "description": "Emergency homeless accommodation and support services",
        "source": "verified"
    },

    {
        "name": "Back Lane Night Shelter",
        "category": "shelter",
        "location": {"type": "Point", "coordinates": [-6.2719, 53.3422]},
        "hours": "Contact service for availability",
        "contact": "01 454 2181",
        "description": "Short-term accommodation for adults experiencing homelessness",
        "source": "verified"
    },

    {
        "name": "The Morning Star",
        "category": "shelter",
        "location": {"type": "Point", "coordinates": [-6.2788, 53.3498]},
        "hours": "Contact service for availability",
        "contact": "",
        "description": "Homeless accommodation service in the Smithfield area",
        "source": "verified"
    },

    {
        "name": "The Lighthouse Homeless Café",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.2530, 53.3440]},
        "hours": "Varies by day",
        "contact": "089 707 8166",
        "description": "Food and support service for people experiencing homelessness",
        "source": "verified"
    },

    {
        "name": "Feed Our Homeless",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.3050, 53.3930]},
        "hours": "Varies by day",
        "contact": "01 864 4990",
        "description": "Food assistance and homeless support services",
        "source": "verified"
    },

    {
        "name": "FoodCloud",
        "category": "food",
        "location": {"type": "Point", "coordinates": [-6.3580, 53.3010]},
        "hours": "Mon-Thu 08:30-16:00, Fri 08:30-15:00",
        "contact": "01 531 3478",
        "description": "Redistributes surplus food to charities and community organisations",
        "source": "verified"
    },

    {
        "name": "Focus Ireland Family Centre",
        "category": "social",
        "location": {"type": "Point", "coordinates": [-6.2668, 53.3581]},
        "hours": "Mon-Thu 09:00-17:00, Fri 09:00-16:00",
        "contact": "01 539 2400",
        "description": "Advice and homelessness support for families",
        "source": "verified"
    },

    {
        "name": "Phibsborough Library",
        "category": "wifi",
        "location": {"type": "Point", "coordinates": [-6.2736, 53.3596]},
        "hours": "Varies by day",
        "contact": "01 222 8333",
        "description": "Public indoor space with Wi-Fi and internet access",
        "source": "verified"
    },
    {
        "name": "Drumcondra Library",
        "category": "wifi",
        "location": {"type": "Point", "coordinates": [-6.2596, 53.3698]},
        "hours": "Varies by day",
        "contact": "01 222 8344",
        "description": "Public library with Wi-Fi and indoor facilities",
        "source": "verified"
    },

    {
        "name": "Ringsend Library",
        "category": "wifi",
        "location": {"type": "Point", "coordinates": [-6.2266, 53.3413]},
        "hours": "Varies by day",
        "contact": "01 222 8499",
        "description": "Public library with Wi-Fi and indoor facilities",
        "source": "verified"
    }
]

# Seed resources
db.resources.drop()
db.resources.insert_many(resources)
db.resources.create_index([("location", GEOSPHERE)])

# Prepare reports collection
db.reports.drop()
db.reports.create_index([("location", GEOSPHERE)])
db.reports.create_index("expiresAt", expireAfterSeconds=7200)

print(f"Seeded {db.resources.count_documents({})} resources")
print("Indexes created")