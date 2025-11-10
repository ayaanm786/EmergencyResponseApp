# 🚨 Emergency Coordination System (ECS)
A decentralized emergency-response platform built using **React**, **Flask**, and a custom **Blockchain**.  
ECS allows citizens and taskforce agencies to coordinate emergencies in real time with transparent, tamper-proof records.

---

## ✅ Features

### 🔗 Blockchain-Powered Emergency Ledger
- Every emergency report becomes an entry in a mined block  
- Blocks store: reporter, details, GPS location, responders, timestamps  
- Blocks cannot be edited or removed  
- Admin panel allows viewing and validating the entire chain

---

## 👥 User Roles

### 🧑 Citizen
- Enters a **12-digit UID** for verification  
- If UID pre-exists, automatically enters dashboard  
- Can submit emergency reports  
- Provides incident details + selects required responders  
- Location is converted to coordinates using Google Geocoding API

### 🚑 Taskforce (Police, Paramedics, Firefighters)
- Profession-based registration flows  
- Each member sees incoming emergency reports  
- Designed for real-time coordination

### 🤝 Volunteers
- Simple registration  
- Added to a volunteer pool

### 🔐 Admin
- 2FA login with OTP  
- Full user database view  
- Add, edit, delete any user  
- View complete blockchain  
- Validate blockchain integrity (consensus check)

---

## 🗺️ Live Map (In Progress)
- Google Maps integration  
- Intended to display markers for all emergency locations pulled from the blockchain  
- Backend provides location data  
- Frontend renders real-time map markers

---

## ⚙️ Tech Stack

### Frontend
- React (single-file app)
- TailwindCSS UI
- Role-based routing
- Custom modals + dashboards

### Backend
- Python Flask
- Blockchain engine (PoW, block hashing, mining)
- REST API for emergencies, mining, admin tools  
- In-memory user DB (upgradeable to MongoDB)

============================================================

🚀 Installation & Setup Guide  
This project uses Python (Flask) for the backend and React for the frontend.  
Follow the steps below to launch it smoothly.

------------------------------------------------------------

1. Install Required Software

Python  
• Version: Python 3.9+  
• Download: https://www.python.org/downloads/  
• Check installation:  
  python --version  

Node.js + npm  
• Version: Node 18+ recommended  
• Download: https://nodejs.org/  
• Check installation:  
  node --version  
  npm --version  

Git (optional)  
• Download: https://git-scm.com/downloads

------------------------------------------------------------

2. Backend Setup (Flask)

Navigate to the backend folder:
cd server

Install Python dependencies:
pip install -r requirements.txt

If no requirements.txt exists:
pip install flask flask-cors requests

Run the Flask backend:
python app.py

Backend will start at:
http://127.0.0.1:5000

------------------------------------------------------------

3. Frontend Setup (React)

Navigate to the client folder:
cd client

A) If using React (CRA or Vite)  
• Install dependencies:  
  npm install  
• Start frontend:  
  npm start  
• Frontend runs on:  
  http://localhost:3000

B) If using plain HTML + React CDN  
• Open client/index.html directly  
• Or launch using VS Code Live Server

------------------------------------------------------------

4. Connecting Frontend to Backend

The frontend communicates with:
http://127.0.0.1:5000

Ensure the backend is running before loading the dashboard.

------------------------------------------------------------

5. How to Use the Application

Citizen  
• Enter 12-digit UID  
• If registered → direct to dashboard  
• If new → fill registration  
• Submit emergency  
• Mine a block  
• View mined block details

Taskforce  
• Select profession  
• Register → Login  
• See incidents relevant to you

Admin  
• Login with 2FA  
• Manage users (add/edit/delete)  
• View blockchain  
• Validate blockchain integrity

------------------------------------------------------------

6. Optional: MongoDB Setup

Install MongoDB Community Server:  
https://www.mongodb.com/try/download/community

Start MongoDB:  
mongod

Install driver:  
pip install pymongo bcrypt

Example connection (database.py):
from pymongo import MongoClient  
client = MongoClient("mongodb://localhost:27017/")  
db = client["ecs_database"]

------------------------------------------------------------

7. Optional: Environment Variables

Create .env file:
MONGO_URI=mongodb://localhost:27017/
SECRET_KEY=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

Install dotenv:
pip install python-dotenv

------------------------------------------------------------

8. Running Client + Server Together

Terminal 1 (Backend):
cd server  
python app.py

Terminal 2 (Frontend):
cd client  
npm start

Open in browser:
http://localhost:3000

------------------------------------------------------------

9. Troubleshooting

Backend not starting  
• Install dependencies  
• Ensure Python is on PATH

Frontend errors  
• Run npm install  
• Delete node_modules and reinstall if needed

CORS issues  
• Install CORS:  
  pip install flask-cors

------------------------------------------------------------

✅ Setup Complete  
Your Emergency Coordination System is now fully running.  
You can submit emergencies, mine blockchain blocks, view the chain, and manage everything via the admin panel.

------------------------------------------------------------
