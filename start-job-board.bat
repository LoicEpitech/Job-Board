@echo off
title Job Board - Backend + Frontend
echo 🚀 Démarrage du backend...
cd backend
start cmd /k "npm run dev"

timeout /t 2

echo 🚀 Démarrage du frontend...
cd ..
cd frontend
start cmd /k "npm start"

echo ✅ Les serveurs ont été lancés !
pause
