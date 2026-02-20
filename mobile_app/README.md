# Tuteur Intelligent - Application Mobile

Cette application est le client mobile pour le projet **Tuteur Intelligent**. Elle permet aux étudiants d'accéder à leurs exercices, de suivre leur progression et de communiquer avec le système de tutorat basé sur l'IA.

## 🚀 Fonctionnement du Projet

L'application est construite avec **Flutter** et utilise une architecture moderne basée sur les services et une gestion d'état robuste.

### Architecture Technique

- **Gestion d'état :** [Riverpod](https://riverpod.dev/) est utilisé pour une gestion d'état réactive, testable et performante.
- **Communication API :** Les services (`lib/services/`) gèrent toutes les requêtes HTTP vers le backend Django.
- **Sécurité :** `flutter_secure_storage` est utilisé pour stocker de manière sécurisée les jetons d'authentification (JWT/Tokens).
- **UI/UX :** Utilisation de `google_fonts` (Inter) et `lucide_icons` pour une interface moderne et épurée.

### Structure des Dossiers

- `lib/models/` : Classes de données (ex: `User`, `Exercise`).
- `lib/screens/` : Interfaces utilisateur, divisées par fonctionnalités (Auth, Home, etc.).
- `lib/services/` : Logique de communication avec le backend (API, Auth).
- `lib/main.dart` : Point d'entrée de l'application et configuration du thème.

## 🛠️ Installation et Lancement

1. **Prérequis :**
   - Flutter SDK installé (>= 3.0.0).
   - Un émulateur ou un appareil physique connecté.

2. **Installation des dépendances :**
   ```bash
   flutter pub get
   ```

3. **Configuration du Backend :**
   Modifiez l'adresse IP dans `lib/services/api_service.dart` pour pointer vers votre serveur backend :
   ```dart
   static const String baseUrl = 'http://127.0.0.1:8000/api';
   ```
   > [!TIP]
   > Si vous utilisez un émulateur Android, utilisez `http://10.0.2.2:8000/api` au lieu de `127.0.0.1`.

4. **Lancer l'application :**
   ```bash
   flutter run
   ```

## 📝 Fonctionnalités Implémentées

- [x] Authentification (Connexion / Inscription)
- [x] Dashboard principal
- [x] Intégration sécurisée des Tokens
- [ ] Visualisation détaillée des exercices (En cours)
