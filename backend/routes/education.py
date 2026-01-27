"""
Education and reference material routes
"""

from flask import Blueprint, jsonify
from database import SessionLocal
from models import SymptomsGuide, TreatmentProtocol, PreventionStrategy

education_bp = Blueprint('education', __name__)

@education_bp.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Get all symptoms with categories"""
    try:
        db = SessionLocal()
        symptoms = db.query(SymptomsGuide).all()
        db.close()
        
        # Organize by category
        organized = {'cardinal': [], 'associated': [], 'danger_sign': []}
        for symptom in symptoms:
            organized[symptom.category].append(symptom.to_dict())
        
        return jsonify(organized)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@education_bp.route('/symptoms/<category>', methods=['GET'])
def get_symptoms_by_category(category):
    """Get symptoms by category"""
    try:
        valid_categories = ['cardinal', 'associated', 'danger_sign']
        if category not in valid_categories:
            return jsonify({'error': 'Invalid category'}), 400
        
        db = SessionLocal()
        symptoms = db.query(SymptomsGuide).filter_by(category=category).all()
        db.close()
        
        return jsonify({
            'category': category,
            'symptoms': [symptom.to_dict() for symptom in symptoms]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@education_bp.route('/treatments', methods=['GET'])
def get_treatments():
    """Get all treatment protocols"""
    try:
        db = SessionLocal()
        treatments = db.query(TreatmentProtocol).all()
        db.close()
        
        # Organize by type
        organized = {}
        for treatment in treatments:
            treatment_type = treatment.treatment_type
            if treatment_type not in organized:
                organized[treatment_type] = []
            organized[treatment_type].append(treatment.to_dict())
        
        return jsonify(organized)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@education_bp.route('/treatments/<treatment_type>', methods=['GET'])
def get_treatments_by_type(treatment_type):
    """Get treatments by type"""
    try:
        valid_types = ['uncomplicated', 'severe', 'pregnancy', 'pediatric']
        if treatment_type not in valid_types:
            return jsonify({'error': 'Invalid treatment type'}), 400
        
        db = SessionLocal()
        treatments = db.query(TreatmentProtocol).filter_by(treatment_type=treatment_type).all()
        db.close()
        
        return jsonify({
            'treatment_type': treatment_type,
            'protocols': [treatment.to_dict() for treatment in treatments]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@education_bp.route('/prevention', methods=['GET'])
def get_prevention():
    """Get all prevention strategies"""
    try:
        db = SessionLocal()
        strategies = db.query(PreventionStrategy).all()
        db.close()
        
        return jsonify({
            'strategies': [strategy.to_dict() for strategy in strategies]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
