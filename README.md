# Tuteur Intelligent

Application de tuteur intelligent accessible à tous - Une solution éducative numérique conçue pour accompagner les élèves du primaire et du secondaire dans leur apprentissage quotidien.

![Tuteur Intelligent](https://img.shields.io/badge/Tuteur-Intelligent-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Flutter](https://img.shields.io/badge/Flutter-3.0+-blue)

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Contribution](#contribution)
- [Licence](#licence)

## ✨ Fonctionnalités

### Pour les élèves
- **Leçons interactives** : Accès à des leçons conformes au programme officiel
- **Exercices adaptatifs** : Pratique avec des exercices qui s'adaptent au niveau de l'élève
- **Quiz évaluatifs** : Testez vos connaissances avec des quiz interactifs
- **Révision intelligente** : Identification des points faibles et recommandations personnalisées
- **Suivi de progression** : Visualisation de l'évolution et célébration des réussites
- **Tutorat IA** : Communication avec un système de tutorat basé sur l'IA (Mobile & Web)

### Pour les enseignants & Parents
- **Gestion des contenus** : Création et modification de leçons et exercices
- **Suivi des élèves** : Visualisation de la progression
- **Analyse des performances** : Identification des difficultés

## 🛠 Technologies

### Backend
- **Django 5.0** & **Django REST Framework**
- **MySQL** (Développement) & **PostgreSQL** (Production)
- **OpenAI/Groq** : Intégration de l'IA

### Frontend Web
- **React 18.2** & **TypeScript**
- **Tailwind CSS** & **Vite**

### Application Mobile
- **Flutter** & **Dart**
- **Riverpod** : Gestion d'état
- **Flutter Secure Storage** : Sécurité des tokens

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/abdoul1995/TUTEUR_INTELLIGENT_2026.git
cd TUTEUR_INTELLIGENT_2026
```

### 2. Backend (Django)
```bash
# Activer l'environnement virtuel existant (ou en créer un)
source venv/bin/activate 
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Web (React)
```bash
cd frontend
npm install
npm run dev
```

### 4. Application Mobile (Flutter)
```bash
cd mobile_app
flutter pub get
# Assurez-vous d'avoir un émulateur ou appareil connecté
flutter run 
ou
flutter run -d <le nom de l'émulateur ou appareil connecté>
```

## 📁 Structure du projet

```
tuteur-intelligent/
├── backend/            # Configuration Django
├── users/             # App utilisateurs (Auth, Profils)
├── lessons/           # App leçons (Matières, Chapitres)
├── exercises/         # App exercices (Questions CLASSIQUES, QCM)
├── progress/          # App progression (Stats, Badges)
├── frontend/          # Application React (Web)
│   └── src/           # Composants, Pages, Services
├── mobile_app/        # Application Flutter (Mobile)
│   ├── lib/           # Code source Dart
│   │   ├── models/    # Modèles de données
│   │   ├── screens/   # Interfaces utilisateur
│   │   └── services/  # Communication API
│   └── pubspec.yaml   # Dépendances Flutter
├── manage.py
└── requirements.txt
```

## 🤝 Contribution

Les contributions sont les bienvenues ! 
1. Fork le projet
2. Créez une branche (`feature/ma-fonctionnalite`)
3. Committez vos changements
4. Ouvrez une Pull Request

## 📝 Licence


