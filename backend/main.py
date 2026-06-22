import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio

# Create the FastAPI app
app = FastAPI(title="LegacyOS Multi-Agent Engine", version="1.0.0")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "LegacyOS Backend is Online. Awaiting Swarm Execution."}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agents_active": True}

# --- Import our Agent Logic ---
from agents import run_shadow_board, simulate_personas

@app.post("/api/board-meeting")
async def start_board_meeting(request: Request):
    data = await request.json()
    query = data.get("query", "How should I scale my business?")
    
    # We use Server-Sent Events (SSE) to stream the agents' thoughts live
    return StreamingResponse(
        run_shadow_board(query),
        media_type="text/event-stream"
    )

@app.post("/api/simulate")
async def start_simulation(request: Request):
    data = await request.json()
    content = data.get("content", "Here is a draft of my new product launch.")
    
    # Streams the simulated reactions of 10 digital twin personas
    return StreamingResponse(
        simulate_personas(content),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
