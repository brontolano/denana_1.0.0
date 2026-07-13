import sys, os

backend_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'backend')
sys.path.insert(0, backend_dir)

if not os.environ.get('DATABASE_URL'):
    os.environ.setdefault(
        'DATABASE_URL',
        'postgresql+pg8000://postgres.opcwwyvfrzcwypzvhnqu:B!smillahberkah@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
    )

from app.main import app
