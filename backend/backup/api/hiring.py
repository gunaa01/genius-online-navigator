from fastapi import APIRouter, Depends, HTTPException, Query, Body, Path, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
from ..db import get_db
from ..models.hiring import (
    RecruiterProfile,
    ApplicantProfile,
    WorkExperience,
    Job,
    Application,
    JobMessage,
    JobStatus,
    ApplicationStatus,
    JobType,
    ExperienceLevel,
    job_skills,
    applicant_skills
)
from ..models.for_hire import Skill
from datetime import datetime

router = APIRouter(prefix="/api/hiring", tags=["hiring"])

# =====================
# Pydantic Models
# =====================

class SkillBase(BaseModel):
    name: str
    description: Optional[str] = None

class SkillResponse(SkillBase):
    id: int
    
    class Config:
        orm_mode = True

class WorkExperienceBase(BaseModel):
    company_name: str
    position: str
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = None

class WorkExperienceCreate(WorkExperienceBase):
    pass

class WorkExperienceResponse(WorkExperienceBase):
    id: int
    applicant_id: int
    
    class Config:
        orm_mode = True

class RecruiterProfileBase(BaseModel):
    company_name: str
    company_description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    founded_year: Optional[int] = None
    headquarters: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: str
    contact_phone: Optional[str] = None

class RecruiterProfileCreate(RecruiterProfileBase):
    user_id: str

class RecruiterProfileUpdate(RecruiterProfileBase):
    pass

class RecruiterProfileResponse(RecruiterProfileBase):
    id: int
    user_id: str
    verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ApplicantProfileBase(BaseModel):
    full_name: str
    title: Optional[str] = None
    summary: Optional[str] = None
    experience_years: int = 0
    education: Optional[str] = None
    certifications: Optional[str] = None
    location: Optional[str] = None
    resume_url: Optional[str] = None
    profile_picture: Optional[str] = None
    is_available: bool = True
    desired_salary: Optional[float] = None
    desired_job_type: Optional[str] = None

class ApplicantProfileCreate(ApplicantProfileBase):
    user_id: str
    skill_ids: List[int] = []

class ApplicantProfileUpdate(ApplicantProfileBase):
    skill_ids: Optional[List[int]] = None

