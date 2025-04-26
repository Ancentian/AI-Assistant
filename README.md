
# AI Assistant

A full-stack project integrating FastAPI (backend) and Next.js + TailwindCSS (frontend), powered by Google Generative AI (Gemini).

## Tech Stack

- **Backend**: Python FastAPI
- **Frontend**: Next.js + TailwindCSS
- **LLM Integration**: Gemini (Google Generative AI)

---

## Setup Instructions

### 1. Clone the Project

Clone the repository to your local machine:

```bash
git clone https://github.com/Ancentian/AI-Assistant.git
cd AI-Assistant
```

---

## Backend Installation (FastAPI)

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # For Windows use: venv\Scripts\activate
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file inside the `backend` folder and add your Google API key:

```
GEMINI_API_KEY=your-google-api-key-here
```

5. Run the FastAPI backend server:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Frontend Installation (Next.js + TailwindCSS)

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install additional packages:

```bash
npm install marked react-hot-toast
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Run the frontend development server:

```bash
npm run dev
```

---

## Deployment

### Backend Deployment

Make sure your server environment has Python and `pip` installed.  
Steps:

- Activate your virtual environment
- Install requirements (`pip install -r requirements.txt`)
- Ensure your `.env` is properly configured
- Run the backend server with:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Project Structure

```bash
ai-assistant/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── pages/
    ├── components/
    ├── styles/
    ├── public/
    └── tailwind.config.js
```
.

