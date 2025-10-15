from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
import logging
import pandas as pd
from io import BytesIO
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

from config import Config
from database import get_db
from face_recognition_service import face_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Get database instance
db = get_db()

# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        doc = doc.copy()
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, datetime):
                doc[key] = value.isoformat()
            elif isinstance(value, dict):
                doc[key] = serialize_doc(value)
            elif isinstance(value, list):
                doc[key] = serialize_doc(value)
        return doc
    return doc

# ==================== USER ROUTES ====================

@app.route('/api/register', methods=['POST'])
def register_user():
    """Register a new user with face data"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['voter_id', 'name', 'email', 'phone', 'address', 'face_image']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if voter_id already exists
        if db.users.find_one({'voter_id': data['voter_id']}):
            return jsonify({'error': 'Voter ID already registered'}), 400
        
        # Check if email already exists
        if db.users.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already registered'}), 400
        
        # Extract face encoding
        face_encoding, message = face_service.extract_face_encoding(data['face_image'])
        
        if face_encoding is None:
            return jsonify({'error': message}), 400
        
        # Create user document
        user = {
            'voter_id': data['voter_id'],
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'address': data['address'],
            'age': data.get('age', ''),
            'gender': data.get('gender', ''),
            'face_encoding': face_encoding,
            'has_voted': False,
            'registered_at': datetime.utcnow()
        }
        
        # Insert into database
        result = db.users.insert_one(user)
        
        logger.info(f"User registered successfully: {data['voter_id']}")
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'voter_id': data['voter_id']
        }), 201
        
    except Exception as e:
        logger.error(f"Error in register_user: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    """Authenticate user with face recognition"""
    try:
        data = request.json
        
        if 'face_image' not in data:
            return jsonify({'error': 'Face image is required'}), 400
        
        # Extract face encoding from submitted image
        face_encoding, message = face_service.extract_face_encoding(data['face_image'])
        
        if face_encoding is None:
            return jsonify({'error': message}), 400
        
        # Get all users with face encodings
        users = list(db.users.find({}, {'voter_id': 1, 'face_encoding': 1, 'name': 1, 'has_voted': 1}))
        
        if not users:
            return jsonify({'error': 'No registered users found'}), 404
        
        # Find matching face
        voter_id, confidence = face_service.find_matching_face(face_encoding, users)
        
        if voter_id is None:
            return jsonify({'error': 'Face not recognized. Please register first.'}), 401
        
        # Get full user details
        user = db.users.find_one({'voter_id': voter_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        logger.info(f"User logged in successfully: {voter_id}")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'voter_id': user['voter_id'],
                'name': user['name'],
                'email': user['email'],
                'has_voted': user['has_voted']
            },
            'confidence': round(confidence, 2)
        }), 200
        
    except Exception as e:
        logger.error(f"Error in login_user: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-face', methods=['POST'])
def verify_face():
    """Verify face in real-time without logging in - returns user name if recognized"""
    try:
        data = request.json
        
        if 'face_image' not in data:
            return jsonify({'recognized': False}), 200
        
        # Extract face encoding from submitted image
        face_encoding, message = face_service.extract_face_encoding(data['face_image'])
        
        if face_encoding is None:
            return jsonify({'recognized': False}), 200
        
        # Get all users with face encodings
        users = list(db.users.find({}, {'voter_id': 1, 'face_encoding': 1, 'name': 1}))
        
        if not users:
            return jsonify({'recognized': False}), 200
        
        # Find matching face
        voter_id, confidence = face_service.find_matching_face(face_encoding, users)
        
        if voter_id is None:
            return jsonify({'recognized': False}), 200
        
        # Get user details
        user = db.users.find_one({'voter_id': voter_id}, {'name': 1, 'voter_id': 1})
        
        if not user:
            return jsonify({'recognized': False}), 200
        
        return jsonify({
            'recognized': True,
            'name': user['name'],
            'voter_id': user['voter_id'],
            'confidence': round(confidence, 2)
        }), 200
        
    except Exception as e:
        logger.error(f"Error in verify_face: {e}")
        return jsonify({'recognized': False}), 200

@app.route('/api/user/<voter_id>', methods=['GET'])
def get_user(voter_id):
    """Get user details"""
    try:
        user = db.users.find_one({'voter_id': voter_id}, {'face_encoding': 0})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(serialize_doc(user)), 200
        
    except Exception as e:
        logger.error(f"Error in get_user: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== VOTING ROUTES ====================

@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    """Get all candidates"""
    try:
        candidates = list(db.candidates.find())
        
        # Add vote count to each candidate
        for candidate in candidates:
            vote_count = db.votes.count_documents({'candidate_id': candidate['candidate_id']})
            candidate['vote_count'] = vote_count
        
        return jsonify(serialize_doc(candidates)), 200
        
    except Exception as e:
        logger.error(f"Error in get_candidates: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vote', methods=['POST'])
def cast_vote():
    """Cast a vote"""
    try:
        data = request.json
        
        # Validate required fields
        if 'voter_id' not in data or 'candidate_id' not in data:
            return jsonify({'error': 'Missing voter_id or candidate_id'}), 400
        
        voter_id = data['voter_id']
        candidate_id = data['candidate_id']
        
        # Check if user exists
        user = db.users.find_one({'voter_id': voter_id})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user has already voted
        if user.get('has_voted', False):
            return jsonify({'error': 'You have already voted'}), 403
        
        # Check if candidate exists
        candidate = db.candidates.find_one({'candidate_id': candidate_id})
        if not candidate:
            return jsonify({'error': 'Candidate not found'}), 404
        
        # Create vote document
        vote = {
            'voter_id': voter_id,
            'candidate_id': candidate_id,
            'candidate_name': candidate['name'],
            'timestamp': datetime.utcnow()
        }
        
        # Insert vote
        db.votes.insert_one(vote)
        
        # Update user's has_voted status
        db.users.update_one(
            {'voter_id': voter_id},
            {'$set': {'has_voted': True, 'voted_at': datetime.utcnow()}}
        )
        
        logger.info(f"Vote cast successfully: Voter {voter_id} -> Candidate {candidate_id}")
        
        return jsonify({
            'success': True,
            'message': 'Vote cast successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error in cast_vote: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/voting-status/<voter_id>', methods=['GET'])
def check_voting_status(voter_id):
    """Check if user has voted and get voted candidate info"""
    try:
        user = db.users.find_one({'voter_id': voter_id}, {'has_voted': 1, 'voted_at': 1})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        response_data = {
            'has_voted': user.get('has_voted', False),
            'voted_at': user.get('voted_at'),
            'voted_candidate': None
        }
        
        # If user has voted, get the candidate they voted for
        if user.get('has_voted', False):
            vote = db.votes.find_one({'voter_id': voter_id})
            if vote:
                candidate = db.candidates.find_one(
                    {'candidate_id': vote['candidate_id']},
                    {'_id': 0}
                )
                if candidate:
                    response_data['voted_candidate'] = candidate
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Error in check_voting_status: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login"""
    try:
        data = request.json
        
        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password required'}), 400
        
        admin = db.admins.find_one({
            'username': data['username'],
            'password': data['password']  # In production, use hashed passwords!
        })
        
        if not admin:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        logger.info(f"Admin logged in: {data['username']}")
        
        return jsonify({
            'success': True,
            'message': 'Admin login successful',
            'admin': {
                'username': admin['username'],
                'role': admin['role']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error in admin_login: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    """Get voting statistics"""
    try:
        total_users = db.users.count_documents({})
        total_votes = db.votes.count_documents({})
        total_candidates = db.candidates.count_documents({})
        users_voted = db.users.count_documents({'has_voted': True})
        
        # Get candidate vote distribution
        candidates = list(db.candidates.find())
        candidate_stats = []
        
        for candidate in candidates:
            vote_count = db.votes.count_documents({'candidate_id': candidate['candidate_id']})
            candidate_stats.append({
                'candidate_id': candidate['candidate_id'],
                'name': candidate['name'],
                'party': candidate['party'],
                'vote_count': vote_count,
                'percentage': round((vote_count / total_votes * 100) if total_votes > 0 else 0, 2)
            })
        
        # Sort by vote count
        candidate_stats.sort(key=lambda x: x['vote_count'], reverse=True)
        
        return jsonify({
            'total_users': total_users,
            'total_votes': total_votes,
            'total_candidates': total_candidates,
            'users_voted': users_voted,
            'users_not_voted': total_users - users_voted,
            'turnout_percentage': round((users_voted / total_users * 100) if total_users > 0 else 0, 2),
            'candidate_stats': candidate_stats
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_admin_stats: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    """Get all registered users (admin only)"""
    try:
        users = list(db.users.find({}, {'face_encoding': 0}))
        return jsonify(serialize_doc(users)), 200
        
    except Exception as e:
        logger.error(f"Error in get_all_users: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/candidate', methods=['POST'])
def add_candidate():
    """Add a new candidate"""
    try:
        data = request.json
        
        required_fields = ['candidate_id', 'name', 'party_id', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if candidate_id already exists
        if db.candidates.find_one({'candidate_id': data['candidate_id']}):
            return jsonify({'error': 'Candidate ID already exists'}), 400
        
        # Check if party exists and get party name
        party = db.parties.find_one({'party_id': data['party_id']})
        if not party:
            return jsonify({'error': 'Invalid party ID'}), 400
        
        candidate = {
            'candidate_id': data['candidate_id'],
            'name': data['name'],
            'party_id': data['party_id'],
            'party': party['name'],  # Store party name for easy access
            'description': data['description'],
            'image_url': data.get('image_url', 'https://via.placeholder.com/300x300?text=Candidate'),
            'created_at': datetime.utcnow()
        }
        
        db.candidates.insert_one(candidate)
        
        logger.info(f"Candidate added: {data['candidate_id']}")
        
        return jsonify({
            'success': True,
            'message': 'Candidate added successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error in add_candidate: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/candidate/<candidate_id>', methods=['PUT'])
def update_candidate(candidate_id):
    """Update candidate details"""
    try:
        data = request.json
        
        # Check if candidate exists
        if not db.candidates.find_one({'candidate_id': candidate_id}):
            return jsonify({'error': 'Candidate not found'}), 404
        
        update_data = {}
        allowed_fields = ['name', 'party_id', 'description', 'image_url']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        # If party_id changed, update party name too
        if 'party_id' in update_data:
            party = db.parties.find_one({'party_id': update_data['party_id']})
            if not party:
                return jsonify({'error': 'Invalid party ID'}), 400
            update_data['party'] = party['name']
        
        if not update_data:
            return jsonify({'error': 'No fields to update'}), 400
        
        update_data['updated_at'] = datetime.utcnow()
        
        db.candidates.update_one(
            {'candidate_id': candidate_id},
            {'$set': update_data}
        )
        
        logger.info(f"Candidate updated: {candidate_id}")
        
        return jsonify({
            'success': True,
            'message': 'Candidate updated successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in update_candidate: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/candidate/<candidate_id>', methods=['DELETE'])
def delete_candidate(candidate_id):
    """Delete a candidate"""
    try:
        # Check if candidate has votes
        vote_count = db.votes.count_documents({'candidate_id': candidate_id})
        
        if vote_count > 0:
            return jsonify({
                'error': f'Cannot delete candidate with {vote_count} votes'
            }), 400
        
        result = db.candidates.delete_one({'candidate_id': candidate_id})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Candidate not found'}), 404
        
        logger.info(f"Candidate deleted: {candidate_id}")
        
        return jsonify({
            'success': True,
            'message': 'Candidate deleted successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in delete_candidate: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/export/csv', methods=['GET'])
def export_results_csv():
    """Export voting results as CSV"""
    try:
        # Get all candidates with vote counts
        candidates = list(db.candidates.find())
        
        data = []
        for candidate in candidates:
            vote_count = db.votes.count_documents({'candidate_id': candidate['candidate_id']})
            data.append({
                'Candidate ID': candidate['candidate_id'],
                'Name': candidate['name'],
                'Party': candidate['party'],
                'Votes': vote_count
            })
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Create CSV in memory
        output = BytesIO()
        df.to_csv(output, index=False)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'voting_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        )
        
    except Exception as e:
        logger.error(f"Error in export_results_csv: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/export/pdf', methods=['GET'])
def export_results_pdf():
    """Export voting results as PDF"""
    try:
        # Create PDF in memory
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        # Title
        title = Paragraph("Biometric Voting System - Results Report", title_style)
        elements.append(title)
        elements.append(Spacer(1, 0.3 * inch))
        
        # Get statistics
        total_votes = db.votes.count_documents({})
        total_users = db.users.count_documents({})
        users_voted = db.users.count_documents({'has_voted': True})
        
        # Summary table
        summary_data = [
            ['Total Registered Voters', str(total_users)],
            ['Total Votes Cast', str(total_votes)],
            ['Voter Turnout', f"{round((users_voted / total_users * 100) if total_users > 0 else 0, 2)}%"],
            ['Generated On', datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
        ]
        
        summary_table = Table(summary_data, colWidths=[3 * inch, 2 * inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1f2937')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        
        elements.append(summary_table)
        elements.append(Spacer(1, 0.5 * inch))
        
        # Candidate results
        candidates = list(db.candidates.find())
        
        results_data = [['Rank', 'Candidate Name', 'Party', 'Votes', 'Percentage']]
        
        candidate_votes = []
        for candidate in candidates:
            vote_count = db.votes.count_documents({'candidate_id': candidate['candidate_id']})
            percentage = round((vote_count / total_votes * 100) if total_votes > 0 else 0, 2)
            candidate_votes.append({
                'name': candidate['name'],
                'party': candidate['party'],
                'votes': vote_count,
                'percentage': percentage
            })
        
        candidate_votes.sort(key=lambda x: x['votes'], reverse=True)
        
        for i, candidate in enumerate(candidate_votes, 1):
            results_data.append([
                str(i),
                candidate['name'],
                candidate['party'],
                str(candidate['votes']),
                f"{candidate['percentage']}%"
            ])
        
        results_table = Table(results_data, colWidths=[0.6 * inch, 2 * inch, 1.8 * inch, 0.8 * inch, 1 * inch])
        results_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#1f2937')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
        ]))
        
        elements.append(Paragraph("Candidate Results", styles['Heading2']))
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(results_table)
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'voting_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )
        
    except Exception as e:
        logger.error(f"Error in export_results_pdf: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== PARTY MANAGEMENT ROUTES ====================

@app.route('/api/parties', methods=['GET'])
def get_parties():
    """Get all parties"""
    try:
        parties = list(db.parties.find())
        
        # Add candidate count to each party
        for party in parties:
            candidate_count = db.candidates.count_documents({'party_id': party['party_id']})
            party['candidate_count'] = candidate_count
        
        return jsonify(serialize_doc(parties)), 200
        
    except Exception as e:
        logger.error(f"Error in get_parties: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/party', methods=['POST'])
def add_party():
    """Add a new party"""
    try:
        data = request.json
        
        required_fields = ['party_id', 'name', 'abbreviation', 'color', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if party_id already exists
        if db.parties.find_one({'party_id': data['party_id']}):
            return jsonify({'error': 'Party ID already exists'}), 400
        
        # Check if party name already exists
        if db.parties.find_one({'name': data['name']}):
            return jsonify({'error': 'Party name already exists'}), 400
        
        party = {
            'party_id': data['party_id'],
            'name': data['name'],
            'abbreviation': data['abbreviation'],
            'color': data['color'],
            'description': data['description'],
            'logo_url': data.get('logo_url', 'https://via.placeholder.com/150x150?text=Party'),
            'founded_date': data.get('founded_date', ''),
            'created_at': datetime.utcnow()
        }
        
        db.parties.insert_one(party)
        
        logger.info(f"Party added: {data['party_id']}")
        
        return jsonify({
            'success': True,
            'message': 'Party added successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error in add_party: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/party/<party_id>', methods=['PUT'])
def update_party(party_id):
    """Update party details"""
    try:
        data = request.json
        
        # Check if party exists
        if not db.parties.find_one({'party_id': party_id}):
            return jsonify({'error': 'Party not found'}), 404
        
        update_data = {}
        allowed_fields = ['name', 'abbreviation', 'color', 'description', 'logo_url', 'founded_date']
        
        for field in allowed_fields:
            if field in data:
                # Check if new name conflicts with existing party
                if field == 'name' and data[field]:
                    existing = db.parties.find_one({'name': data[field]})
                    if existing and existing['party_id'] != party_id:
                        return jsonify({'error': 'Party name already exists'}), 400
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({'error': 'No fields to update'}), 400
        
        update_data['updated_at'] = datetime.utcnow()
        
        db.parties.update_one(
            {'party_id': party_id},
            {'$set': update_data}
        )
        
        # If party name changed, update all candidates' party name
        if 'name' in update_data:
            db.candidates.update_many(
                {'party_id': party_id},
                {'$set': {'party': update_data['name']}}
            )
        
        logger.info(f"Party updated: {party_id}")
        
        return jsonify({
            'success': True,
            'message': 'Party updated successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in update_party: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/party/<party_id>', methods=['DELETE'])
def delete_party(party_id):
    """Delete a party"""
    try:
        # Check if party has candidates
        candidate_count = db.candidates.count_documents({'party_id': party_id})
        
        if candidate_count > 0:
            return jsonify({
                'error': f'Cannot delete party with {candidate_count} candidates. Remove candidates first.'
            }), 400
        
        result = db.parties.delete_one({'party_id': party_id})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Party not found'}), 404
        
        logger.info(f"Party deleted: {party_id}")
        
        return jsonify({
            'success': True,
            'message': 'Party deleted successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in delete_party: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        db.command('ping')
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==================== MAIN ====================

if __name__ == '__main__':
    logger.info(f"Starting Flask server on {Config.HOST}:{Config.PORT}")
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.FLASK_DEBUG
    )
