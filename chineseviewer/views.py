from flask import send_from_directory

from . import app


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/js/<path:path>")
def send_js(path):
    return send_from_directory("static/js", path)


@app.route("/css/<path:path>")
def send_css(path):
    return send_from_directory("static/css", path)


@app.route("/img/<path:path>")
def send_img(path):
    return send_from_directory("static/img", path)


@app.route("/fonts/<path:path>")
def send_fonts(path):
    return send_from_directory("static/fonts", path)
