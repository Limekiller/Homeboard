from app import app
from flask import make_response, send_file, render_template, Flask, redirect, url_for, session, request, jsonify
from flask_dance.contrib.google import make_google_blueprint, google
import os
from datetime import datetime, timedelta, timezone
from apiclient.discovery import build
from urllib.parse import quote_plus

@app.route('/')
@app.route('/index')
def index():
    if not google.authorized:
        return render_template('home.html')

    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text

#    cal = google.get("/calendar/v3/calendars/"+resp.json()["email"]+"/events?timeMin="+lower_cal_bound+"&")
#    assert cal.ok, cal.text
#    print(cal.json())

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
        cid = quote_plus(resp.json()["email"])
    if not base:
        base = "/calendar/v3/calendars/"

    cal = base+cid
    cal = google.get(cal+'/'+c)
    assert cal.ok, cal.text
    return jsonify(cal.text);


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
