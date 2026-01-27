"""
Epidemiology and statistics routes
"""

from flask import Blueprint, jsonify
from database import SessionLocal
from models import CountyStatistic

epidemiology_bp = Blueprint('epidemiology', __name__)

@epidemiology_bp.route('/counties', methods=['GET'])
def get_all_counties():
    """Get statistics for all counties"""
    try:
        db = SessionLocal()
        counties = db.query(CountyStatistic).all()
        db.close()
        
        return jsonify({
            'counties': [county.to_dict() for county in counties]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@epidemiology_bp.route('/counties/<county_name>', methods=['GET'])
def get_county(county_name):
    """Get statistics for a specific county"""
    try:
        db = SessionLocal()
        county = db.query(CountyStatistic).filter_by(county_name=county_name).first()
        db.close()
        
        if not county:
            return jsonify({'error': 'County not found'}), 404
        
        return jsonify(county.to_dict())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@epidemiology_bp.route('/summary', methods=['GET'])
def get_summary():
    """Get national summary statistics"""
    try:
        db = SessionLocal()
        counties = db.query(CountyStatistic).all()
        db.close()
        
        total_cases = sum(c.cases_per_year for c in counties)
        total_deaths = sum(c.deaths_per_year for c in counties)
        total_population = sum(c.population for c in counties)
        
        return jsonify({
            'country': 'Liberia',
            'total_cases_per_year': total_cases,
            'total_deaths_per_year': total_deaths,
            'total_population': total_population,
            'population_at_risk': total_population,
            'case_fatality_rate': (total_deaths / total_cases * 100) if total_cases > 0 else 0,
            'transmission_pattern': 'Year-round endemic (peaks May-October)',
            'prevalent_species': 'P. falciparum (98%), P. malariae (2%)',
            'number_of_counties': len(counties)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
