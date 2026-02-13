# Guide d'Installation - Tuteur Intelligent

Ce guide détaille les étapes pour installer et configurer l'application Tuteur Intelligent.

## 📋 Prérequis

### Logiciels requis

- **Python** 3.10 ou supérieur
- **Node.js** 18 ou supérieur
- **npm** 9 ou supérieur (inclus avec Node.js)
- **Git** (optionnel, pour cloner le projet)

### Vérification des prérequis

```bash
# Vérifier Python
python --version

# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier Git
git --version
```

## 🚀 Installation rapide

### Étape 1 : Télécharger le projet

Extrayez l'archive du projet dans le dossier de votre choix :

```bash
cd /chemin/vers/le/projet
```

### Étape 2 : Configurer le Backend (Django)

#### 2.1 Créer l'environnement virtuel

```bash
# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate

# Sur macOS/Linux :
source venv/bin/activate
```

Vous devriez voir `(venv)` apparaître dans votre terminal.

#### 2.2 Installer les dépendances Python

```bash
pip install -r requirements.txt
```

#### 2.3 Configurer la base de données

```bash
# Appliquer les migrations
python manage.py migrate

# Créer les tokens pour l'authentification API
python manage.py shell << EOF
from rest_framework.authtoken.models import Token
from users.models import User

# Créer un token pour chaque utilisateur existant
for user in User.objects.all():
    token, created = Token.objects.get_or_create(user=user)
    print(f"Token pour {user.username}: {token.key}")
EOF
```

#### 2.4 Créer un compte administrateur

```bash
python manage.py createsuperuser
```

Saisissez :
- Nom d'utilisateur : `admin`
- Email : `admin@example.com`
- Mot de passe : `admin123`
- Confirmer le mot de passe : `admin123`

#### 2.5 Charger les données de démonstration (optionnel)

```bash
python manage.py shell << EOF
from lessons.models import Subject, Chapter, Lesson
from exercises.models import Exercise

# Créer des matières
maths, _ = Subject.objects.get_or_create(
    name='Mathématiques',
    slug='mathematiques',
    defaults={'description': 'Cours de mathématiques', 'color': '#3B82F6'}
)

francais, _ = Subject.objects.get_or_create(
    name='Français',
    slug='francais',
    defaults={'description': 'Cours de français', 'color': '#EF4444'}
)

sciences, _ = Subject.objects.get_or_create(
    name='Sciences',
    slug='sciences',
    defaults={'description': 'Cours de sciences', 'color': '#10B981'}
)

print("Matières créées avec succès!")
EOF
```

### Étape 3 : Configurer le Frontend (React)

#### 3.1 Se déplacer dans le dossier frontend

```bash
cd frontend
```

#### 3.2 Installer les dépendances Node.js

```bash
npm install
```

Cette opération peut prendre quelques minutes.

### Étape 4 : Lancer l'application

#### 4.1 Démarrer le serveur backend

Dans un premier terminal (à la racine du projet) :

```bash
# S'assurer que l'environnement virtuel est activé
# Sur Windows : venv\Scripts\activate
# Sur macOS/Linux : source venv/bin/activate

python manage.py runserver
```

Le serveur backend démarre sur http://localhost:8000

#### 4.2 Démarrer le serveur frontend

Dans un deuxième terminal (dans le dossier frontend) :

```bash
cd frontend
npm run dev
```

Le serveur frontend démarre sur http://localhost:5173

### Étape 5 : Accéder à l'application

Ouvrez votre navigateur et accédez à :

- **Application** : http://localhost:5173
- **Administration** : http://localhost:8000/admin

## ⚙️ Configuration avancée

### Configuration de la base de données MySQL (Production)

1. Installer MySQL et créer une base de données :

```sql
CREATE DATABASE tuteur_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tuteur_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON tuteur_db.* TO 'tuteur_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Modifier le fichier `.env` :

```env
DB_NAME=tuteur_db
DB_USER=tuteur_user
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=3306
```

3. Installer le client MySQL pour Python :

```bash
pip install mysqlclient
```

4. Modifier `backend/settings.py` pour utiliser MySQL :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

### Configuration pour la production

1. Définir `DEBUG=False` dans `.env`
2. Configurer `ALLOWED_HOSTS` avec votre nom de domaine
3. Configurer un serveur web (Nginx/Apache)
4. Utiliser Gunicorn pour servir l'application Django
5. Configurer HTTPS avec Let's Encrypt

## 🔧 Dépannage

### Problème : `pip install` échoue

**Solution** : Mettez à jour pip
```bash
python -m pip install --upgrade pip
```

### Problème : `npm install` échoue

**Solution** : Effacez le cache et réessayez
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Problème : Port déjà utilisé

**Backend** : Changer le port
```bash
python manage.py runserver 8001
```

**Frontend** : Modifier `vite.config.ts`
```typescript
server: {
  port: 5174,
}
```

### Problème : Erreurs CORS

Vérifiez que `django-cors-headers` est installé et configuré dans `backend/settings.py` :

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

### Problème : Impossible de se connecter ou de s'inscrire

**Vérifiez les points suivants :**

1. **Le backend est démarré** : http://localhost:8000 doit être accessible
2. **Les migrations sont appliquées** : `python manage.py migrate`
3. **Les tokens sont créés** : Exécutez le script de création de tokens
4. **CORS est configuré** : Vérifiez `CORS_ALLOW_ALL_ORIGINS = True`

**Testez l'API avec curl :**
```bash
# Test de connexion
curl -X POST http://localhost:8000/api/users/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Test du profil (avec le token reçu)
curl http://localhost:8000/api/users/users/me/ \
  -H "Authorization: Token VOTRE_TOKEN"
```

### Problème : Les modifications backend ne s'affichent pas

1. **Redémarrez le serveur backend** après chaque modification
2. **Videz le cache du navigateur** (Ctrl+F5)
3. **Vérifiez la console du navigateur** pour les erreurs

## 📱 Déploiement

### Déploiement avec Docker (recommandé)

Un fichier `docker-compose.yml` sera bientôt disponible pour un déploiement simplifié.

### Déploiement manuel

1. Construire le frontend :
```bash
cd frontend
npm run build
```

2. Collecter les fichiers statiques Django :
```bash
python manage.py collectstatic
```

3. Configurer votre serveur web (Nginx) pour servir :
   - Les fichiers statiques Django
   - L'application React buildée
   - Le backend Django via Gunicorn

## 📞 Support

En cas de problème :

1. Consultez les logs du serveur backend
2. Consultez la console du navigateur pour le frontend
3. Vérifiez que tous les services sont démarrés
4. Contactez l'équipe de support

## 🔄 Mise à jour

Pour mettre à jour l'application :

```bash
# Mettre à jour le code
git pull origin main

# Mettre à jour les dépendances Python
pip install -r requirements.txt

# Mettre à jour les dépendances Node.js
cd frontend
npm install

# Appliquer les migrations
python manage.py migrate

# Redémarrer les serveurs
```

---

**Date de création** : Janvier 2026  
**Version** : 1.0.0
