import logging
import json
from groq import Groq
from django.conf import settings

logger = logging.getLogger(__name__)

class AITriageService:
    """
    AutoMind Triage Engine.
    Primary: Groq (Llama 3.3) - Ultra Fast
    Fail-safe: Keyword Rules
    """
    
    def __init__(self):
        # Initialize Groq (Primary)
        self.groq_key = getattr(settings, 'GROQ_API_KEY', None)
        self.groq_client = Groq(api_key=self.groq_key) if self.groq_key else None
        
        if not self.groq_client:
            logger.warning("GROQ_API_KEY not found. AutoMind using rule-based triage.")

    def analyze_request(self, description: str):
        """Attempts triage using Groq, then falls back to Rules."""
        
        # --- PHASE 1: GROQ ---
        if self.groq_client:
            try:
                prompt = self._get_prompt(description)
                completion = self.groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"}
                )
                return self._process_ai_response(completion.choices[0].message.content, "Groq")
            except Exception as e:
                logger.error(f"Groq Triage Error: {str(e)}")

        # --- PHASE 2: FAIL-SAFE RULES ---
        return self._fallback_analyze(description)

    def _get_prompt(self, description: str):
        return f"""
        Analyze this car breakdown description for VehicAid India.
        Description: "{description}"
        Rules:
        - sug_type: 'TOWING', 'MECHANIC', 'FUEL_DELIVERY', 'BATTERY_JUMP', 'LOCKOUT', 'FLAT_TIRE'
        - sug_priority: 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
        JSON Output ONLY:
        {{
            "suggested_type": "string",
            "suggested_priority": "string",
            "diagnostic_advice": "short advice string",
            "confidence": float
        }}
        """

    def _process_ai_response(self, text: str, source: str):
        try:
            clean_text = text.replace('```json', '').replace('```', '').strip()
            result = json.loads(clean_text)
            logger.info(f"AutoMind {source} Triage: {result.get('suggested_type')}")
            return result
        except:
            raise ValueError(f"Invalid JSON from {source}")

    def _fallback_analyze(self, description: str):
        """Rule-based backup if AI fails."""
        desc_lower = description.lower()
        KEYWORD_MAP = {
            'flat': {'type': 'FLAT_TIRE', 'priority': 'MEDIUM'},
            'puncture': {'type': 'FLAT_TIRE', 'priority': 'MEDIUM'},
            'smoke': {'type': 'MECHANIC', 'priority': 'HIGH'},
            'fire': {'type': 'MECHANIC', 'priority': 'URGENT'},
            'battery': {'type': 'BATTERY_JUMP', 'priority': 'LOW'},
            'dead': {'type': 'BATTERY_JUMP', 'priority': 'LOW'},
            'stuck': {'type': 'TOWING', 'priority': 'HIGH'},
            'ditch': {'type': 'TOWING', 'priority': 'URGENT'},
            'gas': {'type': 'FUEL_DELIVERY', 'priority': 'LOW'},
            'fuel': {'type': 'FUEL_DELIVERY', 'priority': 'LOW'},
            'locked': {'type': 'LOCKOUT', 'priority': 'MEDIUM'},
            'keys': {'type': 'LOCKOUT', 'priority': 'MEDIUM'},
        }

        suggested_type = 'MECHANIC'
        suggested_priority = 'LOW'
        
        for keyword, mapping in KEYWORD_MAP.items():
            if keyword in desc_lower:
                suggested_type = mapping['type']
                suggested_priority = mapping['priority']
                break
        
        return {
            'suggested_type': suggested_type,
            'suggested_priority': suggested_priority,
            'diagnostic_advice': "I've categorized your request based on keywords. A specialist will review it shortly.",
            'confidence': 0.5
        }
