# Comment obtenir ton fichier .APK (5 minutes, gratuit)

Ton projet est déjà prêt avec Capacitor (Android) + un robot GitHub qui compile l'APK automatiquement. Il te suffit de mettre le code sur GitHub une fois.

## Étapes

1. **Crée un compte GitHub** (si tu n'en as pas) : https://github.com/signup

2. **Crée un nouveau dépôt (repository)** :
   - Va sur https://github.com/new
   - Nom : `mina-block-puzzle` (ou ce que tu veux)
   - Laisse-le en "Public" ou "Private", peu importe
   - Ne coche AUCUNE case (pas de README, pas de .gitignore)
   - Clique "Create repository"

3. **Envoie le projet sur GitHub** :
   Sur ton ordinateur, ouvre un terminal dans le dossier du projet (celui que je t'ai donné, dézippé) et tape :
   ```bash
   git init
   git add .
   git commit -m "Premier envoi"
   git branch -M main
   git remote add origin https://github.com/TON-NOM-UTILISATEUR/mina-block-puzzle.git
   git push -u origin main
   ```
   (remplace `TON-NOM-UTILISATEUR` par ton pseudo GitHub)

4. **Attends la compilation automatique** :
   - Va sur ton dépôt GitHub, onglet **"Actions"**
   - Tu verras un workflow "Build Android APK" en cours (⏳ jaune) puis terminé (✅ vert), ça prend ~3-5 minutes

5. **Télécharge ton APK** :
   - Clique sur le workflow terminé (✅)
   - En bas de la page, dans la section "Artifacts", clique sur **"mina-block-puzzle-apk"**
   - Ça télécharge un .zip contenant ton fichier `app-debug.apk`
   - Transfère ce .apk sur ton téléphone Android et installe-le (autorise "sources inconnues" si demandé)

---

**C'est tout !** Le fichier `.github/workflows/build-apk.yml` fait tout le travail automatiquement à chaque fois que tu push du code.

Si tu préfères, tu peux aussi me demander de te préparer un lien de dépôt GitHub tout fait — dis-le-moi et je peux essayer de le créer directement si tu me donnes accès, ou te guider pas à pas en live.
