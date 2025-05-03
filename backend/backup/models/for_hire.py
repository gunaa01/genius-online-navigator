from sqlalchemy import Column, Integer, String, Float, Text, Boolean, ForeignKey, DateTime, Enum, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from ..db import Base
import uuid

class OrderStatus(str, PyEnum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"

class FreelancerLevel(str, PyEnum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERT = "expert"
    TOP_RATED = "top_rated"

# Association table for freelancer skills
freelancer_skills = Table(
    "freelancer_skills",
    Base.metadata,
    Column("freelancer_id", Integer, ForeignKey("freelancer_profiles.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)

# Association table for gig categories
gig_categories = Table(
    "gig_categories",
    Base.metadata,
    Column("gig_id", Integer, ForeignKey("gigs.id")),
    Column("category_id", Integer, ForeignKey("categories.id"))
)

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    freelancers = relationship("FreelancerProfile", secondary=freelancer_skills, back_populates="skills")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    subcategories = relationship("Category", backref="parent", remote_side=[id])
    gigs = relationship("Gig", secondary=gig_categories, back_populates="categories")

class FreelancerProfile(Base):
    __tablename__ = "freelancer_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)  # Supabase user ID
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    hourly_rate = Column(Float, nullable=True)
    level = Column(String, default=FreelancerLevel.BEGINNER.value)
    is_available = Column(Boolean, default=True)
    languages = Column(String, nullable=True)  # Comma-separated list of languages
    education = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)
    experience_years = Column(Integer, default=0)
    location = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)  # URL to profile picture
    avg_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_earnings = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    skills = relationship("Skill", secondary=freelancer_skills, back_populates="freelancers")
    gigs = relationship("Gig", back_populates="freelancer")
    portfolio_items = relationship("PortfolioItem", back_populates="freelancer")
    reviews_received = relationship("Review", back_populates="freelancer")
    
class PortfolioItem(Base):
    __tablename__ = "portfolio_items"
    
    id = Column(Integer, primary_key=True, index=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    project_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    freelancer = relationship("FreelancerProfile", back_populates="portfolio_items")

class Gig(Base):
    __tablename__ = "gigs"
    
    id = Column(Integer, primary_key=True, index=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    delivery_time = Column(Integer, nullable=False)  # In days
    revisions = Column(Integer, default=1)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    freelancer = relationship("FreelancerProfile", back_populates="gigs")
    categories = relationship("Category", secondary=gig_categories, back_populates="gigs")
    orders = relationship("Order", back_populates="gig")
    
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4())[:8].upper())
    gig_id = Column(Integer, ForeignKey("gigs.id"))
    client_id = Column(String, index=True)  # Supabase user ID
    freelancer_id = Column(Integer, ForeignKey("freelancer_profiles.id"))
    status = Column(String, default=OrderStatus.PENDING.value)
    requirements = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    delivery_time = Column(Integer, nullable=False)  # In days
    delivery_date = Column(DateTime(timezone=True), nullable=True)
    is_paid = Column(Boolean, default=False)
    payment_id = Column(String, nullable=True)  # Payment processor ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    gig = relationship("Gig", back_populates="orders")
    messages = relationship("Message", back_populates="order")
    deliverables = relationship("Deliverable", back_populates="order")
    review = relationship("Review", back_populates="order", uselist=False)
    
class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    sender_id = Column(String, nullable=False)  # Supabase user ID
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="messages")
    
class Deliverable(Base):
    __tablename__ = "deliverables"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="deliverables")
    
class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer_profiles.id"))
    client_id = Column(String, nullable=False)  # Supabase user ID
    rating = Column(Integer, nullable=False)  # 1-5 stars
    content = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="review")
    freelancer = relationship("FreelancerProfile", back_populates="reviews_received") 