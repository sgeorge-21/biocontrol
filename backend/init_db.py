"""
Database initialization script with sample data
"""

import os
from sqlalchemy import text
from database import engine, Base, SessionLocal
from models import (
    CountyStatistic, HealthFacility, SymptomsGuide, 
    TreatmentProtocol, PreventionStrategy
)

def init_database():
    """Create all tables and insert sample data"""
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    db = SessionLocal()
    
    try:
        # Clear existing data (for development)
        db.query(CountyStatistic).delete()
        db.query(HealthFacility).delete()
        db.query(SymptomsGuide).delete()
        db.query(TreatmentProtocol).delete()
        db.query(PreventionStrategy).delete()
        
        # Insert County Statistics
        counties = [
            CountyStatistic(county_name='Montserrado', cases_per_year=450000, deaths_per_year=300, population=1500000, population_at_risk_percentage=100),
            CountyStatistic(county_name='Nimba', cases_per_year=280000, deaths_per_year=187, population=462000, population_at_risk_percentage=100),
            CountyStatistic(county_name='Bong', cases_per_year=220000, deaths_per_year=147, population=333000, population_at_risk_percentage=100),
            CountyStatistic(county_name='Lofa', cases_per_year=180000, deaths_per_year=120, population=276000, population_at_risk_percentage=100),
            CountyStatistic(county_name='Grand Bassa', cases_per_year=150000, deaths_per_year=100, population=221000, population_at_risk_percentage=100),
            CountyStatistic(county_name='Margibi', cases_per_year=140000, deaths_per_year=94, population=199000, population_at_risk_percentage=100),
        ]
        db.add_all(counties)
        print("✓ County statistics inserted")
        
        # Insert Health Facilities
        facilities = [
            HealthFacility(
                name='JFK Medical Center',
                county='Montserrado',
                facility_type='Hospital',
                latitude=6.3155,
                longitude=-10.8073,
                phone='+231-777-000-0000',
                hours='24/7',
                has_lab=True,
                has_rdt=True,
                has_microscopy=True
            ),
            HealthFacility(
                name='Phebe Hospital',
                county='Bong',
                facility_type='Hospital',
                latitude=6.7500,
                longitude=-10.3750,
                phone='+231-777-111-1111',
                hours='24/7',
                has_lab=True,
                has_rdt=True,
                has_microscopy=True
            ),
            HealthFacility(
                name='Jackson F. Doe Hospital',
                county='Nimba',
                facility_type='Hospital',
                latitude=7.5,
                longitude=-8.75,
                phone='+231-777-222-2222',
                hours='24/7',
                has_lab=True,
                has_rdt=True,
                has_microscopy=True
            ),
            HealthFacility(
                name='Todee Health Clinic',
                county='Montserrado',
                facility_type='Clinic',
                latitude=6.3200,
                longitude=-10.8100,
                phone='+231-777-333-3333',
                hours='8 AM - 6 PM',
                has_lab=False,
                has_rdt=True,
                has_microscopy=False
            ),
        ]
        db.add_all(facilities)
        print("✓ Health facilities inserted")
        
        # Insert Symptoms
        symptoms = [
            SymptomsGuide(
                symptom_name='Cyclical Fever',
                category='cardinal',
                description='Fever occurring every 48-72 hours',
                urgency_level='high',
                clinical_significance='Primary indicator of malaria infection'
            ),
            SymptomsGuide(
                symptom_name='Chills and Rigors',
                category='cardinal',
                description='Severe, uncontrollable shaking during fever episodes',
                urgency_level='high',
                clinical_significance='Associated with fever spike'
            ),
            SymptomsGuide(
                symptom_name='Profuse Sweating',
                category='cardinal',
                description='Heavy sweating following fever episodes',
                urgency_level='high',
                clinical_significance='Post-fever symptom'
            ),
            SymptomsGuide(
                symptom_name='Headache',
                category='associated',
                description='Severe headache accompanying fever',
                urgency_level='medium',
                clinical_significance='Common associated symptom'
            ),
            SymptomsGuide(
                symptom_name='Confusion',
                category='danger_sign',
                description='Altered mental status or drowsiness',
                urgency_level='critical',
                clinical_significance='Indicates potential cerebral malaria - EMERGENCY'
            ),
            SymptomsGuide(
                symptom_name='Difficulty Breathing',
                category='danger_sign',
                description='Respiratory distress or rapid breathing',
                urgency_level='critical',
                clinical_significance='Severe respiratory involvement - EMERGENCY'
            ),
        ]
        db.add_all(symptoms)
        print("✓ Symptoms guide inserted")
        
        # Insert Treatment Protocols
        treatments = [
            TreatmentProtocol(
                treatment_type='uncomplicated',
                medication_name='Artesunate-Amodiaquine (ASAQ)',
                dosage='Weight-based dosing: 10mg/kg AS + 10mg/kg AQ per day',
                duration_days=3,
                route='oral',
                notes='First-line treatment in Liberia',
                is_first_line=True
            ),
            TreatmentProtocol(
                treatment_type='uncomplicated',
                medication_name='Artemether-Lumefantrine (AL)',
                dosage='Weight-based dosing: 1.7/10mg/kg per dose',
                duration_days=3,
                route='oral',
                notes='Alternative first-line treatment',
                is_first_line=True
            ),
            TreatmentProtocol(
                treatment_type='severe',
                medication_name='Artesunate (IV/IM)',
                dosage='2.4 mg/kg at 0, 12, 24 hours, then daily',
                duration_days=3,
                route='IV/IM',
                notes='Hospital-only treatment for severe malaria',
                is_first_line=True
            ),
            TreatmentProtocol(
                treatment_type='pediatric',
                medication_name='Rectal Artesunate',
                dosage='10mg/kg',
                duration_days=1,
                route='rectal',
                notes='Pre-referral treatment for children when hospital is far',
                is_first_line=True
            ),
        ]
        db.add_all(treatments)
        print("✓ Treatment protocols inserted")
        
        # Insert Prevention Strategies
        prevention = [
            PreventionStrategy(
                strategy_name='Insecticide-Treated Bed Nets (ITNs)',
                description='Sleep under ITNs every night - most effective prevention method',
                effectiveness=0.9,
                target_population='Entire population, especially children and pregnant women',
                implementation_difficulty='easy'
            ),
            PreventionStrategy(
                strategy_name='Indoor Residual Spraying (IRS)',
                description='Spray inside homes to kill mosquitoes',
                effectiveness=0.7,
                target_population='Households in endemic areas',
                implementation_difficulty='medium'
            ),
            PreventionStrategy(
                strategy_name='Seasonal Malaria Chemoprevention (SMC)',
                description='Preventive medication during high transmission season',
                effectiveness=0.75,
                target_population='Children under 5 during rainy season',
                implementation_difficulty='medium'
            ),
            PreventionStrategy(
                strategy_name='Environmental Management',
                description='Eliminate standing water (tires, containers, gutters)',
                effectiveness=0.5,
                target_population='All households',
                implementation_difficulty='easy'
            ),
            PreventionStrategy(
                strategy_name='Personal Protective Equipment',
                description='Wear long sleeves/pants at dusk/dawn, use DEET repellent',
                effectiveness=0.6,
                target_population='Outdoor workers and travelers',
                implementation_difficulty='easy'
            ),
        ]
        db.add_all(prevention)
        print("✓ Prevention strategies inserted")
        
        db.commit()
        print("\n✓ Database initialized successfully with all data!")
        
    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
        raise
    finally:
        db.close()

if __name__ == '__main__':
    init_database()
