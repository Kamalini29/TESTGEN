from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.analyze import router as analyze_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI Test Case Generator",
    description="Break your code before hidden tests do.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)

@app.get("/")
async def root():
    return {"message": "AI Competitive Programming Test Case Generator"}
