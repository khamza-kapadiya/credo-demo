@echo off
echo 🚀 Starting Credo App for Network Access
echo.
echo 📱 Frontend: http://192.168.1.150:5173
echo 🔧 Backend:  http://192.168.1.150:5000
echo.
echo Share these URLs with your friends on the same WiFi!
echo.

echo Starting backend server...
start "Credo Backend" cmd /k "cd backend && npm run dev"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Credo Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo 📱 Open http://192.168.1.150:5173 in your browser
echo 🌐 Share this URL with friends on the same WiFi network
echo.
pause
