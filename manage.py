#!/usr/bin/env python3
"""
Utility script to manage the backend
"""

import subprocess
import sys
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).parent / 'backend'

def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n{'='*60}")
    print(f"🔧 {description}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, cwd=BACKEND_DIR)
    if result.returncode != 0:
        print(f"❌ Failed: {description}")
        sys.exit(1)
    print(f"✅ Success: {description}")

def install_deps():
    """Install Python dependencies"""
    run_command(
        [sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
        'Installing Python dependencies'
    )

def init_database():
    """Initialize the database"""
    run_command(
        [sys.executable, 'init_db.py'],
        'Initializing database'
    )

def run_dev():
    """Run development server"""
    print(f"\n{'='*60}")
    print("🚀 Starting Python backend development server")
    print(f"{'='*60}")
    print("Backend will run on http://localhost:5000")
    print("Press Ctrl+C to stop\n")
    subprocess.run(
        [sys.executable, 'app.py'],
        cwd=BACKEND_DIR
    )

def setup():
    """Full setup"""
    print("🔄 Running full backend setup...")
    install_deps()
    init_database()
    print(f"\n{'='*60}")
    print("✅ Backend setup complete!")
    print(f"{'='*60}")
    print("Next steps:")
    print("1. Configure .env file with your database and API keys")
    print("2. Run: python manage.py dev")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python manage.py <command>")
        print("\nAvailable commands:")
        print("  setup       - Install dependencies and initialize database")
        print("  install     - Install Python dependencies only")
        print("  init-db     - Initialize database only")
        print("  dev         - Run development server")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'setup':
        setup()
    elif command == 'install':
        install_deps()
    elif command == 'init-db':
        init_database()
    elif command == 'dev':
        run_dev()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
