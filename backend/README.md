# Python Backend Setup

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── database.py           # Database connection and ORM setup
├── models.py            # SQLAlchemy models
├── init_db.py           # Database initialization script
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── utils/
│   └── llm_utils.py     # LLM API integration
├── routes/
│   ├── chat.py         # Chat and assessment endpoints
│   ├── epidemiology.py # County/national statistics
│   ├── facilities.py   # Health facility finder
│   └── education.py    # Education and reference data
└── README.md
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL: PostgreSQL connection string
# - LOVABLE_API_KEY: Your AI gateway API key
```

### 3. Setup PostgreSQL Database

Ensure PostgreSQL is running and create a database:

```sql
CREATE DATABASE liberia_malaria;
```

### 4. Initialize Database

```bash
cd backend
python init_db.py
```

This will:
- Create all database tables
- Insert sample data:
  - 6 counties with epidemiological data
  - 4 major health facilities
  - 6 symptoms with classifications
  - 4 treatment protocols
  - 5 prevention strategies

### 5. Run the Backend

```bash
python app.py
```

The server will start on `http://localhost:5000` (or PORT from .env)

## API Endpoints

### Chat & Assessment

**POST /api/chat/message**
- Send user message to AI
- Returns: AI response + session_id

**GET /api/chat/history/<session_id>**
- Get full chat history for a session

**POST /api/chat/assessment**
- Create an assessment record

### Epidemiology

**GET /api/epidemiology/counties**
- Get all county statistics

**GET /api/epidemiology/counties/<county_name>**
- Get specific county statistics

**GET /api/epidemiology/summary**
- Get national summary

### Facilities

**GET /api/facilities/all**
- Get all health facilities

**GET /api/facilities/county/<county_name>**
- Get facilities in a county

**POST /api/facilities/nearest**
- Find nearest facilities (requires lat/lon)

**GET /api/facilities/<facility_id>**
- Get facility details

### Education

**GET /api/education/symptoms**
- Get all symptoms organized by category

**GET /api/education/symptoms/<category>**
- Get symptoms by category (cardinal, associated, danger_sign)

**GET /api/education/treatments**
- Get all treatment protocols

**GET /api/education/treatments/<type>**
- Get treatments by type

**GET /api/education/prevention**
- Get all prevention strategies

## Database Schema

### Tables

1. **county_statistics** - County-level epidemiology
2. **health_facilities** - Health facility information
3. **symptoms_guide** - Symptom classification and guidance
4. **treatment_protocols** - Treatment information
5. **prevention_strategies** - Prevention methods
6. **user_assessments** - Anonymized user assessments
7. **chat_messages** - Chat conversation history

## Deployment

For production:

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

Or use Docker for containerized deployment.
