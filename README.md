<<<<<<< HEAD
# TUTEUR_INTELLIGENT_2026
PLATEFORME DE GESTION INTELLIGENTE DE ELEVES DE TOUTE CATHEGORIE
=======
# Tuteur Intelligent

Application de tuteur intelligent accessible à tous - Une solution éducative numérique conçue pour accompagner les élèves du primaire et du secondaire dans leur apprentissage quotidien.

![Tuteur Intelligent](https://img.shields.io/badge/Tuteur-Intelligent-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

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
- **Mode hors ligne** : Accès aux contenus sans connexion internet

### Pour les enseignants
- **Gestion des contenus** : Création et modification de leçons et exercices
- **Suivi des élèves** : Visualisation de la progression des élèves
- **Analyse des performances** : Identification des difficultés collectives

### Pour les parents
- **Suivi de l'enfant** : Visualisation de la progression de l'élève
- **Notifications** : Alertes sur les points à améliorer

## 🛠 Technologies

### Backend
- **Django 5.0** - Framework web Python
- **Django REST Framework** - API RESTful
- **Django CORS Headers** - Gestion des CORS
- **SQLite** - Base de données (développement)
- **MySQL** - Base de données (production)

### Frontend
- **React 18.2** - Bibliothèque JavaScript
- **TypeScript 5.0** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS 3.4** - Framework CSS
- **React Router 6** - Routing
- **Axios** - Client HTTP
- **Lucide React** - Icônes
- **Recharts** - Graphiques

## 🚀 Installation

### Prérequis
- Python 3.10+
- Node.js 18+
- npm ou yarn
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/abdoul1995/TUTEUR_INTELLIGENT_2026.git
cd TUTEUR_INTELLIGENT_2026
```

### 2. Configuration du Backend

#### Créer un environnement virtuel
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Installer les dépendances
```bash
pip install -r requirements.txt
```

#### Configurer les variables d'environnement
```bash
cp .env.example .env
# Modifier le fichier .env avec vos paramètres
```

#### Appliquer les migrations
```bash
python manage.py migrate
```

#### Créer un superutilisateur
```bash
python manage.py createsuperuser
```

#### Charger les données initiales (optionnel)
```bash
python manage.py loaddata fixtures/initial_data.json
```

### 3. Configuration du Frontend

```bash
cd frontend
npm install
```

#### Configurer les variables d'environnement
```bash
cp .env.example .env
# Modifier le fichier .env avec vos paramètres
```

## ▶️ Utilisation

### Démarrer le serveur backend

```bash
# Depuis la racine du projet
python manage.py runserver
```

Le serveur backend sera accessible à l'adresse : http://localhost:8000

### Démarrer le serveur frontend

```bash
# Depuis le dossier frontend
cd frontend
npm run dev
```

Le serveur frontend sera accessible à l'adresse : http://localhost:5173

### Accéder à l'administration Django

http://localhost:8000/admin

### Compte de démonstration

- **Nom d'utilisateur** : admin
- **Mot de passe** : admin123

## 📁 Structure du projet

```
tuteur-intelligent/
├── backend/                    # Configuration Django
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── users/                      # App utilisateurs
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── lessons/                    # App leçons
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── exercises/                  # App exercices
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── progress/                   # App progression
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── pages/             # Pages de l'application
│   │   ├── contexts/          # Contexts React
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Services API
│   │   ├── types/             # Types TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── manage.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## 📚 API Documentation

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/users/users/login/` | Connexion |
| POST | `/api/users/users/register/` | Inscription |
| POST | `/api/users/users/logout/` | Déconnexion |
| GET | `/api/users/users/me/` | Profil utilisateur |

### Leçons

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/lessons/subjects/` | Liste des matières |
| GET | `/api/lessons/chapters/` | Liste des chapitres |
| GET | `/api/lessons/lessons/` | Liste des leçons |
| GET | `/api/lessons/lessons/{slug}/` | Détail d'une leçon |
| POST | `/api/lessons/lessons/{slug}/mark_viewed/` | Marquer comme vue |

### Exercices

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/exercises/exercises/` | Liste des exercices |
| GET | `/api/exercises/exercises/{id}/` | Détail d'un exercice |
| POST | `/api/exercises/exercises/{id}/submit/` | Soumettre une réponse |
| GET | `/api/exercises/quizzes/` | Liste des quiz |
| POST | `/api/exercises/quizzes/{id}/start/` | Démarrer un quiz |
| POST | `/api/exercises/quizzes/{id}/submit/` | Soumettre un quiz |

### Progression

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/progress/dashboard/` | Tableau de bord |
| GET | `/api/progress/stats/` | Statistiques |
| GET | `/api/progress/subjects/` | Progression par matière |
| GET | `/api/progress/weak-areas/` | Points faibles |
| GET | `/api/progress/my-achievements/` | Badges obtenus |

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout de ma fonctionnalite'`)
4. Poussez vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développement** : Votre équipe
- **Design** : Votre équipe design
- **Pédagogie** : Experts en éducation

## 📞 Contact

Pour toute question ou suggestion :

- Email : salgo397@gmail.com
- Site web : 

## 🙏 Remerciements

- Tous les contributeurs du projet
- Les enseignants et élèves qui ont testé l'application
- La communauté open source

---

<p align="center">
  Fait avec ❤️ pour l'éducation
</p>
>>>>>>> 27e5663 (integration de l'IA)
