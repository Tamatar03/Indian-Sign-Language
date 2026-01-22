# ISL Project Setup Guide with Realtime AI

Follow these steps to set up the project on a new machine.

## 1. Get the Code
Clone the repository:
```bash
git clone https://github.com/Tamatar03/Indian-Sign-Language.git
cd Indian-Sign-Language
```

## 2. **CRITICAL: Add the AI Model**
The AI model file is too large for GitHub and was not uploaded. 
**You must get this file from the team lead.**

1.  Obtain `104_model.pt` (approx 100MB).
2.  Place it exactly here:
    `backend/ml/checkpoints/104_model.pt`

(If the folders `checkpoints` don't exist inside `backend/ml`, create them).

## 3. Backend Setup

### A. Node.js Server (Main Backend)
Open a terminal in the project root:
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
*Runs on http://localhost:3000*

### B. Python AI Server (Sign Detection)
Open a **new** terminal:
```bash
cd backend/ml
# Optional: Create venv
# python -m venv venv
# .\venv\Scripts\activate   (Windows)
# source venv/bin/activate  (Mac/Linux)

pip install -r requirements.txt
python server.py
```
*Runs on http://localhost:5000*

## 4. Frontend Setup
Open a **new** terminal:
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173* (or similar)

## 5. Usage
1.  Open the frontend URL in your browser.
2.  Go to "Practice Arena".
3.  Allow Camera access.
4.  Perform the signs as prompted!
