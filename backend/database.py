from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, DuplicateKeyError
from config import Config
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    """MongoDB Database Handler"""
    
    def __init__(self):
        self.client = None
        self.db = None
        self.connect()
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = MongoClient(Config.MONGO_URI)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[Config.DATABASE_NAME]
            logger.info(f"Connected to MongoDB: {Config.DATABASE_NAME}")
            self._create_indexes()
            self._initialize_sample_data()
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise Exception("Could not connect to MongoDB. Make sure MongoDB is running locally.")
    
    def _create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Users collection indexes
            self.db.users.create_index([("voter_id", ASCENDING)], unique=True)
            self.db.users.create_index([("email", ASCENDING)], unique=True)
            
            # Candidates collection indexes
            self.db.candidates.create_index([("candidate_id", ASCENDING)], unique=True)
            
            # Votes collection indexes
            self.db.votes.create_index([("voter_id", ASCENDING)])
            self.db.votes.create_index([("timestamp", ASCENDING)])
            
            # Parties collection indexes
            self.db.parties.create_index([("party_id", ASCENDING)], unique=True)
            self.db.parties.create_index([("name", ASCENDING)], unique=True)
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")
    
    def _initialize_sample_data(self):
        """Initialize sample parties, candidates and admin if not exists"""
        try:
            # Initialize sample parties if collection is empty
            if self.db.parties.count_documents({}) == 0:
                sample_parties = [
                    {
                        "party_id": "PARTY001",
                        "name": "Progressive Party",
                        "abbreviation": "PP",
                        "color": "#3b82f6",  # Blue
                        "description": "A party focused on progressive reforms, education, and healthcare",
                        "logo_url": "https://via.placeholder.com/150x150?text=PP",
                        "founded_date": "2020-01-15",
                        "created_at": datetime.utcnow()
                    },
                    {
                        "party_id": "PARTY002",
                        "name": "Unity Alliance",
                        "abbreviation": "UA",
                        "color": "#10b981",  # Green
                        "description": "United for environmental protection and economic growth",
                        "logo_url": "https://via.placeholder.com/150x150?text=UA",
                        "founded_date": "2019-03-20",
                        "created_at": datetime.utcnow()
                    },
                    {
                        "party_id": "PARTY003",
                        "name": "Innovation Front",
                        "abbreviation": "IF",
                        "color": "#8b5cf6",  # Purple
                        "description": "Driving digital transformation and technological advancement",
                        "logo_url": "https://via.placeholder.com/150x150?text=IF",
                        "founded_date": "2021-06-10",
                        "created_at": datetime.utcnow()
                    },
                    {
                        "party_id": "PARTY004",
                        "name": "People's Choice",
                        "abbreviation": "PC",
                        "color": "#f59e0b",  # Orange
                        "description": "Champions of social justice and community empowerment",
                        "logo_url": "https://via.placeholder.com/150x150?text=PC",
                        "founded_date": "2018-09-05",
                        "created_at": datetime.utcnow()
                    }
                ]
                self.db.parties.insert_many(sample_parties)
                logger.info("Sample parties initialized")
            
            # Initialize sample candidates if collection is empty
            if self.db.candidates.count_documents({}) == 0:
                sample_candidates = [
                    {
                        "candidate_id": "CAND001",
                        "name": "John Smith",
                        "party_id": "PARTY001",  # Progressive Party
                        "party": "Progressive Party",
                        "description": "Experienced leader with focus on education and healthcare",
                        "image_url": "https://via.placeholder.com/300x300?text=John+Smith",
                        "created_at": datetime.utcnow()
                    },
                    {
                        "candidate_id": "CAND002",
                        "name": "Sarah Johnson",
                        "party_id": "PARTY002",  # Unity Alliance
                        "party": "Unity Alliance",
                        "description": "Advocate for environmental protection and economic growth",
                        "image_url": "https://via.placeholder.com/300x300?text=Sarah+Johnson",
                        "created_at": datetime.utcnow()
                    },
                    {
                        "candidate_id": "CAND003",
                        "name": "Michael Chen",
                        "party_id": "PARTY003",  # Innovation Front
                        "party": "Innovation Front",
                        "description": "Tech entrepreneur focused on digital transformation",
                        "image_url": "https://via.placeholder.com/300x300?text=Michael+Chen",
                        "created_at": datetime.utcnow()
                    },
                    {
                        "candidate_id": "CAND004",
                        "name": "Emily Rodriguez",
                        "party_id": "PARTY004",  # People's Choice
                        "party": "People's Choice",
                        "description": "Social justice advocate and community organizer",
                        "image_url": "https://via.placeholder.com/300x300?text=Emily+Rodriguez",
                        "created_at": datetime.utcnow()
                    }
                ]
                self.db.candidates.insert_many(sample_candidates)
                logger.info("Sample candidates initialized")
            
            # Initialize admin user if not exists
            if self.db.admins.count_documents({}) == 0:
                admin = {
                    "username": Config.ADMIN_USERNAME,
                    "password": Config.ADMIN_PASSWORD,  # In production, use hashed passwords!
                    "role": "admin",
                    "created_at": datetime.utcnow()
                }
                self.db.admins.insert_one(admin)
                logger.info("Admin user initialized")
                
        except Exception as e:
            logger.error(f"Error initializing sample data: {e}")
    
    def get_collection(self, collection_name):
        """Get a MongoDB collection"""
        return self.db[collection_name]
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

# Global database instance
db_instance = Database()

def get_db():
    """Get database instance"""
    return db_instance.db
