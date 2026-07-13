from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        result = {
            'status': 'ok',
            'message': 'Python on Vercel works!',
            'path': self.path
        }
        self.wfile.write(json.dumps(result).encode())

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode() if content_length > 0 else ''
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        result = {
            'status': 'ok',
            'path': self.path,
            'body': body[:200]
        }
        self.wfile.write(json.dumps(result).encode())
