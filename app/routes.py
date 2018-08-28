from app import app
from flask import make_response, send_file, render_template, Flask, redirect, url_for, session, request, jsonify
from flask_dance.contrib.google import make_google_blueprint, google
from datetime import datetime, timedelta, timezone
from apiclient.discovery import build
from urllib.parse import quote_plus
import os, requests


@app.route('/')
@app.route('/index')
def index():
    if not google.authorized:
        return render_template('home.html')

    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text

    widgets = os.listdir('./app/widgets')
    return render_template('base.html', picture=resp.json()["picture"], widgets=widgets)


@app.route('/calendar')
def add_numbers():

    c = request.args.get('c', None, type=str)
    cid = request.args.get('cid', None, type=str)
    base = request.args.get('base', None, type=str)

    localtime = (datetime.now(timezone.utc) - timedelta(days=120)).astimezone().isoformat()
    lower_cal_bound = quote_plus(str(localtime))

    resp = google.get("/oauth2/v2/userinfo")
    if not cid:
        cid = resp.json()["email"]
    if not base:
        base = "/calendar/v3/calendars/"

    cal = base+quote_plus(cid)
    cal = google.get(cal+'/'+c)
    assert cal.ok, cal.text
    return jsonify(cal.text);


@app.route('/drive')
def google_drive_api():

    c = request.args.get('c', None, type=str)
    base = request.args.get('base', None, type=str)

    resp = google.get("/oauth2/v2/userinfo")
    if not base:
        base = "/drive/v3/"

    drive = google.get(base+c)
    assert drive.ok, drive.text
    return jsonify(drive.text);


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

@app.route('/load')
def load_data():
    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text

    user_id = resp.json()["id"]
    print(user_id);
    if os.path.exists("./app/user_data/"+user_id):
        data = open("./app/user_data/"+user_id, 'r').read()
        return data
    else:
        return "null"


@app.route('/save', methods=['GET', 'POST'])
def save_data():
    data = request.form.get('page_data')
    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text

    user_id = resp.json()["id"]
    f = open("./app/user_data/"+user_id, 'w')
    f.write(data);
    return "saved"



