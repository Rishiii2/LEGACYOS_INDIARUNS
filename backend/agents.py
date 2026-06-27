import asyncio
import json
import os
from google import genai
import random
from precomputed import PRECOMPUTED_BOARD_QUERIES, PRECOMPUTED_PERSONA_QUERIES

# Initialize Gemini Client
api_key = os.getenv("GEMINI_API_KEY", "")
client = None
if api_key:
    client = genai.Client(api_key=api_key)

# In-Memory Cache to drastically save API tokens on repeated/similar queries
response_cache = {}

async def generate_agent_thought(agent_name: str, query: str, context: str = ""):
    """Helper function to get a response from Gemini or mock it if no key is present."""
    if not client:
        await asyncio.sleep(1.5) # Simulate API latency
        return f"[MOCK] {agent_name} has analyzed the query: '{query}' and believes it is a strong strategic move."

    prompt = f"You are acting as the {agent_name} on a Shadow Board of Directors. The user asks: '{query}'. Context: {context}. Give a strict 2-sentence perspective from your specific role."
    
    if prompt in response_cache:
        await asyncio.sleep(0.5) # simulate latency
        return response_cache[prompt]

    try:
        # Note: In a real async environment, we'd use async client or run_in_executor
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )
        response_cache[prompt] = response.text
        return response.text
    except Exception as e:
        error_msg = str(e).lower()
        if "429" in error_msg or "exhausted" in error_msg or "quota" in error_msg:
            return "U have used enough, Please try after sometime"
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

    # Check for precomputed perfect response to save tokens for popular queries
    query_lower = query.lower()
    precomputed = None
    
    # Fuzzy keyword matching for Board Queries
    if "enterprise ai" in query_lower or ("pivot" in query_lower and "enterprise" in query_lower):
        precomputed = PRECOMPUTED_BOARD_QUERIES["Should we pivot our startup to focus entirely on enterprise AI?"]
    elif "marketing" in query_lower and ("cut" in query_lower or "budget" in query_lower or "50%" in query_lower):
        precomputed = PRECOMPUTED_BOARD_QUERIES["Should we cut our marketing budget by 50% to extend our runway?"]
    elif "office" in query_lower and ("return" in query_lower or "5 days" in query_lower):
        precomputed = PRECOMPUTED_BOARD_QUERIES["Should we force all employees to return to the office 5 days a week?"]
    elif "lore" in query_lower or "b2b saas venture capitalist" in query_lower:
        precomputed = PRECOMPUTED_BOARD_QUERIES["Lore VC Pitch"]

    if precomputed:
        for agent in agents:
            yield f"data: {json.dumps({'event': 'thinking', 'agent': agent, 'message': f'{agent} is analyzing data...'})}\n\n"
            await asyncio.sleep(0.5)
            thought = precomputed[agent]
            yield f"data: {json.dumps({'event': 'speak', 'agent': agent, 'message': thought})}\n\n"
            await asyncio.sleep(1)
        
        yield f"data: {json.dumps({'event': 'thinking', 'agent': 'Orchestrator', 'message': 'Drafting final Board Resolution...'})}\n\n"
        await asyncio.sleep(1)
        
        resolution_text = precomputed['Orchestrator']
        yield f"data: {json.dumps({'event': 'resolution', 'agent': 'Orchestrator', 'message': resolution_text})}\n\n"
        
        # Save to memory graph
        full_text = " ".join([f"{a}: {t}" for a, t in precomputed.items()])
        update_memory_graph(query, full_text)
        
        yield "data: [DONE]\n\n"
        return

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
        
        if summary_prompt in response_cache:
            resolution = response_cache[summary_prompt]
        else:
            try:
                resolution = client.models.generate_content(model="gemini-2.5-flash-lite", contents=summary_prompt).text
                response_cache[summary_prompt] = resolution
            except Exception as e:
                error_msg = str(e).lower()
                if "429" in error_msg or "exhausted" in error_msg or "quota" in error_msg:
                    resolution = "U have used enough, Please try after sometime"
                else:
                    resolution = f"[ERROR] Orchestrator failed: {str(e)}"
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

    # Check for precomputed perfect response to save tokens for popular queries
    content_lower = content.lower()
    precomputed = None
    
    if "water bottle" in content_lower or "hydration" in content_lower or "$89" in content_lower:
        precomputed = PRECOMPUTED_PERSONA_QUERIES["Introducing our new smart water bottle that tracks hydration and syncs to your phone for $89."]

    if precomputed:
        personas = list(precomputed.keys())
        personas.remove("Orchestrator")
        
        for persona in personas:
            yield f"data: {json.dumps({'event': 'simulating', 'persona': persona, 'message': f'Running content past {persona}...'})}\n\n"
            await asyncio.sleep(0.5)
            reaction = precomputed[persona]
            yield f"data: {json.dumps({'event': 'reaction', 'persona': persona, 'message': reaction})}\n\n"
            await asyncio.sleep(0.5)
            
        yield f"data: {json.dumps({'event': 'finish', 'message': precomputed['Orchestrator']})}\n\n"
        
        # Save to memory graph
        full_text = " ".join([f"{p}: {r}" for p, r in precomputed.items()])
        update_memory_graph(content, full_text)
        
        yield "data: [DONE]\n\n"
        return

    personas = [
        "Busy Executive", "Skeptical Buyer", "Gen-Z Trendsetter", "Frugal Shopper", 
        "Tech Enthusiast", "Eco-Conscious Consumer", "Impulse Buyer", "Brand Loyalist",
        "Data-Driven Analyst", "Local Artisan Supporter"
    ]

    for persona in personas:
        yield f"data: {json.dumps({'event': 'simulating', 'persona': persona, 'message': f'Running content past {persona}...'})}\n\n"
        
        if client:
            prompt = f"React to this content strictly as a '{persona}'. Content: '{content}'. Give a 1-sentence reaction and a score from 1-10."
            
            if prompt in response_cache:
                reaction = response_cache[prompt]
            else:
                try:
                    reaction = client.models.generate_content(model="gemini-2.5-flash-lite", contents=prompt).text
                    response_cache[prompt] = reaction
                except Exception as e:
                    error_msg = str(e).lower()
                    if "429" in error_msg or "exhausted" in error_msg or "quota" in error_msg:
                        reaction = "U have used enough, Please try after sometime"
                    else:
                        reaction = f"[ERROR] {str(e)}"
        else:
            await asyncio.sleep(0.5)
            # Random mock score
            score = random.randint(4, 9)
            reaction = f"[MOCK] Reacting as {persona}. Sounds decent. (Score: {score}/10)"

        yield f"data: {json.dumps({'event': 'reaction', 'persona': persona, 'message': reaction})}\n\n"
        await asyncio.sleep(0.5)

    yield f"data: {json.dumps({'event': 'finish', 'message': 'Simulation Complete. Auto-correcting strategy based on feedback.'})}\n\n"
    yield "data: [DONE]\n\n"
