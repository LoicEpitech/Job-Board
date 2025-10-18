# 💼 JobKing — Plateforme de gestion d’offres d’emploi

Bienvenue sur **JobKing**, une application web moderne et performante permettant de publier, consulter et gérer des offres d’emploi.  
Ce projet offre une **expérience fluide, intuitive et professionnelle**, aussi bien pour les **recruteurs**, les **candidats**, que les **administrateurs**.

---

## 🚀 Présentation du projet

**JobKing** est une plateforme web développée en **Full Stack JavaScript**, permettant de :

- 🔍 **Consulter et rechercher** des offres d’emploi.
- 🧾 **Gérer les comptes utilisateurs** (candidats, recruteurs, admin).
- 💼 **Publier, modifier et fermer** des offres d’emploi.
- 🔒 **Accéder à un espace administrateur sécurisé**.
- 📄 **Téléverser des CV** pour les candidats.
- ⚙️ **Gérer toutes les entités** via une interface complète (CRUD) basée sur une **API REST Express + React**.

Le projet met en avant une **architecture claire**, un **design moderne** et une **utilisation simple et rapide**.

---

## 🛠️ Technologies utilisées

### 🧩 **Frontend**

- ⚛️ **React.js** — Framework principal pour la création d’interfaces dynamiques
- 🎨 **CSS Modules** — Pour un style propre, responsive et isolé
- 🌐 **React Router DOM** — Gestion fluide de la navigation
- 🔁 **Context API & Hooks personnalisés** — Gestion efficace de l’état et des appels API

### 🧠 **Backend**

- 🟢 **Node.js + Express.js** — Création d’une API REST rapide et modulaire
- 🗃️ **MySQL** — Base de données relationnelle robuste
- 🔐 **JWT (JSON Web Token)** — Sécurisation de l’authentification et des accès
- 🧱 **Middleware de rôles** (admin, recruteur, candidat) — Gestion fine des permissions

---

## 🌍 Routes principales côté **React**

| Page                     | URL                | Accès                             |
| ------------------------ | ------------------ | --------------------------------- |
| 🏠 Accueil               | `/`                | Public                            |
| 📋 Liste des offres      | `/jobs`            | Public                            |
| 🔎 Détail d’une offre    | `/jobs/:jobId`     | Public                            |
| 👤 Mon profil            | `/profile`         | Connecté                          |
| 📨 Mes candidatures      | `/my-applications` | Candidat                          |
| 🧾 Mes offres            | `/my-jobs`         | Recruteur                         |
| ➕ Poster une offre      | `/post-job`        | Recruteur                         |
| 🧭 Tableau de bord admin | `/admin-dashboard` | Admin                             |
| 🔑 Connexion             | `/login`           | Public                            |
| 🆕 Inscription           | `/register`        | Public                            |
| 🚫 Accès refusé          | `/forbidden`       | Automatique si accès non autorisé |

## 💻 Installation & utilisation

### 🧰 Prérequis

- Node.js **v18+**
- **npm** ou **yarn**
- Serveur **MySQL** configuré

### 🚀 Démarrage rapide

Pour lancer le projet, il suffit simplement d’exécuter :  
start-job-board.bat

Ce script démarre automatiquement le **frontend** et le **backend**.  
Ensuite, rends-toi sur :  
👉 [http://localhost:3000](http://localhost:3000)

Et c’est parti 🎉

---

## 🌟 Pourquoi choisir **JobKing** ?

✅ **Complet** — De la gestion des offres à l’administration.  
✅ **Moderne** — Basé sur les meilleures pratiques du web actuel.  
✅ **Facile à lancer** — Un simple fichier `.bat` et tout démarre.  
✅ **Design clair** — Interface intuitive, responsive et agréable.

**JobKing** est un projet **fiable, réutilisable et extensible**, parfait comme base pour tout système de gestion d’annonces, de recrutement ou même de marketplace.

---

## 👨‍💻 Auteur

**Noro Loïc**  
Étudiant en **BTS SIO option SLAM**, passionné par le **développement web** et les **technologies modernes**.  
Projet réalisé avec **rigueur, logique et enthousiasme 💪**

---

## 🏁 Licence

Ce projet est **libre d’utilisation** à des fins **d’apprentissage ou de démonstration**.  
Les contributions et suggestions d’amélioration sont **les bienvenues** ✨
