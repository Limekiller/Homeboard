from flask import Flask, Response, redirect, url_for
from flask_dance.contrib.google import make_google_blueprint, google

app = Flask(__name__)
app.secret_key = "kachow"
blueprint = make_google_blueprint(
        client_id="20479049328-ctm4rhe9051n1ht0h9dhn19rgptqp4i0.apps.googleusercontent.com",
        client_secret="1gjXPfPdjTTTC5NMaTTViEhD",
        scope=["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
        offline=True
    )
app.register_blueprint(blueprint, url_prefix="/login")

from app import routes


