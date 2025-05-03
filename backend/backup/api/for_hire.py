from fastapi import APIRouter, Depends, HTTPException, Query, Body, Path, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
from ..db import get_db
from ..models.for_hire import (
    Skill, 
    Category, 
    FreelancerProfile, 
    PortfolioItem, 
    Gig, 
    Order, 
    Message, 
    Deliverable, 
    Review,
    OrderStatus,
    FreelancerLevel,
)
from datetime import datetime

router = APIRouter(prefix="/api/for-hire", tags=["for_hire"])

# =====================
# Pydantic Models
# =====================

class SkillBase(BaseModel):
    name: str
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    
    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    
    class Config:
        orm_mode = True

class PortfolioItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    project_url: Optional[str] = None

class PortfolioItemCreate(PortfolioItemBase):
    pass

class PortfolioItemResponse(PortfolioItemBase):
    id: int
    freelancer_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class FreelancerProfileBase(BaseModel):
    title: str
    description: str
    hourly_rate: Optional[float] = None
    level: Optional[str] = FreelancerLevel.BEGINNER.value
    is_available: bool = True
    languages: Optional[str] = None
    education: Optional[str] = None
    certifications: Optional[str] = None
    experience_years: int = 0
    location: Optional[str] = None
    profile_picture: Optional[str] = None

class FreelancerProfileCreate(FreelancerProfileBase):
    user_id: str
    skill_ids: List[int] = []

class FreelancerProfileUpdate(FreelancerProfileBase):
    skill_ids: Optional[List[int]] = None

class FreelancerProfileResponse(FreelancerProfileBase):
    id: int
    user_id: str
    avg_rating: float
    total_reviews: int
    total_earnings: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List[SkillResponse] = []
    portfolio_items: List[PortfolioItemResponse] = []
    
    class Config:
        orm_mode = True

class GigBase(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    price: float
    delivery_time: int
    revisions: int = 1
    is_featured: bool = False
    is_active: bool = True

class GigCreate(GigBase):
    category_ids: List[int]

class GigUpdate(GigBase):
    category_ids: Optional[List[int]] = None

class GigResponse(GigBase):
    id: int
    freelancer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    categories: List[CategoryResponse] = []
    freelancer: Optional[FreelancerProfileResponse] = None
    
    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    requirements: Optional[str] = None
    price: float
    delivery_time: int

class OrderCreate(OrderBase):
    gig_id: int
    client_id: str

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    is_paid: Optional[bool] = None
    delivery_date: Optional[datetime] = None

class OrderResponse(OrderBase):
    id: int
    order_number: str
    gig_id: int
    client_id: str
    freelancer_id: int
    status: str
    is_paid: bool
    payment_id: Optional[str] = None
    delivery_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    gig: Optional[GigResponse] = None
    
    class Config:
        orm_mode = True

class MessageBase(BaseModel):
    content: str
    attachment_url: Optional[str] = None

class MessageCreate(MessageBase):
    order_id: int
    sender_id: str

class MessageResponse(MessageBase):
    id: int
    order_id: int
    sender_id: str
    is_read: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

class DeliverableBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_url: Optional[str] = None

class DeliverableCreate(DeliverableBase):
    order_id: int

class DeliverableResponse(DeliverableBase):
    id: int
    order_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class ReviewBase(BaseModel):
    rating: int
    content: Optional[str] = None

class ReviewCreate(ReviewBase):
    order_id: int
    client_id: str

class ReviewResponse(ReviewBase):
    id: int
    order_id: int
    freelancer_id: int
    client_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# =====================
# API Endpoints
# =====================

# Skills

@router.get("/skills", response_model=List[SkillResponse])
async def get_skills(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
):
    """Get all skills or search by name."""
    query = db.query(Skill)
    if search:
        query = query.filter(Skill.name.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()

@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
):
    """Create a new skill."""
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

# Categories

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(
    db: Session = Depends(get_db),
    parent_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
):
    """Get all categories or filter by parent_id."""
    query = db.query(Category)
    if parent_id is not None:
        query = query.filter(Category.parent_id == parent_id)
    return query.offset(skip).limit(limit).all()

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
):
    """Create a new category."""
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# Freelancer Profiles

