import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# Create the FastAPI app
app = FastAPI(title="LegacyOS Multi-Agent Engine", version="1.0.0")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Import our Agent Logic ---
from agents import run_shadow_board, simulate_personas

@app.get("/")
def read_root():
    return {"message": "LegacyOS Backend is Online. Awaiting Swarm Execution."}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agents_active": True}

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

@app.get("/api/memory/graph")
async def get_memory_graph():
    if not supabase:
        return {"nodes": [], "links": []}
    
    # Fetch nodes
    nodes_res = supabase.table("memory_nodes").select("id, label, content, group_type").execute()
    # Fetch edges
    edges_res = supabase.table("memory_edges").select("source, target, relation").execute()
    
    nodes = [{"id": n["id"], "name": n["label"], "val": 1.5, "group": n["group_type"]} for n in nodes_res.data]
    links = [{"source": e["source"], "target": e["target"], "name": e["relation"]} for e in edges_res.data]
    
    return {"nodes": nodes, "links": links}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
