from app import app
from flask import render_template, Flask, redirect, url_for, session
from flask_dance.contrib.google import make_google_blueprint, google
from flask_login import logout_user, login_required

@app.route('/')
@app.route('/index')
def index():
    if not google.authorized:
        return render_template('home.html')
        # return redirect(url_for("google.login"))
    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text
    # return "You are {email} on Google".format(email=resp.json()["email"])
    return render_template('base.html', name=resp.json()["name"])

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')
