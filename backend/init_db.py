import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# The Supabase connection string format
DB_PASSWORD = os.getenv("DB_PASSWORD")
# We parse the project ID from the URL to construct the DB connection string
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
PROJECT_ID = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

if not DB_PASSWORD or not PROJECT_ID:
    print("Missing DB_PASSWORD or SUPABASE_URL in .env")
    exit(1)

DB_URI = f"postgresql://postgres:{DB_PASSWORD}@db.{PROJECT_ID}.supabase.co:5432/postgres"

def init_db():
    print("Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(DB_URI)
    cur = conn.cursor()

    print("Enabling pgvector extension...")
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    print("Creating memory_nodes table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS memory_nodes (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            content TEXT,
            group_type TEXT,
            embedding vector(768)
        );
    """)

    print("Creating memory_edges table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS memory_edges (
            source TEXT REFERENCES memory_nodes(id) ON DELETE CASCADE,
            target TEXT REFERENCES memory_nodes(id) ON DELETE CASCADE,
            relation TEXT,
            PRIMARY KEY (source, target)
        );
    """)

    # Let's insert some dummy data so the 3D graph looks awesome immediately
    print("Inserting dummy Knowledge Graph data for presentation...")
    cur.execute("DELETE FROM memory_edges;")
    cur.execute("DELETE FROM memory_nodes;")
    
    dummy_nodes = [
        ("user", "Rishi (Founder)", "The core user of LegacyOS", "person"),
        ("startup", "LegacyOS Project", "The Top 1% Hackathon Project", "project"),
        ("goal", "$10k MRR", "Revenue target for the year", "goal"),
        ("skill1", "AI Orchestration", "Expertise in multi-agent systems", "skill"),
        ("skill2", "Next.js & UI", "Expertise in minimalist canvas design", "skill"),
        ("audience", "Small Businesses", "Target market for the product", "market")
    ]
    
    for node in dummy_nodes:
        cur.execute("INSERT INTO memory_nodes (id, label, content, group_type) VALUES (%s, %s, %s, %s)", node)

    dummy_edges = [
        ("user", "startup", "founder of"),
        ("user", "skill1", "expert in"),
        ("user", "skill2", "expert in"),
        ("startup", "goal", "targets"),
        ("startup", "audience", "serves")
    ]

    for edge in dummy_edges:
        cur.execute("INSERT INTO memory_edges (source, target, relation) VALUES (%s, %s, %s)", edge)

    conn.commit()
    cur.close()
    conn.close()
    print("Database Initialization Complete! Vector memory is ready.")

if __name__ == "__main__":
    init_db()
