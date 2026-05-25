# ? BreakMyCode — AI Competitive Programming Test Case Generator

> Break your code before hidden tests do.

## ?? What It Does

BreakMyCode is an AI-powered web app that helps programmers find bugs in their solutions by generating intelligent, adversarial test cases — the kind hidden tests use to break your code.

1. Paste a coding problem + your solution
2. AI generates 12 targeted test cases (edge, hidden, stress, adversarial)
3. Executes them in a secure sandbox
4. Detects failures and explains WHY your code broke
5. Suggests fixes and analyzes complexity

## ?? Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: Groq (Llama 3.3 70B) — Free tier
- **Execution**: Secure Python subprocess sandbox

## ?? Project Structure## ?? Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Add GROQ_API_KEY to .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

## ?? Features

- AI-generated edge, hidden, stress & adversarial test cases
- Secure Python code execution sandbox
- Bug category detection & fix suggestions
- Complexity analysis (time/space)
- Confidence scoring
- Download test cases as JSON
- LeetCode, HackerRank, Codeforces support

## ?? Built For

2-Day AI Hackathon — May 23-24, 2026
