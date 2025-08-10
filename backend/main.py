from flask import Flask, request, jsonify, send_from_directory
from config import app, db
from models import Contact
import os


@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})


@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    password = request.json.get("password")
    print("Request JSON:", request.json)


    if not first_name or not last_name or not email or not password:
        return (
            jsonify({"message": "You must include a first name, last name, email, and your password"}),
            400,
        )

    new_contact = Contact(first_name=first_name, last_name=last_name, email=email, password=password)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created!"}), 201


@app.route("/update_contact/<int:user_id>",methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()

    return jsonify({"message": "Usr updated."}), 200

@app.route("/login_contact",methods = ["POST"])
#做一个与已有contact比对的校验
def login_contact():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    contact = Contact.query.filter_by(email=email).first()
    json_contact = contact.to_json()
    print(json_contact)

    if not contact:
        return jsonify({"message": "User not existing with this email"}), 404
    
    if password == contact.password:
        return jsonify(json_contact), 200
    else:
        return jsonify({"message": "Incorrect password"}), 401

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def serve_frontend(path):
#     dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
#     file_path = os.path.join(dist_dir, path)

#     if path != "" and os.path.exists(file_path):
#         return send_from_directory(dist_dir, path)
#     else:
#         return send_from_directory(dist_dir, "index.html")
    
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    # /home/ubuntu/FLASK-REACT-FULL-STACK-APP/frontend/dist
    dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
    file_path = os.path.join(dist_dir, path)

    if path and os.path.exists(file_path):
        return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, "index.html")
    


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
    # app.run(host='0.0.0.0', port=5000)

