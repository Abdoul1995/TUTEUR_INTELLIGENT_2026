#!/usr/bin/env python3
"""
Script de test pour vérifier l'authentification API.
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_login():
    """Tester la connexion."""
    print("=" * 60)
    print("Test de connexion")
    print("=" * 60)
    
    url = f"{BASE_URL}/users/users/login/"
    data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            token = response.json().get('token')
            print(f"\n✅ Connexion réussie! Token: {token}")
            return token
        else:
            print(f"\n❌ Échec de la connexion")
            return None
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        return None

def test_me(token):
    """Tester la récupération du profil."""
    print("\n" + "=" * 60)
    print("Test de récupération du profil")
    print("=" * 60)
    
    url = f"{BASE_URL}/users/users/me/"
    headers = {
        "Authorization": f"Token {token}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            print("\n✅ Profil récupéré avec succès!")
        else:
            print("\n❌ Échec de la récupération du profil")
    except Exception as e:
        print(f"\n❌ Erreur: {e}")

def test_subjects():
    """Tester la récupération des matières."""
    print("\n" + "=" * 60)
    print("Test de récupération des matières")
    print("=" * 60)
    
    url = f"{BASE_URL}/lessons/subjects/"
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)[:500]}...")
        
        if response.status_code == 200:
            print("\n✅ Matières récupérées avec succès!")
        else:
            print("\n❌ Échec de la récupération des matières")
    except Exception as e:
        print(f"\n❌ Erreur: {e}")

def main():
    """Fonction principale."""
    print("\n🔍 Test de l'API Tuteur Intelligent\n")
    
    # Tester les matières (endpoint public)
    test_subjects()
    
    # Tester la connexion
    token = test_login()
    
    if token:
        # Tester le profil (endpoint protégé)
        test_me(token)
    
    print("\n" + "=" * 60)
    print("Tests terminés!")
    print("=" * 60)

if __name__ == '__main__':
    main()
