from flask import Flask, jsonify, render_template
from models import db, Card
import json
import os

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "instance", "tcg.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/history")
def history():
    return render_template("history.html")

@app.route("/api/card/<class_id>")
def card_detail(class_id):
    card = Card.query.filter_by(class_id=class_id).first()
    if not card:
        return jsonify({"error": "Card not found"}), 404
    return jsonify({
        "id": card.id,
        "name": card.name,
        "mana_cost": card.mana_cost,
        "cmc": card.cmc,
        "type_line": card.type_line,
        "oracle_text": card.oracle_text,
        "power": card.power,
        "toughness": card.toughness,
        "class_id": card.class_id
    })


def seed_database():
    """Import card data from JSON into the SQL database."""
    try:
        with open("card_data.json", "r", encoding="utf-8") as f:
            cards_data = json.load(f)

        for key, data in cards_data.items():
            exists = Card.query.filter_by(class_id=key).first()
            if not exists:
                new_card = Card(
                    name=data.get("name"),
                    mana_cost=data.get("mana_cost"),
                    cmc=data.get("cmc"),
                    type_line=data.get("type_line"),
                    oracle_text=data.get("oracle_text"),
                    power=data.get("power"),
                    toughness=data.get("toughness"),
                    class_id=key
                )
                db.session.add(new_card)

        db.session.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.session.rollback()


if __name__ == "__main__":
    os.makedirs(os.path.join(basedir, "instance"), exist_ok=True)
    with app.app_context():
        db.create_all()
        seed_database()
    app.run(debug=True, host="0.0.0.0")
