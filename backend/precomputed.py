PRECOMPUTED_BOARD_QUERIES = {
    "Should we pivot our startup to focus entirely on enterprise AI?": {
        "Chief Financial Officer": "Pivoting to enterprise AI significantly increases our Average Contract Value, but the sales cycle will stretch from 30 days to 6+ months. We must secure at least 18 months of runway before making this transition.",
        "Chief Marketing Officer": "Enterprise buyers don't respond to our current grassroots social media marketing; we need to completely rebrand towards thought leadership, whitepapers, and Gartner Magic Quadrant positioning. This requires a completely different marketing budget allocation.",
        "Risk Assessor": "The enterprise AI space is highly saturated with massive incumbents like Microsoft and Google; our moat needs to be incredibly defensible. Furthermore, enterprise data security compliance (SOC2, HIPAA) will be a massive initial hurdle.",
        "The Skeptical Customer": "I loved your product because it was simple and cheap for small businesses like mine. If you go enterprise, I feel like you're going to abandon us and hike up the prices.",
        "Orchestrator": "1. Secure 18 months of runway to survive enterprise sales cycles before transitioning.\n2. Pivot marketing budget from social media to B2B thought leadership and compliance (SOC2).\n3. Maintain a 'lite' tier to retain existing small business goodwill while building the enterprise moat."
    },
    "Should we cut our marketing budget by 50% to extend our runway?": {
        "Chief Financial Officer": "Cutting marketing by 50% will immediately extend our runway by 4 months, which is critical in this macroeconomic climate. However, we must carefully monitor the impact on top-line revenue growth over the next quarter.",
        "Chief Marketing Officer": "A 50% cut means we have to abandon paid acquisition and rely entirely on organic growth and virality. We risk losing our market share to competitors who are still spending aggressively.",
        "Risk Assessor": "The primary risk here is entering a 'death spiral' where reduced marketing leads to lower revenue, which forces further cuts. We need to ensure our core customer acquisition channels are highly optimized before slashing the budget.",
        "The Skeptical Customer": "I usually forget about brands if I don't see them around. If you stop marketing, I might just drift to the competitor who is constantly in my feed.",
        "Orchestrator": "1. Implement the 50% cut but ring-fence the highest-ROI organic channels.\n2. Closely monitor top-line revenue metrics to avoid a growth death spiral.\n3. Double down on community engagement to maintain brand presence without paid ads."
    },
    "Should we force all employees to return to the office 5 days a week?": {
        "Chief Financial Officer": "Terminating our remote-first policy means we have to drastically increase our real estate footprint and operational overhead. However, the potential increase in productivity might offset the lease costs.",
        "Chief Marketing Officer": "From an employer branding perspective, this is a nightmare and will leak to Glassdoor immediately. We need to craft a brilliant internal comms strategy to frame this around 'collaboration' rather than 'control'.",
        "Risk Assessor": "We risk an immediate spike in attrition, specifically among our top engineering talent who have highly liquid skills. We need to model the cost of replacing 15-20% of our workforce in the next 90 days.",
        "The Skeptical Customer": "I don't really care where your employees sit, as long as customer support doesn't get slower. But if your best engineers quit, I worry the product will suffer.",
        "Orchestrator": "1. Prepare for a potential 15% attrition rate and budget for high-priority backfills.\n2. Launch a strategic internal communications campaign emphasizing in-person collaboration.\n3. Monitor customer support SLA metrics to ensure the transition doesn't impact the user experience."
    },
    "Lore VC Pitch": {
        "Chief Financial Officer": "From my seat as a seasoned B2B SaaS VC, the 'knowledge silos' problem is a well-documented, massive drain on enterprise engineering budgets, meaning the willingness to pay (WTP) will be high. I strongly recommend a per-seat pricing model (e.g., $39/user/month) scaling up to custom Enterprise tiers, as this naturally expands as their engineering team grows.",
        "Chief Marketing Officer": "Your go-to-market strategy needs to target VP of Engineering and Staff Engineers through highly technical, value-driven content marketing—not traditional ads. You must position 'Lore' as an active guardrail that saves time, rather than just another passive documentation wiki that developers will eventually ignore.",
        "Risk Assessor": "The competitive moat is your biggest risk; native AI tools like GitHub Copilot Workspace or Atlassian Intelligence are uniquely positioned to build this natively. Your absolute top objection from CTOs will be data privacy and security—they will refuse to grant an external LLM access to their entire proprietary codebase without on-prem or strict SOC2 compliance.",
        "The Skeptical Customer": "As an Engineering Manager, I hate adopting new tools that disrupt my team's workflow. The fact that Lore hooks into our existing GitHub and Slack without requiring my devs to write manual documentation is the only reason I'd give this a trial.",
        "Orchestrator": "1. Startup Viability: Extremely high pain point; enterprise engineering teams leak millions in lost context. Verdict: 8.5/10 venture-backable idea.\n2. Pricing & GTM: Deploy a seat-based SaaS model targeting VPEs via technical thought leadership.\n3. Defensibility: You must aggressively build integrations (GitHub, Jira, Slack) faster than incumbents, and prioritize strict SOC2 compliance to overcome security objections."
    }
}

PRECOMPUTED_PERSONA_QUERIES = {
    "Introducing our new smart water bottle that tracks hydration and syncs to your phone for $89.": {
        "Busy Executive": "If it integrates seamlessly with my Apple Health and saves me time tracking, the $89 is a rounding error. (Score: 8/10)",
        "Skeptical Buyer": "It's a water bottle. I've been drinking water from a $5 glass for decades without an app telling me to. (Score: 3/10)",
        "Gen-Z Trendsetter": "Is the design aesthetic enough for TikTok? If it doesn't look cool at the gym, I'm not buying it. (Score: 6/10)",
        "Frugal Shopper": "$89 for a water bottle is absolutely ridiculous when a Nalgene is $15. (Score: 1/10)",
        "Tech Enthusiast": "I love the data integration aspect, but I want to know if the API is open so I can build my own dashboards. (Score: 7/10)",
        "Eco-Conscious Consumer": "Is it made from recycled materials? If the battery isn't replaceable, it's just more e-waste. (Score: 4/10)",
        "Impulse Buyer": "Wait, does it come in matte black? Add to cart immediately. (Score: 9/10)",
        "Brand Loyalist": "I'll buy it to complete the ecosystem, but you guys need to release more colors. (Score: 8/10)",
        "Data-Driven Analyst": "The hydration tracking algorithm needs to factor in ambient temperature and my specific metabolic rate, otherwise the data is useless. (Score: 5/10)",
        "Local Artisan Supporter": "I'd much rather buy a handmade ceramic mug from a local potter than a mass-produced piece of tech. (Score: 2/10)",
        "Orchestrator": "Simulation Complete. Auto-correcting strategy based on feedback: Focus marketing on Tech and Execs, but lower price or add Eco-friendly materials to capture broader market."
    }
}
