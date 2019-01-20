from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

from dotenv import load_dotenv
load_dotenv(dotenv_path="../.env")

app = Flask(__name__, static_url_path="")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI", "postgresql://localhost:5432/chineseviewer")

CORS(app, resources={r"/api/*": {"origins": "http://localhost:" + os.getenv("TS_PORT", "3000")}})
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from . import views
from . import api
from . import database
