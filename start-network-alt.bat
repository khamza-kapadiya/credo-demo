@echo off
echo 🚀 Starting Credo App for Network Access (Alternative Ports)
echo.
echo 📱 Frontend: http://192.168.1.150:3000
echo 🔧 Backend:  http://192.168.1.150:8000
echo.
echo Share these URLs with your friends on the same WiFi!
echo.

echo Starting backend server on port 8000...
start "Credo Backend" cmd /k "cd backend && set PORT=8000 && npm run dev"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend server on port 3000...
start "Credo Frontend" cmd /k "npm run dev -- --port 3000"

echo.
echo ✅ Both servers are starting on alternative ports!
echo 📱 Open http://192.168.1.150:3000 in your browser
echo 🌐 Share this URL with friends on the same WiFi network
echo.
pause
