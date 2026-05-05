from app import create_app
from app.utils.seed_data import seed_database

app = create_app()

with app.app_context():
    seed_database()