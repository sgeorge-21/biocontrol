-- ============================================================================
-- Liberia Malaria Diagnosis & Early Warning System
-- PostgreSQL Database Schema
-- ============================================================================

-- Create database (if not exists)
-- CREATE DATABASE liberia_malaria;

-- ============================================================================
-- TABLE: county_statistics
-- Description: County-level malaria epidemiological statistics
-- ============================================================================
CREATE TABLE IF NOT EXISTS county_statistics (
    id SERIAL PRIMARY KEY,
    county_name VARCHAR(100) UNIQUE NOT NULL,
    cases_per_year INTEGER NOT NULL,
    deaths_per_year INTEGER NOT NULL,
    population INTEGER NOT NULL,
    population_at_risk_percentage FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_county_statistics_name ON county_statistics(county_name);

-- ============================================================================
-- TABLE: health_facilities
-- Description: Health facility information including labs and diagnostic capabilities
-- ============================================================================
CREATE TABLE IF NOT EXISTS health_facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    county VARCHAR(100) NOT NULL,
    facility_type VARCHAR(50) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    phone VARCHAR(20),
    hours VARCHAR(100),
    has_lab BOOLEAN DEFAULT FALSE,
    has_rdt BOOLEAN DEFAULT TRUE,
    has_microscopy BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_facilities_county ON health_facilities(county);
CREATE INDEX idx_health_facilities_type ON health_facilities(facility_type);
CREATE INDEX idx_health_facilities_coords ON health_facilities(latitude, longitude);

-- ============================================================================
-- TABLE: symptoms_guide
-- Description: Symptom classification and clinical assessment guidance
-- ============================================================================
CREATE TABLE IF NOT EXISTS symptoms_guide (
    id SERIAL PRIMARY KEY,
    symptom_name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,  -- 'cardinal', 'associated', 'danger_sign'
    description TEXT NOT NULL,
    urgency_level VARCHAR(20) NOT NULL,  -- 'low', 'medium', 'high', 'critical'
    clinical_significance TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_symptoms_guide_category ON symptoms_guide(category);
CREATE INDEX idx_symptoms_guide_urgency ON symptoms_guide(urgency_level);

-- ============================================================================
-- TABLE: treatment_protocols
-- Description: Treatment protocols for different malaria types
-- ============================================================================
CREATE TABLE IF NOT EXISTS treatment_protocols (
    id SERIAL PRIMARY KEY,
    treatment_type VARCHAR(50) NOT NULL,  -- 'uncomplicated', 'severe', 'pregnancy', 'pediatric'
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(255) NOT NULL,
    duration_days INTEGER NOT NULL,
    route VARCHAR(50) NOT NULL,  -- 'oral', 'IV', 'IM', 'rectal'
    notes TEXT,
    is_first_line BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_treatment_protocols_type ON treatment_protocols(treatment_type);
CREATE INDEX idx_treatment_protocols_first_line ON treatment_protocols(is_first_line);

-- ============================================================================
-- TABLE: prevention_strategies
-- Description: Prevention and control strategies
-- ============================================================================
CREATE TABLE IF NOT EXISTS prevention_strategies (
    id SERIAL PRIMARY KEY,
    strategy_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    effectiveness FLOAT,  -- 0-1 scale
    target_population VARCHAR(255),
    implementation_difficulty VARCHAR(20),  -- 'easy', 'medium', 'hard'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prevention_strategies_name ON prevention_strategies(strategy_name);

-- ============================================================================
-- TABLE: user_assessments
-- Description: Stores user malaria risk assessments (anonymized)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_assessments (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    symptoms TEXT NOT NULL,  -- JSON string
    risk_level VARCHAR(20) NOT NULL,  -- 'low', 'medium', 'high'
    ai_recommendation TEXT NOT NULL,
    county_inferred VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_assessments_session ON user_assessments(session_id);
CREATE INDEX idx_user_assessments_risk_level ON user_assessments(risk_level);
CREATE INDEX idx_user_assessments_county ON user_assessments(county_inferred);
CREATE INDEX idx_user_assessments_created ON user_assessments(created_at);

-- ============================================================================
-- TABLE: chat_messages
-- Description: Chat conversation history
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,  -- 'user', 'assistant'
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- County Statistics
INSERT INTO county_statistics (county_name, cases_per_year, deaths_per_year, population, population_at_risk_percentage) VALUES
('Montserrado', 450000, 300, 1500000, 100),
('Nimba', 280000, 187, 462000, 100),
('Bong', 220000, 147, 333000, 100),
('Lofa', 180000, 120, 276000, 100),
('Grand Bassa', 150000, 100, 221000, 100),
('Margibi', 140000, 94, 199000, 100)
ON CONFLICT (county_name) DO NOTHING;

-- Health Facilities
INSERT INTO health_facilities (name, county, facility_type, latitude, longitude, phone, hours, has_lab, has_rdt, has_microscopy) VALUES
('JFK Medical Center', 'Montserrado', 'Hospital', 6.3155, -10.8073, '+231-777-000-0000', '24/7', TRUE, TRUE, TRUE),
('Phebe Hospital', 'Bong', 'Hospital', 6.7500, -10.3750, '+231-777-111-1111', '24/7', TRUE, TRUE, TRUE),
('Jackson F. Doe Hospital', 'Nimba', 'Hospital', 7.5, -8.75, '+231-777-222-2222', '24/7', TRUE, TRUE, TRUE),
('Todee Health Clinic', 'Montserrado', 'Clinic', 6.3200, -10.8100, '+231-777-333-3333', '8 AM - 6 PM', FALSE, TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- Symptoms Guide
INSERT INTO symptoms_guide (symptom_name, category, description, urgency_level, clinical_significance) VALUES
('Cyclical Fever', 'cardinal', 'Fever occurring every 48-72 hours', 'high', 'Primary indicator of malaria infection'),
('Chills and Rigors', 'cardinal', 'Severe, uncontrollable shaking during fever episodes', 'high', 'Associated with fever spike'),
('Profuse Sweating', 'cardinal', 'Heavy sweating following fever episodes', 'high', 'Post-fever symptom'),
('Headache', 'associated', 'Severe headache accompanying fever', 'medium', 'Common associated symptom'),
('Confusion', 'danger_sign', 'Altered mental status or drowsiness', 'critical', 'Indicates potential cerebral malaria - EMERGENCY'),
('Difficulty Breathing', 'danger_sign', 'Respiratory distress or rapid breathing', 'critical', 'Severe respiratory involvement - EMERGENCY')
ON CONFLICT (symptom_name) DO NOTHING;

-- Treatment Protocols
INSERT INTO treatment_protocols (treatment_type, medication_name, dosage, duration_days, route, notes, is_first_line) VALUES
('uncomplicated', 'Artesunate-Amodiaquine (ASAQ)', 'Weight-based dosing: 10mg/kg AS + 10mg/kg AQ per day', 3, 'oral', 'First-line treatment in Liberia', TRUE),
('uncomplicated', 'Artemether-Lumefantrine (AL)', 'Weight-based dosing: 1.7/10mg/kg per dose', 3, 'oral', 'Alternative first-line treatment', TRUE),
('severe', 'Artesunate (IV/IM)', '2.4 mg/kg at 0, 12, 24 hours, then daily', 3, 'IV/IM', 'Hospital-only treatment for severe malaria', TRUE),
('pediatric', 'Rectal Artesunate', '10mg/kg', 1, 'rectal', 'Pre-referral treatment for children when hospital is far', TRUE)
ON CONFLICT DO NOTHING;

-- Prevention Strategies
INSERT INTO prevention_strategies (strategy_name, description, effectiveness, target_population, implementation_difficulty) VALUES
('Insecticide-Treated Bed Nets (ITNs)', 'Sleep under ITNs every night - most effective prevention method', 0.9, 'Entire population, especially children and pregnant women', 'easy'),
('Indoor Residual Spraying (IRS)', 'Spray inside homes to kill mosquitoes', 0.7, 'Households in endemic areas', 'medium'),
('Seasonal Malaria Chemoprevention (SMC)', 'Preventive medication during high transmission season', 0.75, 'Children under 5 during rainy season', 'medium'),
('Environmental Management', 'Eliminate standing water (tires, containers, gutters)', 0.5, 'All households', 'easy'),
('Personal Protective Equipment', 'Wear long sleeves/pants at dusk/dawn, use DEET repellent', 0.6, 'Outdoor workers and travelers', 'easy')
ON CONFLICT (strategy_name) DO NOTHING;

-- ============================================================================
-- VIEWS (Optional - useful for analytics)
-- ============================================================================

-- View: High-risk counties
CREATE OR REPLACE VIEW high_risk_counties AS
SELECT 
    county_name,
    cases_per_year,
    deaths_per_year,
    population,
    ROUND(CAST(cases_per_year AS FLOAT) / population * 100, 2) AS case_rate_percent,
    ROUND(CAST(deaths_per_year AS FLOAT) / cases_per_year * 100, 3) AS fatality_rate_percent
FROM county_statistics
ORDER BY cases_per_year DESC;

-- View: Assessment summary by risk level
CREATE OR REPLACE VIEW assessment_summary AS
SELECT 
    risk_level,
    COUNT(*) as total_assessments,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT county_inferred) as counties_affected,
    MAX(created_at) as latest_assessment
FROM user_assessments
GROUP BY risk_level;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