@router.get("/freelancers", response_model=List[FreelancerProfileResponse])
async def get_freelancers(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    skill_id: Optional[int] = None,
    min_rating: Optional[float] = None,
    level: Optional[str] = None,
    is_available: Optional[bool] = None,
    skip: int = 0,
    limit: int = 20,
):
    """Get all freelancers with optional filtering."""
    query = db.query(FreelancerProfile)
    
    if search:
        query = query.filter(
            (FreelancerProfile.title.ilike(f"%{search}%")) | 
            (FreelancerProfile.description.ilike(f"%{search}%"))
        )
    
    if skill_id:
        query = query.join(FreelancerProfile.skills).filter(Skill.id == skill_id)
        
    if min_rating is not None:
        query = query.filter(FreelancerProfile.avg_rating >= min_rating)
        
    if level:
        query = query.filter(FreelancerProfile.level == level)
        
    if is_available is not None:
        query = query.filter(FreelancerProfile.is_available == is_available)
    
    return query.offset(skip).limit(limit).all()

@router.get("/freelancers/{freelancer_id}", response_model=FreelancerProfileResponse)
async def get_freelancer(
    freelancer_id: int = Path(...),
    db: Session = Depends(get_db),
):
    """Get a specific freelancer by ID."""
    freelancer = db.query(FreelancerProfile).filter(FreelancerProfile.id == freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    return freelancer

@router.get("/freelancers/user/{user_id}", response_model=FreelancerProfileResponse)
async def get_freelancer_by_user_id(
    user_id: str = Path(...),
    db: Session = Depends(get_db),
):
    """Get a freelancer by user ID."""
    freelancer = db.query(FreelancerProfile).filter(FreelancerProfile.user_id == user_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    return freelancer

@router.post("/freelancers", response_model=FreelancerProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_freelancer(
    freelancer: FreelancerProfileCreate,
    db: Session = Depends(get_db),
):
    """Create a new freelancer profile."""
    # Check if a profile already exists for this user
    existing = db.query(FreelancerProfile).filter(FreelancerProfile.user_id == freelancer.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Freelancer profile already exists for this user")
    
    # Extract skill_ids and create the profile
    skill_ids = freelancer.skill_ids
    freelancer_data = freelancer.dict(exclude={"skill_ids"})
    
    db_freelancer = FreelancerProfile(**freelancer_data)
    
    # Add skills
    if skill_ids:
        skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
        if len(skills) != len(skill_ids):
            raise HTTPException(status_code=400, detail="Some skill IDs are invalid")
        db_freelancer.skills = skills
    
    db.add(db_freelancer)
    db.commit()
    db.refresh(db_freelancer)
    return db_freelancer

@router.put("/freelancers/{freelancer_id}", response_model=FreelancerProfileResponse)
async def update_freelancer(
    freelancer_id: int,
    freelancer: FreelancerProfileUpdate,
    db: Session = Depends(get_db),
):
    """Update a freelancer profile."""
    db_freelancer = db.query(FreelancerProfile).filter(FreelancerProfile.id == freelancer_id).first()
    if not db_freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    
    # Update fields
    update_data = freelancer.dict(exclude={"skill_ids"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_freelancer, key, value)
    
    # Update skills if provided
    if freelancer.skill_ids is not None:
        skills = db.query(Skill).filter(Skill.id.in_(freelancer.skill_ids)).all()
        if len(skills) != len(freelancer.skill_ids):
            raise HTTPException(status_code=400, detail="Some skill IDs are invalid")
        db_freelancer.skills = skills
    
    db.commit()
    db.refresh(db_freelancer)
    return db_freelancer

# Portfolio Items

@router.get("/portfolio-items/{freelancer_id}", response_model=List[PortfolioItemResponse])
async def get_portfolio_items(
    freelancer_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Get portfolio items for a freelancer."""
    items = db.query(PortfolioItem).filter(
        PortfolioItem.freelancer_id == freelancer_id
    ).offset(skip).limit(limit).all()
    return items

@router.post("/portfolio-items", response_model=PortfolioItemResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio_item(
    item: PortfolioItemCreate,
    freelancer_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """Create a new portfolio item for a freelancer."""
    # Check if the freelancer exists
    freelancer = db.query(FreelancerProfile).filter(FreelancerProfile.id == freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    
    db_item = PortfolioItem(**item.dict(), freelancer_id=freelancer_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# Gigs

@router.get("/gigs", response_model=List[GigResponse])
async def get_gigs(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    freelancer_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    max_delivery_time: Optional[int] = None,
    is_featured: Optional[bool] = None,
    is_active: Optional[bool] = True,
    skip: int = 0,
    limit: int = 20,
):
    """Get all gigs with optional filtering."""
    query = db.query(Gig)
    
    if search:
        query = query.filter(
            (Gig.title.ilike(f"%{search}%")) | 
            (Gig.description.ilike(f"%{search}%"))
        )
    
    if category_id:
        query = query.join(Gig.categories).filter(Category.id == category_id)
        
    if freelancer_id:
        query = query.filter(Gig.freelancer_id == freelancer_id)
        
    if min_price is not None:
        query = query.filter(Gig.price >= min_price)
        
    if max_price is not None:
        query = query.filter(Gig.price <= max_price)
        
    if max_delivery_time is not None:
        query = query.filter(Gig.delivery_time <= max_delivery_time)
        
    if is_featured is not None:
        query = query.filter(Gig.is_featured == is_featured)
        
    if is_active is not None:
        query = query.filter(Gig.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()

@router.get("/gigs/{gig_id}", response_model=GigResponse)
async def get_gig(
    gig_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific gig by ID."""
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    return gig

@router.post("/gigs", response_model=GigResponse, status_code=status.HTTP_201_CREATED)
async def create_gig(
    gig: GigCreate,
    freelancer_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """Create a new gig."""
    # Check if the freelancer exists
    freelancer = db.query(FreelancerProfile).filter(FreelancerProfile.id == freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    
    # Extract category_ids and create the gig
    category_ids = gig.category_ids
    gig_data = gig.dict(exclude={"category_ids"})
    
    db_gig = Gig(**gig_data, freelancer_id=freelancer_id)
    
    # Add categories
    categories = db.query(Category).filter(Category.id.in_(category_ids)).all()
    if len(categories) != len(category_ids):
        raise HTTPException(status_code=400, detail="Some category IDs are invalid")
    db_gig.categories = categories
    
    db.add(db_gig)
    db.commit()
    db.refresh(db_gig)
    return db_gig

@router.put("/gigs/{gig_id}", response_model=GigResponse)
async def update_gig(
    gig_id: int,
    gig: GigUpdate,
    db: Session = Depends(get_db),
):
    """Update a gig."""
    db_gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not db_gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    
    # Update fields
    update_data = gig.dict(exclude={"category_ids"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_gig, key, value)
    
    # Update categories if provided
    if gig.category_ids is not None:
        categories = db.query(Category).filter(Category.id.in_(gig.category_ids)).all()
        if len(categories) != len(gig.category_ids):
            raise HTTPException(status_code=400, detail="Some category IDs are invalid")
        db_gig.categories = categories
    
    db.commit()
    db.refresh(db_gig)
    return db_gig

# Orders

@router.get("/orders", response_model=List[OrderResponse])
async def get_orders(
    db: Session = Depends(get_db),
    client_id: Optional[str] = None,
    freelancer_id: Optional[int] = None,
    status: Optional[str] = None,
    is_paid: Optional[bool] = None,
    skip: int = 0,
    limit: int = 20,
):
    """Get orders with optional filtering."""
    query = db.query(Order)
    
    if client_id:
        query = query.filter(Order.client_id == client_id)
        
    if freelancer_id:
        query = query.filter(Order.freelancer_id == freelancer_id)
        
    if status:
        query = query.filter(Order.status == status)
        
    if is_paid is not None:
        query = query.filter(Order.is_paid == is_paid)
    
    return query.offset(skip).limit(limit).all()

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific order by ID."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
):
    """Create a new order."""
    # Check if the gig exists
    gig = db.query(Gig).filter(Gig.id == order.gig_id).first()
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    
    db_order = Order(
        **order.dict(),
        freelancer_id=gig.freelancer_id,
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.put("/orders/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order: OrderUpdate,
    db: Session = Depends(get_db),
):
    """Update an order's status, payment status, or delivery date."""
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Validate status if provided
    if order.status and order.status not in [s.value for s in OrderStatus]:
        raise HTTPException(status_code=400, detail=f"Invalid status. Valid values are: {', '.join([s.value for s in OrderStatus])}")
    
    # Update fields
    update_data = order.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order, key, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

# Messages

@router.get("/messages/{order_id}", response_model=List[MessageResponse])
async def get_messages(
    order_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Get messages for an order."""
    # Check if the order exists
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    messages = db.query(Message).filter(
        Message.order_id == order_id
    ).order_by(Message.created_at).offset(skip).limit(limit).all()
    
    return messages

@router.post("/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
):
    """Create a new message for an order."""
    # Check if the order exists
    order = db.query(Order).filter(Order.id == message.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_message = Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# Deliverables

@router.get("/deliverables/{order_id}", response_model=List[DeliverableResponse])
async def get_deliverables(
    order_id: int,
    db: Session = Depends(get_db),
):
    """Get deliverables for an order."""
    # Check if the order exists
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    deliverables = db.query(Deliverable).filter(
        Deliverable.order_id == order_id
    ).all()
    
    return deliverables

@router.post("/deliverables", response_model=DeliverableResponse, status_code=status.HTTP_201_CREATED)
async def create_deliverable(
    deliverable: DeliverableCreate,
    db: Session = Depends(get_db),
):
    """Create a new deliverable for an order."""
    # Check if the order exists
    order = db.query(Order).filter(Order.id == deliverable.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_deliverable = Deliverable(**deliverable.dict())
    db.add(db_deliverable)
    db.commit()
    db.refresh(db_deliverable)
    return db_deliverable

# Reviews

@router.get("/reviews/freelancer/{freelancer_id}", response_model=List[ReviewResponse])
async def get_freelancer_reviews(
    freelancer_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
):
    """Get reviews for a freelancer."""
    reviews = db.query(Review).filter(
        Review.freelancer_id == freelancer_id
    ).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    return reviews

@router.get("/reviews/order/{order_id}", response_model=ReviewResponse)
async def get_order_review(
    order_id: int,
    db: Session = Depends(get_db),
):
    """Get the review for a specific order."""
    review = db.query(Review).filter(Review.order_id == order_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
):
    """Create a new review for an order."""
    # Check if the order exists and is completed
    order = db.query(Order).filter(Order.id == review.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status != OrderStatus.COMPLETED.value:
        raise HTTPException(status_code=400, detail="Can only review completed orders")
    
    # Check if a review already exists for this order
    existing_review = db.query(Review).filter(Review.order_id == review.order_id).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="Review already exists for this order")
    
    # Validate rating
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Create review
    db_review = Review(
        **review.dict(),
        freelancer_id=order.freelancer_id,
    )
    
    db.add(db_review)
    
    # Update freelancer's ratings
    freelancer = db.query(FreelancerProfile).filter(FreelancerProfile.id == order.freelancer_id).first()
    if freelancer:
        total_reviews = freelancer.total_reviews + 1
        avg_rating = (freelancer.avg_rating * freelancer.total_reviews + review.rating) / total_reviews
        
        freelancer.total_reviews = total_reviews
        freelancer.avg_rating = avg_rating
    
    db.commit()
    db.refresh(db_review)
    return db_review