class ApplicantProfileResponse(ApplicantProfileBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List[SkillResponse] = []
    work_experiences: List[WorkExperienceResponse] = []
    
    class Config:
        orm_mode = True

class JobBase(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool = False
    job_type: str
    experience_level: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    application_deadline: Optional[datetime] = None

class JobCreate(JobBase):
    skill_ids: List[int] = []

class JobUpdate(JobBase):
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    skill_ids: Optional[List[int]] = None

class JobResponse(JobBase):
    id: int
    recruiter_id: int
    status: str
    is_featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    views_count: int
    applications_count: int
    required_skills: List[SkillResponse] = []
    recruiter: Optional[RecruiterProfileResponse] = None
    
    class Config:
        orm_mode = True

class ApplicationBase(BaseModel):
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    expected_salary: Optional[float] = None
    availability_date: Optional[datetime] = None

class ApplicationCreate(ApplicationBase):
    job_id: int

class ApplicationUpdate(BaseModel):
    status: str
    recruiter_notes: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: int
    job_id: int
    applicant_id: int
    status: str
    recruiter_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    job: Optional[JobResponse] = None
    applicant: Optional[ApplicantProfileResponse] = None
    
    class Config:
        orm_mode = True

class JobMessageBase(BaseModel):
    content: str
    attachment_url: Optional[str] = None

class JobMessageCreate(JobMessageBase):
    application_id: int
    sender_id: str

class JobMessageResponse(JobMessageBase):
    id: int
    application_id: int
    sender_id: str
    is_read: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# =====================
# API Endpoints
# =====================

# Skills are reused from the for_hire module

# Recruiter Profiles

@router.get("/recruiters", response_model=List[RecruiterProfileResponse])
async def get_recruiters(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    industry: Optional[str] = None,
    verified: Optional[bool] = None,
    skip: int = 0,
    limit: int = 20,
):
    """Get all recruiters with optional filtering."""
    query = db.query(RecruiterProfile)
    
    if search:
        query = query.filter(
            (RecruiterProfile.company_name.ilike(f"%{search}%")) | 
            (RecruiterProfile.company_description.ilike(f"%{search}%"))
        )
    
    if industry:
        query = query.filter(RecruiterProfile.industry == industry)
        
    if verified is not None:
        query = query.filter(RecruiterProfile.verified == verified)
    
    return query.offset(skip).limit(limit).all()

@router.get("/recruiters/{recruiter_id}", response_model=RecruiterProfileResponse)
async def get_recruiter(
    recruiter_id: int = Path(...),
    db: Session = Depends(get_db),
):
    """Get a specific recruiter by ID."""
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return recruiter

@router.get("/recruiters/user/{user_id}", response_model=RecruiterProfileResponse)
async def get_recruiter_by_user_id(
    user_id: str = Path(...),
    db: Session = Depends(get_db),
):
    """Get a recruiter by user ID."""
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    return recruiter

@router.post("/recruiters", response_model=RecruiterProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_recruiter(
    recruiter: RecruiterProfileCreate,
    db: Session = Depends(get_db),
):
    """Create a new recruiter profile."""
    # Check if a profile already exists for this user
    existing = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == recruiter.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Recruiter profile already exists for this user")
    
    db_recruiter = RecruiterProfile(**recruiter.dict())
    db.add(db_recruiter)
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

@router.put("/recruiters/{recruiter_id}", response_model=RecruiterProfileResponse)
async def update_recruiter(
    recruiter_id: int,
    recruiter: RecruiterProfileUpdate,
    db: Session = Depends(get_db),
):
    """Update a recruiter profile."""
    db_recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.id == recruiter_id).first()
    if not db_recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    
    # Update fields
    update_data = recruiter.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_recruiter, key, value)
    
    db.commit()
    db.refresh(db_recruiter)
    return db_recruiter

# Applicant Profiles

@router.get("/applicants", response_model=List[ApplicantProfileResponse])
async def get_applicants(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    skill_id: Optional[int] = None,
    min_experience: Optional[int] = None,
    location: Optional[str] = None,
    is_available: Optional[bool] = None,
    desired_job_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
):
    """Get all applicants with optional filtering."""
    query = db.query(ApplicantProfile)
    
    if search:
        query = query.filter(
            (ApplicantProfile.full_name.ilike(f"%{search}%")) | 
            (ApplicantProfile.title.ilike(f"%{search}%")) |
            (ApplicantProfile.summary.ilike(f"%{search}%"))
        )
    
    if skill_id:
        query = query.join(ApplicantProfile.skills).filter(Skill.id == skill_id)
        
    if min_experience is not None:
        query = query.filter(ApplicantProfile.experience_years >= min_experience)
        
    if location:
        query = query.filter(ApplicantProfile.location.ilike(f"%{location}%"))
        
    if is_available is not None:
        query = query.filter(ApplicantProfile.is_available == is_available)
        
    if desired_job_type:
        query = query.filter(ApplicantProfile.desired_job_type == desired_job_type)
    
    return query.offset(skip).limit(limit).all()

@router.get("/applicants/{applicant_id}", response_model=ApplicantProfileResponse)
async def get_applicant(
    applicant_id: int = Path(...),
    db: Session = Depends(get_db),
):
    """Get a specific applicant by ID."""
    applicant = db.query(ApplicantProfile).filter(ApplicantProfile.id == applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return applicant

@router.get("/applicants/user/{user_id}", response_model=ApplicantProfileResponse)
async def get_applicant_by_user_id(
    user_id: str = Path(...),
    db: Session = Depends(get_db),
):
    """Get an applicant by user ID."""
    applicant = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == user_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return applicant

@router.post("/applicants", response_model=ApplicantProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_applicant(
    applicant: ApplicantProfileCreate,
    db: Session = Depends(get_db),
):
    """Create a new applicant profile."""
    # Check if a profile already exists for this user
    existing = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == applicant.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Applicant profile already exists for this user")
    
    # Extract skill_ids and create the profile
    skill_ids = applicant.skill_ids
    applicant_data = applicant.dict(exclude={"skill_ids"})
    
    db_applicant = ApplicantProfile(**applicant_data)
    
    # Add skills
    if skill_ids:
        skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
        if len(skills) != len(skill_ids):
            raise HTTPException(status_code=400, detail="Some skill IDs are invalid")
        db_applicant.skills = skills
    
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

@router.put("/applicants/{applicant_id}", response_model=ApplicantProfileResponse)
async def update_applicant(
    applicant_id: int,
    applicant: ApplicantProfileUpdate,
    db: Session = Depends(get_db),
):
    """Update an applicant profile."""
    db_applicant = db.query(ApplicantProfile).filter(ApplicantProfile.id == applicant_id).first()
    if not db_applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Update fields
    update_data = applicant.dict(exclude={"skill_ids"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_applicant, key, value)
    
    # Update skills if provided
    if applicant.skill_ids is not None:
        skills = db.query(Skill).filter(Skill.id.in_(applicant.skill_ids)).all()
        if len(skills) != len(applicant.skill_ids):
            raise HTTPException(status_code=400, detail="Some skill IDs are invalid")
        db_applicant.skills = skills
    
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

# Work Experience

@router.get("/work-experience/{applicant_id}", response_model=List[WorkExperienceResponse])
async def get_work_experiences(
    applicant_id: int,
    db: Session = Depends(get_db),
):
    """Get work experiences for an applicant."""
    experiences = db.query(WorkExperience).filter(
        WorkExperience.applicant_id == applicant_id
    ).order_by(WorkExperience.start_date.desc()).all()
    return experiences

@router.post("/work-experience", response_model=WorkExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_work_experience(
    experience: WorkExperienceCreate,
    applicant_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """Create a new work experience for an applicant."""
    # Check if the applicant exists
    applicant = db.query(ApplicantProfile).filter(ApplicantProfile.id == applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    db_experience = WorkExperience(**experience.dict(), applicant_id=applicant_id)
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

# Jobs

@router.get("/jobs", response_model=List[JobResponse])
async def get_jobs(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    recruiter_id: Optional[int] = None,
    location: Optional[str] = None,
    is_remote: Optional[bool] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    min_salary: Optional[float] = None,
    skill_id: Optional[int] = None,
    status: Optional[str] = JobStatus.OPEN.value,
    is_featured: Optional[bool] = None,
    skip: int = 0,
    limit: int = 20,
):
    """Get all jobs with optional filtering."""
    query = db.query(Job)
    
    if search:
        query = query.filter(
            (Job.title.ilike(f"%{search}%")) | 
            (Job.description.ilike(f"%{search}%")) |
            (Job.requirements.ilike(f"%{search}%"))
        )
    
    if recruiter_id:
        query = query.filter(Job.recruiter_id == recruiter_id)
        
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
        
    if is_remote is not None:
        query = query.filter(Job.is_remote == is_remote)
        
    if job_type:
        query = query.filter(Job.job_type == job_type)
        
    if experience_level:
        query = query.filter(Job.experience_level == experience_level)
        
    if min_salary is not None:
        query = query.filter((Job.salary_min >= min_salary) | (Job.salary_max >= min_salary))
        
    if skill_id:
        query = query.join(Job.required_skills).filter(Skill.id == skill_id)
        
    if status:
        query = query.filter(Job.status == status)
        
    if is_featured is not None:
        query = query.filter(Job.is_featured == is_featured)
    
    return query.offset(skip).limit(limit).all()

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific job by ID."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Increment views counter
    job.views_count += 1
    db.commit()
    
    return job

@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job: JobCreate,
    recruiter_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """Create a new job."""
    # Check if the recruiter exists
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    
    # Validate job_type
    if job.job_type not in [t.value for t in JobType]:
        raise HTTPException(status_code=400, detail=f"Invalid job_type. Valid values are: {', '.join([t.value for t in JobType])}")
    
    # Validate experience_level
    if job.experience_level not in [e.value for e in ExperienceLevel]:
        raise HTTPException(status_code=400, detail=f"Invalid experience_level. Valid values are: {', '.join([e.value for e in ExperienceLevel])}")
    
    # Extract skill_ids and create the job
    skill_ids = job.skill_ids
    job_data = job.dict(exclude={"skill_ids"})
    
    db_job = Job(**job_data, recruiter_id=recruiter_id, status=JobStatus.OPEN.value)
    
    # Add skills
    if skill_ids:
        skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
        if len(skills) != len(skill_ids):
            raise HTTPException(status_code=400, detail="Some skill IDs are invalid")
        db_job.required_skills = skills
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.put("/jobs/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job: JobUpdate,
    db: Session = Depends(get_db),
):
    """Update a job."""
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Validate job_type if provided
    if job.job_type and job.job_type not in [t.value for t in JobType]:
        raise HTTPException(status_code=400, detail=f"Invalid job_type. Valid values are: {', '.join([t.value for t in JobType])}")
    
    # Validate experience_level if provided
    if job.experience_level and job.experience_level not in [e.value for e in ExperienceLevel]:
        raise HTTPException(status_code=400, detail=f"Invalid experience_level. Valid values are: {', '.join([e.value for e in ExperienceLevel])}")
    
    # Validate status if provided
    if job.status and job.status not in [s.value for s in JobStatus]:
        raise HTTPException(status_code=400, detail=f"Invalid status. Valid values are: {', '.join([s.value for s in JobStatus])}")
    
    # Update fields
    update_data = job.dict(exclude={"skill_ids"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_job, key, value)
    
    # Update skills if provided
    if job.skill_ids is not None:
        skills = db.query(Skill).filter(Skill.id.in_(job.skill_ids)).all()
        if len(skills) != len(job.skill_ids):
            raise HTTPException(status_code=400, detail="Some skill IDs are invalid")
        db_job.required_skills = skills
    
    db.commit()
    db.refresh(db_job)
    return db_job

# Applications

@router.get("/applications", response_model=List[ApplicationResponse])
async def get_applications(
    db: Session = Depends(get_db),
    job_id: Optional[int] = None,
    applicant_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
):
    """Get applications with optional filtering."""
    query = db.query(Application)
    
    if job_id:
        query = query.filter(Application.job_id == job_id)
        
    if applicant_id:
        query = query.filter(Application.applicant_id == applicant_id)
        
    if status:
        query = query.filter(Application.status == status)
    
    return query.offset(skip).limit(limit).all()

@router.get("/applications/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific application by ID."""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.post("/applications", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    application: ApplicationCreate,
    applicant_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """Create a new job application."""
    # Check if the job exists and is open
    job = db.query(Job).filter(Job.id == application.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != JobStatus.OPEN.value:
        raise HTTPException(status_code=400, detail=f"Cannot apply to a job with status: {job.status}")
    
    # Check if the applicant exists
    applicant = db.query(ApplicantProfile).filter(ApplicantProfile.id == applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Check if already applied
    existing = db.query(Application).filter(
        Application.job_id == application.job_id,
        Application.applicant_id == applicant_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this job")
    
    # Create application
    db_application = Application(
        **application.dict(),
        applicant_id=applicant_id,
        status=ApplicationStatus.SUBMITTED.value
    )
    
    db.add(db_application)
    
    # Update job applications count
    job.applications_count += 1
    
    db.commit()
    db.refresh(db_application)
    return db_application

@router.put("/applications/{application_id}", response_model=ApplicationResponse)
async def update_application_status(
    application_id: int,
    application: ApplicationUpdate,
    db: Session = Depends(get_db),
):
    """Update an application's status and recruiter notes."""
    db_application = db.query(Application).filter(Application.id == application_id).first()
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Validate status
    if application.status not in [s.value for s in ApplicationStatus]:
        raise HTTPException(status_code=400, detail=f"Invalid status. Valid values are: {', '.join([s.value for s in ApplicationStatus])}")
    
    # Update fields
    update_data = application.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_application, key, value)
    
    db.commit()
    db.refresh(db_application)
    return db_application

# Job Messages

@router.get("/messages/{application_id}", response_model=List[JobMessageResponse])
async def get_job_messages(
    application_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Get messages for an application."""
    # Check if the application exists
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    messages = db.query(JobMessage).filter(
        JobMessage.application_id == application_id
    ).order_by(JobMessage.created_at).offset(skip).limit(limit).all()
    
    return messages

@router.post("/messages", response_model=JobMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_job_message(
    message: JobMessageCreate,
    db: Session = Depends(get_db),
):
    """Create a new message for an application."""
    # Check if the application exists
    application = db.query(Application).filter(Application.id == message.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db_message = JobMessage(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
