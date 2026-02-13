# Corrections effectuées - Tuteur Intelligent

Ce document récapitule tous les problèmes identifiés et les corrections apportées.

## 🔍 Problèmes identifiés

### 1. Problème CORS (Cross-Origin Resource Sharing)
**Symptôme** : Le frontend ne peut pas communiquer avec le backend
**Cause** : Configuration CORS incomplète

### 2. Problème d'authentification
**Symptôme** : Impossible de créer un compte ou de se connecter
**Cause** : 
- CSRF middleware bloquait les requêtes POST
- Pas de système de token pour l'authentification API
- Le frontend attendait des tokens mais le backend utilisait des sessions

### 3. Problème de synchronisation
**Symptôme** : Les modifications backend ne s'affichent pas sur le frontend
**Cause** : Problèmes de cache et de configuration

## ✅ Corrections appliquées

### 1. Configuration Django (`backend/settings.py`)

#### Désactivation de CSRF pour l'API
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # CSRF désactivé pour l'API REST - on utilise l'authentification par token
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

#### Ajout de l'authentification par token
```python
INSTALLED_APPS = [
    ...
    'rest_framework.authtoken',
    ...
]
```

#### Configuration CORS améliorée
```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

#### Configuration REST Framework
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### 2. Vues d'authentification (`users/views.py`)

#### Import du modèle Token
```python
from rest_framework.authtoken.models import Token
```

#### Modification de la méthode register
```python
@action(detail=False, methods=['post'], permission_classes=[AllowAny])
def register(self, request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Créer un token pour le nouvel utilisateur
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Utilisateur créé avec succès',
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

#### Modification de la méthode login
```python
@action(detail=False, methods=['post'], permission_classes=[AllowAny])
def login(self, request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        
        if user:
            # Créer ou récupérer le token
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)
            return Response({
                'message': 'Connexion réussie',
                'user': UserSerializer(user).data,
                'token': token.key
            })
        return Response({
            'error': 'Nom d\'utilisateur ou mot de passe incorrect'
        }, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

#### Modification de la méthode logout
```python
@action(detail=False, methods=['post'])
def logout(self, request):
    # Supprimer le token de l'utilisateur
    if request.user.is_authenticated:
        Token.objects.filter(user=request.user).delete()
    logout(request)
    return Response({'message': 'Déconnexion réussie'})
```

### 3. Frontend - Contexte d'authentification (`frontend/src/contexts/AuthContext.tsx`)

#### Modification de la méthode login
```typescript
const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.login(credentials.username, credentials.password)
    if (response.user && response.token) {
      // Stocker le token dans localStorage
      localStorage.setItem('token', response.token)
      setUser(response.user)
    }
  } catch (error) {
    throw error
  }
}
```

#### Modification de la méthode register
```typescript
const register = async (data: RegisterData) => {
  try {
    const response = await api.register(data)
    if (response.user && response.token) {
      // Stocker le token dans localStorage
      localStorage.setItem('token', response.token)
      setUser(response.user)
    }
  } catch (error) {
    throw error
  }
}
```

### 4. Frontend - Client API (`frontend/src/services/api.ts`)

#### Configuration axios corrigée
```typescript
constructor() {
  this.client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  })

  // Request interceptor
  this.client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Token ${token}`
      }
      // Désactiver withCredentials pour éviter les problèmes CORS
      config.withCredentials = false
      return config
    },
    (error) => Promise.reject(error)
  )
}
```

### 5. Variables d'environnement frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/api
```

## 🗄️ Base de données

### Vérification
La base de données SQLite existe et contient :
- 1 utilisateur (admin)
- 5 matières
- 12 chapitres
- 4 leçons
- 3 exercices
- 5 badges

### Migration pour les tokens
```bash
python manage.py migrate
```

Cette commande crée la table `authtoken_token` nécessaire pour l'authentification par token.

### Création du token pour l'utilisateur admin
```bash
python manage.py shell << EOF
from rest_framework.authtoken.models import Token
from users.models import User

admin_user = User.objects.get(username='admin')
token, created = Token.objects.get_or_create(user=admin_user)
print(f"Token pour admin: {token.key}")
EOF
```

Token créé : `69671fe08de281e7d8541ff73939e7e2b4a2a7b2`

## 🧪 Tests

### Script de test API (`test_auth.py`)
Un script de test est fourni pour vérifier que l'API fonctionne correctement :

```bash
python test_auth.py
```

Ce script teste :
1. La récupération des matières (endpoint public)
2. La connexion (login)
3. La récupération du profil (endpoint protégé)

## 🚀 Démarrage rapide

### Méthode 1 : Script Python
```bash
python start_servers.py
```

### Méthode 2 : Manuellement
Terminal 1 (Backend) :
```bash
python manage.py runserver
```

Terminal 2 (Frontend) :
```bash
cd frontend
npm install
npm run dev
```

## 📋 Points de contrôle

Avant de tester, vérifiez que :

- [ ] Le backend démarre sans erreur sur http://localhost:8000
- [ ] Le frontend démarre sans erreur sur http://localhost:5173
- [ ] Les migrations sont appliquées (`python manage.py migrate`)
- [ ] Les tokens sont créés pour les utilisateurs
- [ ] Le fichier `frontend/.env` contient `VITE_API_URL=http://localhost:8000/api`

## 🔧 Dépannage

### Erreur "No module named 'django'"
```bash
pip install django djangorestframework django-cors-headers django-filter
```

### Erreur CORS dans le navigateur
Vérifiez que `CORS_ALLOW_ALL_ORIGINS = True` dans `backend/settings.py`

### Erreur 401 Unauthorized
Vérifiez que :
1. Le token est stocké dans localStorage
2. Le header Authorization est envoyé avec `Token VOTRE_TOKEN`
3. L'utilisateur existe dans la base de données

### Modifications non visibles
1. Redémarrez le serveur backend
2. Videz le cache du navigateur (Ctrl+F5)
3. Vérifiez la console du navigateur

## 📞 Support

En cas de problème persistant :
1. Consultez les logs du backend
2. Vérifiez la console du navigateur
3. Utilisez le script `test_auth.py` pour diagnostiquer
4. Vérifiez que tous les fichiers sont correctement modifiés

---

**Date des corrections** : Janvier 2026  
**Version corrigée** : 1.0.1
