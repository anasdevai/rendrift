@echo off
echo Starting FocusCast AI Services...
echo.

echo [1/3] Starting Python Agent Server on port 8000...
start "Python Agent" cmd /k "cd apps\processor\agent && uv run uvicorn main:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Node.js Backend on port 4001...
start "Node.js Backend" cmd /k "cd apps\processor && node index.js"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Next.js Frontend on port 3000...
start "Next.js Frontend" cmd /k "cd apps\web && npm run dev"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Python Agent:  http://localhost:8000
echo Node.js API:   http://localhost:4001
echo Frontend:      http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
