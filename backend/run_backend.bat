@echo off
cd /d "%~dp0"
echo 🚀 Installing dependencies...
call "C:\Users\ftt\AppData\Local\Programs\Python\Python314\python.exe" -m pip install --upgrade pip flask flask-cors werkzeug
echo ✅ Starting server...
call "C:\Users\ftt\AppData\Local\Programs\Python\Python314\python.exe" app.py
pause

