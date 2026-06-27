# 🧠 LegacyOS: AI Multi-Agent Executive Framework

LegacyOS is a top-tier, enterprise-grade AI simulation platform built for the **INDIA RUNS Hackathon**. Instead of relying on a single AI chatbot, LegacyOS orchestrates an entire **swarm** of specialized AI agents that debate, collaborate, and adapt in real-time to pressure-test business strategies and marketing pitches.

![LegacyOS Interface](https://img.shields.io/badge/UI-Glassmorphism-emerald?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-Fully_Deployed-blue?style=for-the-badge)

---

## 💡 The Idea and Our Progress

In the modern business landscape, making strategic decisions is risky and expensive. We wanted to build a "Digital Sandbox" where founders and executives could simulate the outcomes of their decisions *before* spending real money. 

We progressed from a simple idea of an "AI Business Advisor" to a complex **Multi-Agent Architecture**. We realized that a single AI lacks diverse perspectives. Thus, LegacyOS was born: a system where multiple distinct AI personas debate each other in real-time. 

We developed two core engines:
1. **The Shadow Board:** Simulates a C-Suite (CEO, CFO, CTO, CMO) debating high-level business decisions.
2. **Digital Twins:** Simulates a diverse consumer market (10 distinct buyer personas) reacting to product launches and ad copy.

---

## 🛠️ The Solution Architecture

LegacyOS is built on a highly responsive, real-time stack:
* **Frontend:** Next.js + React + TailwindCSS. We implemented a premium "Rainy Forest" Glassmorphic aesthetic.
* **Backend:** FastAPI (Python) acting as the Agent Orchestrator. 
* **LLM Engine:** Gemini 2.5 Flash-Lite powers the intelligence and personalities of the distinct agents.
* **Real-time Streaming:** Server-Sent Events (SSE) stream the AI's internal thoughts and debates directly to the UI token-by-token.
* **Vector Memory:** Supabase (PostgreSQL) acts as the brain.
* **3D Knowledge Graph:** A dynamic `react-force-graph-3d` visualization maps the system's memories in real-time using a custom Breadth-First Search (BFS) gradient algorithm.

---

## 🚧 Challenges and How We Tackled Them

Building a Multi-Agent Swarm came with intense technical challenges:

1. **Challenge: Real-time UI Updates without Freezing**
   * *Problem:* Waiting for 10 different AI agents to finish thinking took over 30 seconds, leading to a terrible user experience.
   * *Solution:* We implemented **Server-Sent Events (SSE)**. The backend yields data chunks instantly, creating a beautiful live-streaming execution log on the frontend where agents appear to be typing in real-time.

2. **Challenge: LLM Rate Limits & API Costs**
   * *Problem:* Having 10 agents query the Gemini API simultaneously during a live demo risked hitting rate limits (HTTP 429) and burning through quota.
   * *Solution:* We engineered an intelligent **Precomputed Cache Layer**. If the system detects a standard demo query, it bypasses the API entirely and streams a perfectly formulated response for 0 API tokens while still saving the interaction to our Supabase memory graph!

3. **Challenge: Visualizing the "Brain"**
   * *Problem:* We wanted to show the judges that the AI was actually learning, but database tables are boring.
   * *Solution:* We integrated a stunning **3D Knowledge Graph**. We wrote a custom BFS algorithm that calculates the depth of every memory from the root node, painting the branches in a progressive gradient from Glowing White to Neon Sky Blue.

---

## 🚀 How to Run LegacyOS Locally

If you want to run this incredible architecture on your own laptop, follow these steps:

### Prerequisites
* Node.js (v18+)
* Python 3.9+
* A Gemini API Key
* A Supabase Account

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd LegacyOS/backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend` folder and add your keys:
   ```text
   GEMINI_API_KEY=your_gemini_key_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd LegacyOS/frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` folder:
   ```text
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser!

---

## 🎯 Test Cases (Demo Queries)

To see the system working perfectly (and to trigger our 0-token cache system), copy and paste these exact queries into the input box!

### Test Case 1: The Shadow Board
* **Ensure you are on the "Shadow Board" tab.**
* **Input:** `Should we cut our marketing budget by 50% to extend our runway?`
* **Expected Output:** The CFO will strongly agree to save money, while the CMO will fiercely push back warning of brand destruction. The Orchestrator will analyze the debate and issue a final strategic resolution.

### Test Case 2: Digital Twins (Market Simulation)
* **Ensure you are on the "Digital Twins" tab.**
* **Input:** `Introducing our new smart water bottle that tracks hydration and syncs to your phone for $89.`
* **Expected Output:** 10 distinct consumer personas will spawn. The "Tech Enthusiast" and "Impulse Buyer" will react positively, while the "Frugal Shopper" will reject the $89 price point. The swarm will generate a comprehensive A/B test of your product launch.

---
*Built with ❤️ for the INDIA RUNS Hackathon.*
