from flask import Flask
import socket

app = Flask(__name__)

hostname = socket.gethostname()
ipv4 = socket.gethostbyname(hostname)

message = f'<p>Hostname: {hostname}</p><p>IPv4 Address: {ipv4}</p>\n'

@app.route("/")
def root():
    return message
