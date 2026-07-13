import sys, os, json, traceback

_current = os.path.abspath(os.path.dirname(__file__))
_backend = os.path.join(_current, 'backend')
sys.path.insert(0, os.path.abspath(_backend))

if not os.environ.get('DATABASE_URL'):
    os.environ.setdefault(
        'DATABASE_URL',
        'postgresql+pg8000://postgres.opcwwyvfrzcwypzvhnqu:B!smillahberkah@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
    )

os.environ.setdefault('CORS_ORIGINS', '["https://denana-retail.vercel.app", "http://localhost:5173", "http://localhost:3000"]')

try:
    from app.main import app as fastapi_app
    from mangum import Mangum
    app = Mangum(fastapi_app)
except Exception as e:
    error_detail = {
        'error': str(e),
        'traceback': traceback.format_exc(),
        'python_path': sys.path,
        'cwd': os.getcwd(),
        'files_root': os.listdir('.') if os.path.exists('.') else [],
        'backend_exists': os.path.exists(os.path.abspath(_backend)),
    }
    print(f'STARTUP ERROR: {json.dumps(error_detail, indent=2)}')

    async def app(scope, receive, send):
        if scope['type'] == 'http':
            body = json.dumps(error_detail, indent=2).encode()
            await send({
                'type': 'http.response.start',
                'status': 500,
                'headers': [[b'content-type', b'application/json'], [b'access-control-allow-origin', b'*']],
            })
            await send({'type': 'http.response.body', 'body': body})
