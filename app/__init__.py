from flask import Flask, Response, redirect, url_for
from flask_dance.contrib.google import make_google_blueprint, google

app = Flask(__name__)
app.secret_key = "kachow"
blueprint = make_google_blueprint(
        client_id="524254394319-h2h10sm63gmp4k643ugcn0mv05us1d1s.apps.googleusercontent.com",
        client_secret="sKXfKW6J7NebcGekoLOPy_y7",
        scope=["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly", ],
        offline=True,
        reprompt_consent=True
    )
app.register_blueprint(blueprint, url_prefix="/login")

from app import routes
