from app import app
app.run(ssl_context=('cert.pem', 'key.pem'))
