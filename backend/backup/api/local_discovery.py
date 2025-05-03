from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from ..db import get_db
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter(prefix="/api/discovery", tags=["local_discovery"])

class BusinessCategory(BaseModel):
    id: int
    name: str
    description: str

class LocalBusiness(BaseModel):
    id: int
    name: str
    description: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    categories: List[str]
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_claimed: bool = False
    hours: Optional[dict] = None

class BusinessSearchResponse(BaseModel):
    businesses: List[LocalBusiness]
    total: int
    page: int
    page_size: int

@router.get("/categories", response_model=List[BusinessCategory])
async def get_business_categories():
    """Get list of business categories."""
    categories = [
        BusinessCategory(id=1, name="Restaurants", description="Places to eat and drink"),
        BusinessCategory(id=2, name="Retail", description="Shops and stores"),
        BusinessCategory(id=3, name="Professional Services", description="Legal, financial, and other professional services"),
        BusinessCategory(id=4, name="Home Services", description="Home repair, cleaning, and maintenance"),
        BusinessCategory(id=5, name="Health & Medical", description="Doctors, dentists, and other healthcare providers"),
        BusinessCategory(id=6, name="Beauty & Spas", description="Hair salons, nail salons, and spas"),
        BusinessCategory(id=7, name="Automotive", description="Car repair, dealerships, and other automotive services"),
        BusinessCategory(id=8, name="Event Services", description="Event planners, venues, and other event services"),
    ]
    return categories

@router.get("/search", response_model=BusinessSearchResponse)
async def search_local_businesses(
    location: str = Query(..., description="City, state, or zip code"),
    query: Optional[str] = Query(None, description="Search term"),
    category_id: Optional[int] = Query(None, description="Category ID"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=50, description="Results per page"),
    db: Session = Depends(get_db)
):
    """
    Search for local businesses by location and optional filters.
    This endpoint would integrate with external APIs like Google Places, Yelp, etc.
    For now, it returns mock data.
    """
    
    # In a real implementation, this would call an external API or search a database
    # For demonstration, returning mock data
    mock_businesses = [
        LocalBusiness(
            id=1,
            name="Local Coffee Shop",
            description="Cozy coffee shop with fresh pastries",
            address="123 Main St",
            city="Austin",
            state="TX",
            zip_code="78701",
            phone="(555) 123-4567",
            website="https://example.com/coffee",
            email="info@localcoffee.com",
            categories=["Coffee & Tea", "Bakeries"],
            rating=4.7,
            reviews_count=203,
            image_url="https://example.com/images/coffee.jpg",
            latitude=30.2672,
            longitude=-97.7431,
            is_claimed=True,
            hours={"Monday": "7:00 AM - 8:00 PM", "Tuesday": "7:00 AM - 8:00 PM"}
        ),
        LocalBusiness(
            id=2,
            name="Downtown Pharmacy",
            description="Full-service pharmacy with delivery options",
            address="456 Oak St",
            city="Austin",
            state="TX",
            zip_code="78701",
            phone="(555) 987-6543",
            website="https://example.com/pharmacy",
            email="info@downtownpharmacy.com",
            categories=["Pharmacy", "Health & Medical"],
            rating=4.2,
            reviews_count=87,
            image_url="https://example.com/images/pharmacy.jpg",
            latitude=30.2674,
            longitude=-97.7429,
            is_claimed=True,
            hours={"Monday": "8:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM"}
        ),
    ]
    
    total_results = len(mock_businesses)
    
    return BusinessSearchResponse(
        businesses=mock_businesses,
        total=total_results,
        page=page,
        page_size=page_size
    )

@router.get("/business/{business_id}", response_model=LocalBusiness)
async def get_business_details(business_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a specific business."""
    # In a real implementation, this would fetch from a database or external API
    # For demonstration, returning mock data
    
    if business_id == 1:
        return LocalBusiness(
            id=1,
            name="Local Coffee Shop",
            description="Cozy coffee shop with fresh pastries and a wide selection of specialty drinks. We source our beans from local roasters and offer a variety of brewing methods.",
            address="123 Main St",
            city="Austin",
            state="TX",
            zip_code="78701",
            phone="(555) 123-4567",
            website="https://example.com/coffee",
            email="info@localcoffee.com",
            categories=["Coffee & Tea", "Bakeries"],
            rating=4.7,
            reviews_count=203,
            image_url="https://example.com/images/coffee.jpg",
            latitude=30.2672,
            longitude=-97.7431,
            is_claimed=True,
            hours={
                "Monday": "7:00 AM - 8:00 PM",
                "Tuesday": "7:00 AM - 8:00 PM",
                "Wednesday": "7:00 AM - 8:00 PM",
                "Thursday": "7:00 AM - 9:00 PM",
                "Friday": "7:00 AM - 9:00 PM",
                "Saturday": "8:00 AM - 9:00 PM",
                "Sunday": "8:00 AM - 7:00 PM"
            }
        )
    else:
        raise HTTPException(status_code=404, detail="Business not found") 