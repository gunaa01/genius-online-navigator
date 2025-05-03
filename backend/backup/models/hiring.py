from sqlalchemy import Column, Integer, String, Float, Text, Boolean, ForeignKey, DateTime, Enum, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from ..db import Base
import uuid

class JobStatus(str, PyEnum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    PAUSED = "paused"
    FILLED = "filled"

class ApplicationStatus(str, PyEnum):
    SUBMITTED = "submitted"
    REVIEWED = "reviewed"
    SHORTLISTED = "shortlisted"
    INTERVIEWING = "interviewing"
    OFFERED = "offered"
    HIRED = "hired"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class JobType(str, PyEnum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    TEMPORARY = "temporary"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"
    REMOTE = "remote"

class ExperienceLevel(str, PyEnum):
    ENTRY = "entry"
    JUNIOR = "junior"
    MID_LEVEL = "mid_level"
    SENIOR = "senior"
    LEAD = "lead"
    EXECUTIVE = "executive"

# Association table for job skills
job_skills = Table(
    "job_skills",
    Base.metadata,
    Column("job_id", Integer, ForeignKey("jobs.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)

# Association table for applicant skills
applicant_skills = Table(
    "applicant_skills",
    Base.metadata,
    Column("applicant_id", Integer, ForeignKey("applicant_profiles.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)

# We can reuse the Skill model from for_hire.py

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)  # Supabase user ID
    company_name = Column(String, nullable=False)
    company_description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    company_size = Column(String, nullable=True)
    founded_year = Column(Integer, nullable=True)
    headquarters = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    contact_email = Column(String, nullable=False)
    contact_phone = Column(String, nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    jobs = relationship("Job", back_populates="recruiter")

class ApplicantProfile(Base):
    __tablename__ = "applicant_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)  # Supabase user ID
    full_name = Column(String, nullable=False)
    title = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    experience_years = Column(Integer, default=0)
    education = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    desired_salary = Column(Float, nullable=True)
    desired_job_type = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    skills = relationship("Skill", secondary=applicant_skills, back_populates="applicants")
    applications = relationship("Application", back_populates="applicant")
    work_experiences = relationship("WorkExperience", back_populates="applicant")

class WorkExperience(Base):
    __tablename__ = "work_experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicant_profiles.id"))
    company_name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)  # Null means current job
    description = Column(Text, nullable=True)
    
    # Relationships
    applicant = relationship("ApplicantProfile", back_populates="work_experiences")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    is_remote = Column(Boolean, default=False)
    job_type = Column(String, nullable=False)
    experience_level = Column(String, nullable=False)
    salary_min = Column(Float, nullable=True)
    salary_max = Column(Float, nullable=True)
    status = Column(String, default=JobStatus.OPEN.value)
    is_featured = Column(Boolean, default=False)
    application_deadline = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    
    # Relationships
    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    required_skills = relationship("Skill", secondary=job_skills, back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    applicant_id = Column(Integer, ForeignKey("applicant_profiles.id"))
    cover_letter = Column(Text, nullable=True)
    status = Column(String, default=ApplicationStatus.SUBMITTED.value)
    resume_url = Column(String, nullable=True)  # Can override the one in profile
    expected_salary = Column(Float, nullable=True)
    availability_date = Column(DateTime(timezone=True), nullable=True)
    recruiter_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    applicant = relationship("ApplicantProfile", back_populates="applications")
    messages = relationship("JobMessage", back_populates="application")

class JobMessage(Base):
    __tablename__ = "job_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    sender_id = Column(String, nullable=False)  # Supabase user ID
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    application = relationship("Application", back_populates="messages") 