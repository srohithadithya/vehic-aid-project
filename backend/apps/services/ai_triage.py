import logging

logger = logging.getLogger(__name__)

class AITriageService:
    """
    Simulates an AI agent that analyzes customer notes to determine 
    the best service type and urgency level.
    """
    
    KEYWORD_MAP = {
        'flat': {'type': 'tire_change', 'priority': 'MEDIUM'},
        'puncture': {'type': 'tire_change', 'priority': 'MEDIUM'},
        'smoke': {'type': 'mechanic', 'priority': 'HIGH'},
        'fire': {'type': 'mechanic', 'priority': 'URGENT'},
        'battery': {'type': 'battery_jump', 'priority': 'LOW'},
        'dead': {'type': 'battery_jump', 'priority': 'LOW'},
        'stuck': {'type': 'basic_tow', 'priority': 'HIGH'},
        'ditch': {'type': 'flatbed_tow', 'priority': 'URGENT'},
        'gas': {'type': 'fuel_delivery', 'priority': 'LOW'},
        'fuel': {'type': 'fuel_delivery', 'priority': 'LOW'},
        'locked': {'type': 'lockout', 'priority': 'MEDIUM'},
        'keys': {'type': 'lockout', 'priority': 'MEDIUM'},
    }

    def analyze_request(self, description: str):
        """
        Analyzes the text and returns suggested category and priority.
        In production, this would call an LLM (OpenAI/LLaMA).
        """
        desc_lower = description.lower()
        
        suggested_type = 'mechanic' # Default
        suggested_priority = 'LOW'
        
        for keyword, mapping in self.KEYWORD_MAP.items():
            if keyword in desc_lower:
                suggested_type = mapping['type']
                suggested_priority = mapping['priority']
                break
                
        logger.info(f"AI Triage: Analyzed '{description}' -> {suggested_type} ({suggested_priority})")
        
        return {
            'suggested_type': suggested_type,
            'suggested_priority': suggested_priority,
            'confidence': 0.85 if suggested_type != 'mechanic' else 0.4
        }
