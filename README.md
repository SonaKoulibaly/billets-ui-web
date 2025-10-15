# Billets UI (frontend) — Green/Black

Frontend statique (HTML/CSS/JS) pour le projet "Détection de faux billets".
Connecté au backend FastAPI (Render): `https://billets-api-1.onrender.com`.

## Déploiement (Vercel)
1. Créer un repo GitHub et push les fichiers.
2. Aller sur https://vercel.com → New Project → Import GitHub repo.
3. Choisir "Static" (Aucun build). Déployer.
4. Optionnel: configurer `API_BASE` dans les fichiers ou remplacer l'URL.

## Endpoints attendus (backend)
- `POST /predict_one` — JSON payload d'une seule instance
- `POST /predict_csv` — multipart/form-data « file »

> Assure-toi que FastAPI autorise le CORS pour le domaine Vercel (ou `*` pendant le dev).

# 💶 Billets UI Web (Vercel)

Frontend web pour le projet **Détection de vrais/faux billets**.
Construit avec **HTML**, **Tailwind CSS**, et **JavaScript**.  
Connecté à une API REST FastAPI déployée sur Render.

## 🚀 Démo en ligne
https://billets-ui-web.vercel.app

## ⚙️ API utilisée
- Health: `GET https://billets-api-1.onrender.com/health`
- Prédiction 1 billet: `POST https://billets-api-1.onrender.com/predict_one`
- Prédiction CSV: `POST https://billets-api-1.onrender.com/predict_csv`

## 📂 Structure du projet
illets-ui-web-vercel/
├── index.html
├── analyse.html
├── dashboard.html
├── profil.html
├── assets/
│ ├── app.js
│ └── styles.css

## 🧠 Auteur
Développé par **Sona Koulibaly**  
Projet de Machine Learning — FastAPI × Vercel × Tailwind

