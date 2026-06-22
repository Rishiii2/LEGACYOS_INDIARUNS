import asyncio
import json
import os
from google import genai
import random

# Initialize Gemini Client (will fail gracefully if no API key is present during mock mode)
api_key = os.getenv("GEMINI_API_KEY", "")
client = None
if api_key:
    client = genai.Client(api_key=api_key)

async def generate_agent_thought(agent_name: str, query: str, context: str = ""):
    """Helper function to get a response from Gemini or mock it if no key is present."""
    if not client:
        await asyncio.sleep(1.5) # Simulate API latency
        return f"[MOCK] {agent_name} has analyzed the query: '{query}' and believes it is a strong strategic move."

    prompt = f"You are acting as the {agent_name} on a Shadow Board of Directors. The user asks: '{query}'. Context: {context}. Give a strict 2-sentence perspective from your specific role."
    try:
        # Note: In a real async environment, we'd use async client or run_in_executor
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"[ERROR] {agent_name} failed: {str(e)}"

async def run_shadow_board(query: str):
    """
    Simulates a Board of Directors debating a business decision.
    Yields SSE events so the frontend can stream them live.
    """
    agents = ["Chief Financial Officer", "Chief Marketing Officer", "Risk Assessor", "The Skeptical Customer"]
    
    # 1. Start the meeting
    yield f"data: {json.dumps({'event': 'start', 'message': f'Initializing Shadow Board for query: {query}'})}\n\n"
    await asyncio.sleep(1)

    thoughts = []
    # 2. Let each agent speak sequentially (for visual effect)
    for agent in agents:
        yield f"data: {json.dumps({'event': 'thinking', 'agent': agent, 'message': f'{agent} is analyzing data...'})}\n\n"
        
        # In a more complex graph, agents would pass context to each other.
        # Here we just pass the raw query.
        thought = await generate_agent_thought(agent, query)
        thoughts.append(f"{agent}: {thought}")
        
        yield f"data: {json.dumps({'event': 'speak', 'agent': agent, 'message': thought})}\n\n"
        await asyncio.sleep(1) # Dramatic pause between speakers

    # 3. The Orchestrator summarizes the final resolution
    yield f"data: {json.dumps({'event': 'thinking', 'agent': 'Orchestrator', 'message': 'Drafting final Board Resolution...'})}\n\n"
    
    if client:
        summary_prompt = f"Summarize these board thoughts into a 3-point final resolution: {' | '.join(thoughts)}"
        try:
            resolution = client.models.generate_content(model="gemini-2.5-flash-lite", contents=summary_prompt).text
        except:
            resolution = "[MOCK] Proceed with caution, monitor burn rate, and test with a small cohort first."
    else:
        await asyncio.sleep(1.5)
        resolution = "[MOCK] Proceed with caution, monitor burn rate, and test with a small cohort first."

    yield f"data: {json.dumps({'event': 'resolution', 'agent': 'Orchestrator', 'message': resolution})}\n\n"
    yield "data: [DONE]\n\n"


async def simulate_personas(content: str):
    """
    Simulates 10 Digital Twins reading a piece of content and reacting.
    """
    yield f"data: {json.dumps({'event': 'start', 'message': 'Spawning 10 Digital Twin Personas...'})}\n\n"
    await asyncio.sleep(1)

    personas = [
        "Busy Executive", "Skeptical Buyer", "Gen-Z Trendsetter", "Frugal Shopper", 
        "Tech Enthusiast", "Eco-Conscious Consumer", "Impulse Buyer", "Brand Loyalist",
        "Data-Driven Analyst", "Local Artisan Supporter"
    ]

    for persona in personas:
        yield f"data: {json.dumps({'event': 'simulating', 'persona': persona, 'message': f'Running content past {persona}...'})}\n\n"
        
        if client:
            prompt = f"React to this content strictly as a '{persona}'. Content: '{content}'. Give a 1-sentence reaction and a score from 1-10."
            try:
                reaction = client.models.generate_content(model="gemini-2.5-flash-lite", contents=prompt).text
            except:
                reaction = "[MOCK] I find this interesting but the price point is a bit high. (Score: 6/10)"
        else:
            await asyncio.sleep(0.5)
            # Random mock score
            score = random.randint(4, 9)
            reaction = f"[MOCK] Reacting as {persona}. Sounds decent. (Score: {score}/10)"

        yield f"data: {json.dumps({'event': 'reaction', 'persona': persona, 'message': reaction})}\n\n"
        await asyncio.sleep(0.5)

    yield f"data: {json.dumps({'event': 'finish', 'message': 'Simulation Complete. Auto-correcting strategy based on feedback.'})}\n\n"
    yield "data: [DONE]\n\n"
