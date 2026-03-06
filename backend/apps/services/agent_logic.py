import logging
from django.db import transaction
from apps.services.models import ServiceRequest, UserSubscription
from apps.services.dispatch_logic import trigger_dispatch
from apps.services.services.sms import SMSService
from apps.services.ai_triage import AITriageService

logger = logging.getLogger(__name__)

class BookingAgent:
    """
    An agentic coordinator that handles the complex flow of a service booking.
    It ensures data integrity, checks user eligibility, and automates dispatch.
    """
    
    def __init__(self, user):
        self.user = user
        self.sms_service = SMSService()
        self.ai_triage = AITriageService()

    @transaction.atomic
    def process_booking(self, service_data):
        """
        The core agentic flow for processing a booking.
        """
        # 1. Eligibility Check (Subscription/Balance)
        subscription = UserSubscription.objects.filter(user__user=self.user, is_active=True).first()
        
        # 2. AI Automation: Triage analysis
        triage = self.ai_triage.analyze_request(service_data.get('description', ''))
        
        # 3. Check Intent. Only book if it's explicitly a booking request
        if triage.get('intent') != 'BOOK_SERVICE':
            return {
                "status": "INFO",
                "message": triage.get('diagnostic_advice', "I'm here to help. Could you provide a bit more detail?"),
                "triage": triage
            }
        
        # 4. Create Service Request
        service_request = ServiceRequest.objects.create(
            booker=self.user,
            latitude=service_data.get('latitude'),
            longitude=service_data.get('longitude'),
            service_type=triage.get('suggested_type', 'MECHANIC'), # Automated categorization
            priority=triage.get('suggested_priority', 'MEDIUM'), # Automated prioritization
            customer_notes=service_data.get('description', ''),
            source="AGENTIC_SERVICE"
        )
        
        logger.info(f"Agentic Booking: Created request {service_request.id} for user {self.user.username}")

        # 5. Automation: Trigger Dispatch Logic
        dispatch_result = trigger_dispatch(service_request)
        
        if dispatch_result['status'] == 'DISPATCHED':
            # 6. Automation: Send Notifications
            self.sms_service.send_service_request_confirmation(service_request)
            advice = triage.get('diagnostic_advice', '')
            return {
                "status": "SUCCESS",
                "request_id": service_request.id,
                "message": f"{advice}\n\n✅ MISSION TRIGGERED: I have successfully dispatched a provider to your coordinates. You can track them in your dashboard.",
                "dispatch_details": dispatch_result
            }
        else:
            # Fallback logic could go here
            return {
                "status": "PENDING_MANUAL",
                "request_id": service_request.id,
                "message": f"{triage.get('diagnostic_advice', '')}\n\nNo immediate provider found. Moved to manual assistance queue."
            }
