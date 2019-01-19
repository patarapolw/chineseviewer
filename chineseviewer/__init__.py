from flask import Flask
from flask_cors import CORS
import os

from dotenv import load_dotenv
load_dotenv(dotenv_path="../.env")

app = Flask(__name__, static_url_path="")
CORS(app, resources={r"/api/*": {"origins": "http://localhost:" + os.getenv("TS_PORT", "3000")}})

from . import views
from . import api
