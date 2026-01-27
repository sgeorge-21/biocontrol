"""
Chat routes for malaria assessment
"""

from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import ChatMessage, UserAssessment
from utils.llm_utils import call_llm
from datetime import datetime
import json
import uuid

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/message', methods=['POST'])
def send_message():
    """
    Send a message to the AI and get a response
    
    Request body:
    {
        "messages": [
            {"role": "user", "content": "I have a fever..."},
            {"role": "assistant", "content": "..."}
        ],
        "session_id": "optional-session-id"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'messages' not in data:
            return jsonify({'error': 'Missing messages field'}), 400
        
        messages = data.get('messages', [])
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        if not messages:
            return jsonify({'error': 'Messages list cannot be empty'}), 400
        
        # Get last user message for risk assessment
        last_user_message = next(
            (m['content'] for m in reversed(messages) if m['role'] == 'user'),
            ''
        )
        
        # Call LLM
        ai_response = call_llm(messages)
        
        # Store in database
        db = SessionLocal()
        try:
            # Store user message
            if messages[-1]['role'] == 'user':
                user_msg = ChatMessage(
                    session_id=session_id,
                    role='user',
                    content=messages[-1]['content']
                )
                db.add(user_msg)
            
            # Store AI response
            ai_msg = ChatMessage(
                session_id=session_id,
                role='assistant',
                content=ai_response
            )
            db.add(ai_msg)
            
            db.commit()
            
        except Exception as e:
            db.rollback()
            print(f"Error storing chat message: {e}")
        finally:
            db.close()
        
        return jsonify({
            'message': ai_response,
            'session_id': session_id
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/history/<session_id>', methods=['GET'])
def get_chat_history(session_id):
    """Get chat history for a session"""
    try:
        db = SessionLocal()
        messages = db.query(ChatMessage).filter_by(session_id=session_id).all()
        db.close()
        
        return jsonify({
            'session_id': session_id,
            'messages': [msg.to_dict() for msg in messages]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/assessment', methods=['POST'])
def create_assessment():
    """
    Create a user assessment record
    
    Request body:
    {
        "session_id": "session-123",
        "symptoms": ["fever", "chills"],
        "risk_level": "high|medium|low",
        "ai_recommendation": "Go to hospital",
        "county_inferred": "Montserrado"
    }
    """
    try:
        data = request.get_json()
        
        required_fields = ['session_id', 'symptoms', 'risk_level', 'ai_recommendation']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        db = SessionLocal()
        try:
            assessment = UserAssessment(
                session_id=data['session_id'],
                symptoms=json.dumps(data.get('symptoms', [])),
                risk_level=data['risk_level'],
                ai_recommendation=data['ai_recommendation'],
                county_inferred=data.get('county_inferred')
            )
            db.add(assessment)
            db.commit()
            
            return jsonify({
                'id': assessment.id,
                'session_id': assessment.session_id,
                'created_at': str(assessment.created_at)
            }), 201
        
        except Exception as e:
            db.rollback()
            raise
        finally:
            db.close()
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
