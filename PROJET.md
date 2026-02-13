# Résumé du Projet - Tuteur Intelligent

## 📋 Description

**Tuteur Intelligent** est une application éducative complète conçue pour accompagner les élèves du primaire et du secondaire dans leur apprentissage quotidien. Elle agit comme un assistant pédagogique personnalisé, disponible à tout moment, capable d'expliquer les leçons, proposer des exercices adaptés et suivre la progression de chaque apprenant.

## 🎯 Objectifs

- Offrir un accompagnement pédagogique personnalisé à chaque élève
- Réduire les difficultés scolaires et le décrochage
- Compléter le travail des enseignants sans le remplacer

## ✨ Fonctionnalités principales

### 1. Leçons interactives
- Explications des leçons selon le programme officiel
- Contenu multimédia (texte, vidéo, images)
- Ressources complémentaires téléchargeables

### 2. Exercices adaptatifs
- Exercices interactifs corrigés automatiquement
- Plusieurs types d'exercices (QCM, texte, numérique, association)
- Indices disponibles pour aider l'élève

### 3. Quiz évaluatifs
- Quiz composés de plusieurs exercices
- Score et pourcentage de réussite
- Temps limité optionnel

### 4. Adaptation du niveau
- Contenu adapté selon les performances de l'élève
- Niveaux du CP1 à la Terminale
- Difficulté ajustable (facile, moyen, difficile)

### 5. Révision intelligente
- Identification des notions non maîtrisées
- Recommandations de leçons et exercices ciblés
- Zones faibles identifiées automatiquement

### 6. Suivi de progression
- Tableau de bord personnel
- Statistiques détaillées
- Badges et récompenses
- Série de jours consécutifs

### 7. Mode hors ligne
- Accès aux contenus sans connexion (prévu pour le futur)

## 🛠 Architecture technique

### Backend (Django)

```
backend/
├── settings.py          # Configuration Django
├── urls.py              # URLs principales
├── wsgi.py              # Entry point WSGI
└── asgi.py              # Entry point ASGI

users/                   # Gestion des utilisateurs
├── models.py            # Modèle User personnalisé
├── serializers.py       # Sérialiseurs API
├── views.py             # ViewSets API
├── urls.py              # Routes API
└── admin.py             # Configuration admin

lessons/                 # Gestion des leçons
├── models.py            # Subject, Chapter, Lesson
├── serializers.py       # Sérialiseurs
├── views.py             # ViewSets
├── urls.py              # Routes
└── admin.py             # Admin

exercises/               # Gestion des exercices
├── models.py            # Exercise, Quiz, Attempts
├── serializers.py       # Sérialiseurs
├── views.py             # ViewSets
├── urls.py              # Routes
└── admin.py             # Admin

progress/                # Suivi de progression
├── models.py            # Progress, Achievements
├── serializers.py       # Sérialiseurs
├── views.py             # ViewSets
├── urls.py              # Routes
└── admin.py             # Admin
```

### Frontend (React + TypeScript)

```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Layout.tsx   # Layout principal
│   │   └── ProtectedRoute.tsx
│   │
│   ├── pages/           # Pages de l'application
│   │   ├── Home.tsx     # Page d'accueil
│   │   ├── Login.tsx    # Connexion
│   │   ├── Register.tsx # Inscription
│   │   ├── Dashboard.tsx # Tableau de bord
│   │   ├── Lessons.tsx  # Liste des leçons
│   │   ├── LessonDetail.tsx # Détail d'une leçon
│   │   ├── Exercises.tsx # Liste des exercices
│   │   ├── ExerciseDetail.tsx # Exercice interactif
│   │   ├── Quizzes.tsx  # Liste des quiz
│   │   ├── QuizDetail.tsx # Quiz interactif
│   │   ├── Progress.tsx # Page de progression
│   │   └── Profile.tsx  # Profil utilisateur
│   │
│   ├── contexts/        # Contexts React
│   │   └── AuthContext.tsx # Authentification
│   │
│   ├── services/        # Services API
│   │   └── api.ts       # Client API
│   │
│   ├── types/           # Types TypeScript
│   │   └── index.ts     # Définitions de types
│   │
│   ├── App.tsx          # Composant racine
│   ├── main.tsx         # Point d'entrée
│   └── index.css        # Styles globaux
│
├── package.json         # Dépendances
├── tsconfig.json        # Configuration TypeScript
├── vite.config.ts       # Configuration Vite
└── tailwind.config.js   # Configuration Tailwind
```

## 📊 Modèles de données

### Utilisateurs
- **User** : Utilisateur personnalisé (élève, enseignant, parent, admin)
- **ParentStudentLink** : Lien entre parent et élève

