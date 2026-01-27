"""
SQLAlchemy models for the Liberia Malaria system
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class User(Base):
    """User account for the malaria monitoring system"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)
    county = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    assessments = relationship('UserAssessmentRecord', back_populates='user', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'date_of_birth': str(self.date_of_birth) if self.date_of_birth else None,
            'location': self.location,
            'county': self.county,
            'created_at': str(self.created_at),
            'last_login': str(self.last_login) if self.last_login else None,
            'is_active': self.is_active,
        }

class CountyStatistic(Base):
    """County-level malaria statistics"""
    __tablename__ = 'county_statistics'
    
    id = Column(Integer, primary_key=True)
    county_name = Column(String(100), unique=True, nullable=False)
    cases_per_year = Column(Integer, nullable=False)
    deaths_per_year = Column(Integer, nullable=False)
    population = Column(Integer, nullable=False)
    population_at_risk_percentage = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'county_name': self.county_name,
            'cases_per_year': self.cases_per_year,
            'deaths_per_year': self.deaths_per_year,
            'population': self.population,
            'population_at_risk_percentage': self.population_at_risk_percentage,
        }

class HealthFacility(Base):
    """Health facility information"""
    __tablename__ = 'health_facilities'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    county = Column(String(100), nullable=False)
    facility_type = Column(String(50), nullable=False)  # Hospital, Clinic, CHU, etc.
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    phone = Column(String(20), nullable=True)
    hours = Column(String(100), nullable=True)
    has_lab = Column(Boolean, default=False)
    has_rdt = Column(Boolean, default=True)
    has_microscopy = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'county': self.county,
            'facility_type': self.facility_type,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'phone': self.phone,
            'hours': self.hours,
            'has_lab': self.has_lab,
            'has_rdt': self.has_rdt,
            'has_microscopy': self.has_microscopy,
        }

class SymptomsGuide(Base):
    """Symptoms and clinical assessment data"""
    __tablename__ = 'symptoms_guide'
    
    id = Column(Integer, primary_key=True)
    symptom_name = Column(String(100), unique=True, nullable=False)
    category = Column(String(50), nullable=False)  # cardinal, associated, danger_sign
    description = Column(Text, nullable=False)
    urgency_level = Column(String(20), nullable=False)  # low, medium, high, critical
    clinical_significance = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'symptom_name': self.symptom_name,
            'category': self.category,
            'description': self.description,
            'urgency_level': self.urgency_level,
            'clinical_significance': self.clinical_significance,
        }

class TreatmentProtocol(Base):
    """Treatment protocols for different malaria types"""
    __tablename__ = 'treatment_protocols'
    
    id = Column(Integer, primary_key=True)
    treatment_type = Column(String(50), nullable=False)  # uncomplicated, severe, pregnancy, pediatric
    medication_name = Column(String(100), nullable=False)
    dosage = Column(String(255), nullable=False)
    duration_days = Column(Integer, nullable=False)
    route = Column(String(50), nullable=False)  # oral, IV, IM, rectal
    notes = Column(Text, nullable=True)
    is_first_line = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'treatment_type': self.treatment_type,
            'medication_name': self.medication_name,
            'dosage': self.dosage,
            'duration_days': self.duration_days,
            'route': self.route,
            'notes': self.notes,
            'is_first_line': self.is_first_line,
        }

class PreventionStrategy(Base):
    """Prevention and control strategies"""
    __tablename__ = 'prevention_strategies'
    
    id = Column(Integer, primary_key=True)
    strategy_name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    effectiveness = Column(Float, nullable=True)  # 0-1 scale
    target_population = Column(String(255), nullable=True)
    implementation_difficulty = Column(String(20), nullable=True)  # easy, medium, hard
    created_at = Column(DateTime, server_default=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'strategy_name': self.strategy_name,
            'description': self.description,
            'effectiveness': self.effectiveness,
            'target_population': self.target_population,
            'implementation_difficulty': self.implementation_difficulty,
        }

class UserAssessment(Base):
    """Stores user malaria risk assessments (anonymized)"""
    __tablename__ = 'user_assessments'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    session_id = Column(String(100), nullable=False, unique=True)
    symptoms = Column(Text, nullable=False)  # JSON string of symptoms
    risk_level = Column(String(20), nullable=False)  # low, medium, high
    ai_recommendation = Column(Text, nullable=False)
    county_inferred = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationship
    user = relationship('User', back_populates='assessments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'symptoms': self.symptoms,
            'risk_level': self.risk_level,
            'ai_recommendation': self.ai_recommendation,
            'county_inferred': self.county_inferred,
            'created_at': str(self.created_at),
        }

class ChatMessage(Base):
    """Chat conversation history"""
    __tablename__ = 'chat_messages'
    
    id = Column(Integer, primary_key=True)
    session_id = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'role': self.role,
            'content': self.content,
            'timestamp': str(self.timestamp),
        }
