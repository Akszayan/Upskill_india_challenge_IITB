@echo off
echo Starting AI Mock Interview Platform...

:: Start Backend Server
echo Starting Backend (Python)...
:: Install requirements (quietly) and start server

start "Backend Server" cmd /k "py -m pip install -r requirements.txt && py -m uvicorn src.backend.main:app --host 0.0.0.0 --port 3000 --reload || pause"

:: Start Frontend Client
echo Starting Frontend...
start "Frontend Client" cmd /k "npm run dev"

:: Wait for servers to initialize
timeout /t 5 /nobreak >nul

:: Open in default browser
start http://localhost:5173

echo Application launched!
