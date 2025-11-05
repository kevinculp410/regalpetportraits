import argparse
import os
from http.server import SimpleHTTPRequestHandler, HTTPServer


class SPARequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        # Python 3.7+ supports passing directory to SimpleHTTPRequestHandler
        self.base_dir = directory or os.getcwd()
        super().__init__(*args, directory=self.base_dir, **kwargs)

    def _file_exists(self, path):
        full_path = os.path.join(self.base_dir, path.lstrip('/'))
        return os.path.isfile(full_path)

    def do_GET(self):
        # Serve existing files, otherwise fallback to index.html for SPA routes
        if self.path == '/' or self._file_exists(self.path):
            return super().do_GET()
        # Fallback
        index_path = os.path.join(self.base_dir, 'index.html')
        if os.path.isfile(index_path):
            try:
                with open(index_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            except Exception:
                self.send_error(500, 'Error reading index.html')
        else:
            self.send_error(404, 'index.html not found')


def run_server(port, directory):
    handler_class = lambda *args, **kwargs: SPARequestHandler(*args, directory=directory, **kwargs)
    httpd = HTTPServer(('0.0.0.0', port), handler_class)
    print(f"SPA server running on http://localhost:{port}/ serving directory '{directory}'")
    httpd.serve_forever()


def main():
    parser = argparse.ArgumentParser(description='Simple SPA server with index.html fallback.')
    parser.add_argument('--port', type=int, default=3007, help='Port to listen on')
    parser.add_argument('--dir', type=str, default='public', help='Directory to serve')
    args = parser.parse_args()

    directory = os.path.abspath(args.dir)
    if not os.path.isdir(directory):
        raise SystemExit(f"Directory does not exist: {directory}")

    run_server(args.port, directory)


if __name__ == '__main__':
    main()