@echo off
echo 📦 Installing StudentBot Backend Dependencies...
pip install flask flask-cors requests

echo.
echo 🚀 Creating required files...
if not exist "..\database" mkdir ..\database
if not exist "data.json" echo {} > data.json
if not exist "..\database\invalid_queries.json" echo [] > ..\database\invalid_queries.json

echo.
echo ✅ Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Run: python app.py
echo 2. Open frontend/index.html with Live Server (port 5500)
echo.
pause