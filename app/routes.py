from app import app
from flask import render_template, Flask, redirect, url_for
from flask_dance.contrib.google import make_google_blueprint, google

@app.route('/')
@app.route('/index')
def index():
    if not google.authorized:
        return redirect(url_for("google.login"))
    resp = google.get("/ouath/v1/userinfo")
    assert resp.ok, resp.text
    return "You are {email} on Google".format(email=resp.json()["email"])
    # return render_template('base.html')
