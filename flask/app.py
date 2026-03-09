from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import re
from datetime import datetime
from pathlib import Path

# Load environment variables from flask/.env
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
cors_origin = os.getenv('CORS_ORIGIN', 'http://localhost:3000')
CORS(app, resources={r"/members*": {"origins": cors_origin}})

# SQLite database configuration - use instance folder
db_path = Path(__file__).parent.parent / 'instance' / 'members.db'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-me')
db = SQLAlchemy(app)

# Member model
class Member(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    plan = db.Column(db.String(50), nullable=False)
    startDate = db.Column(db.String(20), nullable=False)
    endDate = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'plan': self.plan,
            'startDate': self.startDate,
            'endDate': self.endDate,
        }

# Create tables if they don't exist
with app.app_context():
    db.create_all()

def validate_member_data(data, is_update=False):
    """Validate member data"""
    errors = []

    if not data:
        errors.append("Request body is required")
        return errors

    # For new members, ID is required
    if not is_update and (not data.get("id") or not data["id"].strip()):
        errors.append("Member ID is required")

    # Name validation
    if not data.get("name") or not data["name"].strip():
        errors.append("Name is required")
    elif len(data["name"].strip()) < 2:
        errors.append("Name must be at least 2 characters long")
    elif len(data["name"].strip()) > 100:
        errors.append("Name must be less than 100 characters")

    # Phone validation
    if not data.get("phone") or not data["phone"].strip():
        errors.append("Phone number is required")
    elif not re.match(r'^\d{10}$', data["phone"].strip()):
        errors.append("Phone number must be exactly 10 digits")

    # Plan validation
    valid_plans = ["1_month", "3_months", "4_months", "6_months", "13_months"]
    if not data.get("plan") or data["plan"] not in valid_plans:
        errors.append(f"Plan must be one of: {', '.join(valid_plans)}")

    # Date validation
    if not data.get("startDate"):
        errors.append("Start date is required")
    else:
        try:
            datetime.fromisoformat(data["startDate"])
        except ValueError:
            errors.append("Start date must be in YYYY-MM-DD format")

    if not data.get("endDate"):
        errors.append("End date is required")
    else:
        try:
            datetime.fromisoformat(data["endDate"])
        except ValueError:
            errors.append("End date must be in YYYY-MM-DD format")

    return errors


@app.route("/members", methods=["GET"])
def get_members():
    """Return a JSON array of all members."""
    try:
        members = Member.query.all()
        return jsonify([m.to_dict() for m in members])
    except Exception as e:
        app.logger.error(f"Error fetching members: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/members", methods=["POST"])
def add_member():
    """Create a new member. The request body must be JSON
    containing at least an id field (which must be unique) and
    any of the other member attributes used in the UI (name, phone,
    plan, startDate, endDate)."""
    try:
        data = request.get_json(force=True)

        # Validate input data
        errors = validate_member_data(data)
        if errors:
            return jsonify({"error": "Validation failed", "details": errors}), 400

        # Check if member with this ID already exists
        if Member.query.get(data["id"]):
            return jsonify({"error": "Member with this ID already exists"}), 409

        # Create new member
        member = Member(
            id=data["id"].strip(),
            name=data["name"].strip(),
            phone=data["phone"].strip(),
            plan=data["plan"],
            startDate=data["startDate"],
            endDate=data["endDate"],
        )

        db.session.add(member)
        db.session.commit()

        app.logger.info(f"Member created: {member.id}")
        return jsonify(member.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating member: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/members/<member_id>", methods=["PUT"])
def update_member(member_id):
    """Update an existing member by id. The body should be JSON with
    the fields to replace (excluding id, which comes from the URL)."""
    try:
        data = request.get_json(force=True)

        # Validate input data (allow partial updates)
        errors = validate_member_data(data, is_update=True)
        if errors:
            # Filter out ID-related errors for updates
            filtered_errors = [e for e in errors if "ID" not in e]
            if filtered_errors:
                return jsonify({"error": "Validation failed", "details": filtered_errors}), 400

        member = Member.query.get(member_id)
        if not member:
            return jsonify({"error": "Member not found"}), 404

        # Update fields
        for key, value in data.items():
            if hasattr(member, key) and key != 'id':
                if isinstance(value, str):
                    value = value.strip()
                setattr(member, key, value)

        db.session.commit()

        app.logger.info(f"Member updated: {member.id}")
        return jsonify(member.to_dict())

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating member {member_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/members/<member_id>", methods=["DELETE"])
def delete_member(member_id):
    """Remove a member by id."""
    try:
        member = Member.query.get(member_id)
        if not member:
            return jsonify({"error": "Member not found"}), 404

        db.session.delete(member)
        db.session.commit()

        app.logger.info(f"Member deleted: {member_id}")
        return "", 204

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting member {member_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "gym-management-api"})


if __name__ == "__main__":
    # Determine port and debug mode from environment
    port = int(os.getenv('PORT', 5002))
    debug = os.getenv('FLASK_ENV') != 'production'

    # When running directly, disable the reloader to avoid the child process
    # exiting unexpectedly in certain environments (e.g. CI, containers).
    # For production deployments, set FLASK_ENV=production which will also
    # disable debug mode.
    app.run(debug=debug, port=port, use_reloader=False)
