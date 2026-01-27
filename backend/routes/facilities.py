"""
Health facilities routes
"""

from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import HealthFacility
from math import radians, cos, sin, asin, sqrt

facilities_bp = Blueprint('facilities', __name__)

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r

@facilities_bp.route('/all', methods=['GET'])
def get_all_facilities():
    """Get all health facilities"""
    try:
        db = SessionLocal()
        facilities = db.query(HealthFacility).all()
        db.close()
        
        return jsonify({
            'facilities': [facility.to_dict() for facility in facilities]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@facilities_bp.route('/county/<county_name>', methods=['GET'])
def get_facilities_by_county(county_name):
    """Get health facilities in a specific county"""
    try:
        db = SessionLocal()
        facilities = db.query(HealthFacility).filter_by(county=county_name).all()
        db.close()
        
        return jsonify({
            'county': county_name,
            'facilities': [facility.to_dict() for facility in facilities]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@facilities_bp.route('/nearest', methods=['POST'])
def get_nearest_facilities():
    """
    Get nearest facilities to a location
    
    Request body:
    {
        "latitude": 6.3155,
        "longitude": -10.8073,
        "max_distance_km": 50,
        "limit": 5
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'latitude' not in data or 'longitude' not in data:
            return jsonify({'error': 'Missing latitude or longitude'}), 400
        
        user_lat = float(data['latitude'])
        user_lon = float(data['longitude'])
        max_distance = float(data.get('max_distance_km', 50))
        limit = int(data.get('limit', 5))
        
        db = SessionLocal()
        facilities = db.query(HealthFacility).all()
        db.close()
        
        # Calculate distances
        facilities_with_distance = []
        for facility in facilities:
            if facility.latitude and facility.longitude:
                distance = haversine(
                    user_lon, user_lat,
                    facility.longitude, facility.latitude
                )
                if distance <= max_distance:
                    facility_dict = facility.to_dict()
                    facility_dict['distance_km'] = round(distance, 2)
                    facilities_with_distance.append(facility_dict)
        
        # Sort by distance and limit results
        facilities_with_distance.sort(key=lambda x: x['distance_km'])
        results = facilities_with_distance[:limit]
        
        return jsonify({
            'user_location': {'latitude': user_lat, 'longitude': user_lon},
            'facilities': results,
            'count': len(results)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@facilities_bp.route('/<facility_id>', methods=['GET'])
def get_facility(facility_id):
    """Get details for a specific facility"""
    try:
        db = SessionLocal()
        facility = db.query(HealthFacility).filter_by(id=facility_id).first()
        db.close()
        
        if not facility:
            return jsonify({'error': 'Facility not found'}), 404
        
        return jsonify(facility.to_dict())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
