#!/usr/bin/env python3
"""
Script pour démarrer le backend et le frontend de Tuteur Intelligent.
"""

import subprocess
import sys
import os
import time
import signal

def start_backend():
    """Démarrer le serveur Django."""
    print("🚀 Démarrage du backend Django...")
    backend_process = subprocess.Popen(
        [sys.executable, 'manage.py', 'runserver', '8000'],
        cwd=os.path.dirname(os.path.abspath(__file__)),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(2)
    print("✅ Backend démarré sur http://localhost:8000")
    return backend_process

def start_frontend():
    """Démarrer le serveur React."""
    print("🚀 Démarrage du frontend React...")
    frontend_process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend'),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(3)
    print("✅ Frontend démarré sur http://localhost:5173")
    return frontend_process

def main():
    """Fonction principale."""
    print("=" * 60)
    print("Démarrage de Tuteur Intelligent")
    print("=" * 60)
    print()
    
    backend = None
    frontend = None
    
    try:
        backend = start_backend()
        frontend = start_frontend()
        
        print()
        print("=" * 60)
        print("✅ Les serveurs sont démarrés!")
        print("=" * 60)
        print()
        print("📱 Application: http://localhost:5173")
        print("🔌 API Backend: http://localhost:8000/api/")
        print("🔑 Admin:       http://localhost:8000/admin")
        print()
        print("Identifiants de démo:")
        print("  - Username: admin")
        print("  - Password: admin123")
        print()
        print("Appuyez sur Ctrl+C pour arrêter les serveurs")
        print()
        
        # Attendre l'interruption
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print()
        print("\n🛑 Arrêt des serveurs...")
        
        if frontend:
            frontend.terminate()
            print("✅ Frontend arrêté")
            
        if backend:
            backend.terminate()
            print("✅ Backend arrêté")
            
        print("\n👋 À bientôt!")
        sys.exit(0)

if __name__ == '__main__':
    main()