### Leçons
- **Subject** : Matière scolaire
- **Chapter** : Chapitre d'une matière
- **Lesson** : Leçon d'un chapitre
- **LessonResource** : Ressource complémentaire
- **LessonView** : Suivi des vues de leçons

### Exercices
- **Exercise** : Exercice individuel
- **ExerciseAttempt** : Tentative d'exercice
- **Quiz** : Quiz composé de plusieurs exercices
- **QuizAttempt** : Tentative de quiz

### Progression
- **StudentProgress** : Progression globale d'un élève
- **SubjectProgress** : Progression par matière
- **Skill** : Compétence à maîtriser
- **SkillMastery** : Maîtrise d'une compétence
- **WeakArea** : Zone faible identifiée
- **Achievement** : Badge de réussite
- **StudentAchievement** : Badge obtenu par un élève
- **StudySession** : Session d'étude

## 🔌 API Endpoints

### Authentification
- `POST /api/users/users/login/` - Connexion
- `POST /api/users/users/register/` - Inscription
- `POST /api/users/users/logout/` - Déconnexion
- `GET /api/users/users/me/` - Profil utilisateur

### Leçons
- `GET /api/lessons/subjects/` - Liste des matières
- `GET /api/lessons/chapters/` - Liste des chapitres
- `GET /api/lessons/lessons/` - Liste des leçons
- `GET /api/lessons/lessons/{slug}/` - Détail d'une leçon
- `POST /api/lessons/lessons/{slug}/mark_viewed/` - Marquer comme vue
- `GET /api/lessons/lessons/recommended/` - Leçons recommandées

### Exercices
- `GET /api/exercises/exercises/` - Liste des exercices
- `GET /api/exercises/exercises/{id}/` - Détail d'un exercice
- `POST /api/exercises/exercises/{id}/submit/` - Soumettre une réponse
- `GET /api/exercises/quizzes/` - Liste des quiz
- `POST /api/exercises/quizzes/{id}/start/` - Démarrer un quiz
- `POST /api/exercises/quizzes/{id}/submit/` - Soumettre un quiz

### Progression
- `GET /api/progress/dashboard/` - Tableau de bord
- `GET /api/progress/stats/` - Statistiques
- `GET /api/progress/subjects/` - Progression par matière
- `GET /api/progress/weak-areas/` - Points faibles
- `GET /api/progress/achievements/` - Badges disponibles
- `GET /api/progress/my-achievements/` - Mes badges

## 🚀 Démarrage rapide

### 1. Backend

```bash
# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Lancer le serveur
python manage.py runserver
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Accéder à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:8000/api/
- Admin Django : http://localhost:8000/admin

## 👤 Compte de démonstration

- **Nom d'utilisateur** : admin
- **Mot de passe** : admin123

## 📦 Données initiales

Le script `init_data.py` crée automatiquement :
- 5 matières (Mathématiques, Français, Sciences, Histoire-Géographie, Anglais)
- 12 chapitres
- 4 leçons
- 3 exercices
- 5 badges

## 🔧 Technologies utilisées

### Backend
- Python 3.12
- Django 6.0
- Django REST Framework 3.16
- Django CORS Headers 4.9
- SQLite (développement)

### Frontend
- React 18.2
- TypeScript 5.0
- Vite 5.0
- Tailwind CSS 3.4
- React Router 6.20
- Axios 1.6
- Lucide React (icônes)
- Recharts (graphiques)

## 📝 Fichiers importants

- `README.md` - Documentation complète
- `INSTALL.md` - Guide d'installation détaillé
- `requirements.txt` - Dépendances Python
- `frontend/package.json` - Dépendances Node.js
- `.env.example` - Exemple de configuration
- `init_data.py` - Script d'initialisation des données

## 🎨 Interface utilisateur

L'application dispose d'une interface moderne et responsive avec :
- Design épuré et professionnel
- Palette de couleurs cohérente (bleu primaire, violet secondaire)
- Composants réutilisables
- Animations fluides
- Support mobile complet

## 🔐 Sécurité

- Authentification Django intégrée
- CORS configuré pour le développement
- Protection CSRF
- Validation des données côté serveur

## 🚀 Fonctionnalités futures (roadmap)

- [ ] Mode hors ligne complet
- [ ] Application mobile (React Native)
- [ ] Intelligence artificielle pour l'analyse des erreurs
- [ ] Chatbot pédagogique
- [ ] Support multilingue
- [ ] Intégration des langues locales
- [ ] Système de notifications push
- [ ] Export des rapports de progression
- [ ] Intégration avec les ENT (Espaces Numériques de Travail)

## 📞 Contact

Pour toute question ou suggestion concernant ce projet, veuillez contacter l'équipe de développement.

---

**Version** : 1.0.0  
**Date de création** : Janvier 2026  
**Licence** : MIT
