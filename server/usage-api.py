#!/usr/bin/env python3
"""星风暴人物卡片生成器 · 模板使用计数 API（零依赖，JSON 文件存储）

GET  /api/usage            -> { ok: true, data: { "group:tpl": count, ... } }
POST /api/usage {group,tpl} -> { ok: true, count: N }
"""
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DATA_FILE = os.environ.get('USAGE_DATA_FILE', '/opt/herocard/usage.json')
PORT = int(os.environ.get('USAGE_PORT', '3210'))

lock = threading.Lock()


def load_data():
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def save_data(data):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    tmp = DATA_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)
    os.replace(tmp, DATA_FILE)


class Handler(BaseHTTPRequestHandler):

    def _json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split('?')[0] == '/api/usage':
            with lock:
                data = dict(load_data())
            self._json({'ok': True, 'data': data})
        else:
            self._json({'ok': False, 'error': 'not found'}, 404)

    def do_POST(self):
        if self.path.split('?')[0] != '/api/usage':
            self._json({'ok': False, 'error': 'not found'}, 404)
            return
        try:
            length = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
            group = str(payload.get('group', ''))[:20].strip()
            tpl = str(payload.get('tpl', ''))[:40].strip()
            if not group or not tpl:
                self._json({'ok': False, 'error': 'invalid params'}, 400)
                return
            key = group + ':' + tpl
            with lock:
                data = load_data()
                data[key] = int(data.get(key, 0)) + 1
                save_data(data)
                count = data[key]
            self._json({'ok': True, 'count': count})
        except Exception as e:  # noqa: BLE001
            self._json({'ok': False, 'error': str(e)}, 500)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, fmt, *args):  # 静默访问日志
        pass


if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', PORT), Handler)
    print('usage api listening on 127.0.0.1:%d' % PORT)
    server.serve_forever()
