import sys, os

_current = os.path.abspath(os.path.dirname(__file__))
_backend = os.path.join(_current, '..', 'backend')
sys.path.insert(0, os.path.abspath(_backend))

if not os.environ.get('DATABASE_URL'):
    os.environ['DATABASE_URL'] = 'postgresql+pg8000://postgres.opcwwyvfrzcwypzvhnqu:B!smillahberkah@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
os.environ.setdefault('CORS_ORIGINS', '["https://denana-retail.vercel.app","http://localhost:5173","http://localhost:3000"]')

from app.main import app as fastapi_app

try:
    from mangum import Mangum
    app = Mangum(fastapi_app)
except ImportError:
    app = fastapi_app
