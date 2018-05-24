from app import app
from flask import make_response, send_file, render_template, Flask, redirect, url_for, session
from flask_dance.contrib.google import make_google_blueprint, google
from flask_login import logout_user, login_required
import os


@app.route('/')
@app.route('/index')
def index():
    if not google.authorized:
        return render_template('home.html')

    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text

    widgets = os.listdir('app/widgets')
    return render_template('base.html', picture=resp.json()["picture"], widgets=widgets)

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/widget/<widget_name>/')
def widget(widget_name):
    return send_file('widgets/'+widget_name+'/base.html')

@app.route('/widget/<widget_name>/<file_name>')
def widget_script(widget_name, file_name):
    return send_file('widgets/'+widget_name+'/'+file_name)
