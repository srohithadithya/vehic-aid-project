# 📱 Twilio SMS Setup Guide for VehicAid

## Overview
This guide will help you set up SMS notifications for the VehicAid platform using Twilio.

---

## 📋 Table of Contents
1. [Twilio Account Setup](#twilio-account-setup)
2. [Getting Credentials](#getting-credentials)
3. [Django Integration](#django-integration)
4. [SMS Templates](#sms-templates)
5. [Testing SMS](#testing-sms)
6. [WhatsApp Integration](#whatsapp-integration)

---

## 🚀 Twilio Account Setup

### Step 1: Create Twilio Account

1. Go to: https://www.twilio.com/try-twilio
2. Click **Sign up**
3. Fill in your details:
   - Email
   - Password
   - First Name / Last Name
4. Verify your email address
5. Verify your phone number (for trial account)

### Step 2: Free Trial Benefits

**Twilio Free Trial Includes:**
- $15.50 USD trial credit
- Send SMS to verified numbers only
- Test all features
- No credit card required initially

**Limitations:**
- Can only send to verified phone numbers
- Messages include "Sent from your Twilio trial account"
- Limited to trial credit

---

## 🔑 Getting Credentials

### Step 1: Get Account SID and Auth Token

1. Log in to Twilio Console: https://console.twilio.com/
2. On the Dashboard, you'll see:
   - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: Click "Show" to reveal

**Copy both values** - you'll need them!

### Step 2: Get a Phone Number

#### For Trial Account:
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Click **Get a trial number**
3. Twilio will assign you a free number
4. Click **Choose this number**

#### For Paid Account:
1. Go to: **Phone Numbers** > **Buy a number**
2. Select country: **India** (+91)
3. Check capabilities: **SMS**
4. Search and buy a number (~₹100-200/month)

### Step 3: Verify Phone Numbers (Trial Only)

For trial accounts, verify recipient numbers:

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click **Add a new number**
3. Enter phone number with country code: `+919876543210`
4. Choose verification method: **SMS** or **Call**
5. Enter verification code

---

## ⚙️ Django Integration

### Step 1: Install Twilio SDK

```bash
cd backend
pip install twilio
pip freeze > requirements.txt
```

### Step 2: Update Environment Variables

Add to `backend/.env`:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### Step 3: Update Django Settings

Add to `backend/vehic_aid_backend/settings.py`:

```python
# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '')
TWILIO_WHATSAPP_NUMBER = os.getenv('TWILIO_WHATSAPP_NUMBER', '')
```

### Step 4: Create SMS Utility

Create `backend/apps/services/utils/sms_utils.py`:

```python
from twilio.rest import Client
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class TwilioSMSService:
    """Service for sending SMS via Twilio"""
    
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.phone_number = settings.TWILIO_PHONE_NUMBER
        
        if not all([self.account_sid, self.auth_token, self.phone_number]):
            logger.warning("Twilio credentials not configured")
            self.client = None
        else:
            self.client = Client(self.account_sid, self.auth_token)
    
    def send_sms(self, to_number, message):
        """
        Send SMS to a phone number
        
        Args:
            to_number (str): Recipient phone number with country code (e.g., +919876543210)
            message (str): SMS message content (max 160 characters for single SMS)
        
        Returns:
            dict: Response with success status and message SID or error
        """
        if not self.client:
            logger.error("Twilio client not initialized")
            return {'success': False, 'error': 'Twilio not configured'}
        
        try:
            # Ensure phone number has country code
            if not to_number.startswith('+'):
                # Assume India if no country code
                to_number = f'+91{to_number}'
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_number
            )
            
            logger.info(f"SMS sent successfully. SID: {message_obj.sid}")
            return {
                'success': True,
                'sid': message_obj.sid,
                'status': message_obj.status
            }
            
        except Exception as e:
            logger.error(f"Failed to send SMS: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def send_service_request_sms(self, user, service_request):
        """Send SMS when service request is created"""
        message = f"""VehicAid: Your service request #{service_request.id} has been received. 
Service: {service_request.get_service_type_display()}
Status: {service_request.get_status_display()}
We'll notify you once a provider is assigned."""
        
        return self.send_sms(user.phone_number, message)
    
    def send_provider_assigned_sms(self, user, service_request, provider):
        """Send SMS when provider is assigned"""
        message = f"""VehicAid: Provider assigned to request #{service_request.id}!
Provider: {provider.get_full_name()}
ID: {provider.provider_id}
They will contact you shortly."""
        
        return self.send_sms(user.phone_number, message)
    
    def send_service_completed_sms(self, user, service_request):
        """Send SMS when service is completed"""
        message = f"""VehicAid: Your service request #{service_request.id} is completed!
Thank you for using VehicAid. We hope to serve you again!"""
        
        return self.send_sms(user.phone_number, message)
    
    def send_otp_sms(self, phone_number, otp):
        """Send OTP for verification"""
        message = f"""Your VehicAid verification code is: {otp}
This code will expire in 10 minutes.
Do not share this code with anyone."""
        
        return self.send_sms(phone_number, message)


# Singleton instance
sms_service = TwilioSMSService()
```

### Step 5: Update Docker Environment

Add to `infrastructure/docker-compose.yml` under `web` service:

```yaml
environment:
  - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
  - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
  - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
```

---

## 📧 SMS Templates

### Template Guidelines

**SMS Best Practices:**
- Keep messages under 160 characters (1 SMS unit)
- Include brand name (VehicAid)
- Be clear and concise
- Include action items
- Add opt-out option for marketing

### Example Templates

#### 1. Service Request Confirmation
```
VehicAid: Request #123 received. Service: Towing. Status: Pending. We'll notify you when assigned.
```

#### 2. Provider Assigned
```
VehicAid: Provider assigned! Name: John Doe, ID: PRO-12345. They'll contact you soon.
```

#### 3. Service In Progress
```
VehicAid: Your service has started. Provider is working on your vehicle. Request #123.
```

#### 4. Service Completed
```
VehicAid: Service completed! Request #123. Thank you for using VehicAid!
```

#### 5. OTP Verification
```
Your VehicAid OTP is: 123456. Valid for 10 minutes. Don't share this code.
```

#### 6. Payment Reminder
```
VehicAid: Payment pending for Request #123. Amount: ₹500. Pay now: vehicaid.com/pay/123
```

---

## 🧪 Testing SMS

### Method 1: Django Shell

```bash
python manage.py shell
```

```python
from apps.services.utils.sms_utils import sms_service

# Test SMS
result = sms_service.send_sms(
    to_number='+919876543210',  # Your verified number
    message='Test SMS from VehicAid platform!'
)

print(result)
```

### Method 2: Management Command

Create `backend/apps/services/management/commands/test_sms.py`:

```python
from django.core.management.base import BaseCommand
from apps.services.utils.sms_utils import sms_service

class Command(BaseCommand):
    help = 'Test Twilio SMS configuration'

    def add_arguments(self, parser):
        parser.add_argument('phone', type=str, help='Phone number with country code')
        parser.add_argument('--message', type=str, default='Test SMS from VehicAid!', help='Message to send')

    def handle(self, *args, **options):
        phone = options['phone']
        message = options['message']
        
        self.stdout.write(f'Sending SMS to {phone}...')
        
        result = sms_service.send_sms(phone, message)
        
        if result['success']:
            self.stdout.write(self.style.SUCCESS(f'✅ SMS sent successfully!'))
            self.stdout.write(f'Message SID: {result["sid"]}')
        else:
            self.stdout.write(self.style.ERROR(f'❌ Failed to send SMS'))
            self.stdout.write(f'Error: {result["error"]}')
```

Run test:
```bash
python manage.py test_sms +919876543210 --message "Hello from VehicAid!"
```

### Method 3: API Endpoint

Create test endpoint in `backend/apps/services/views.py`:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .utils.sms_utils import sms_service

@api_view(['POST'])
@permission_classes([IsAdminUser])
def test_sms(request):
    """Test SMS endpoint (admin only)"""
    phone = request.data.get('phone')
    message = request.data.get('message', 'Test SMS from VehicAid')
    
    if not phone:
        return Response({'error': 'Phone number required'}, status=400)
    
    result = sms_service.send_sms(phone, message)
    
    if result['success']:
        return Response({
            'success': True,
            'message': 'SMS sent successfully',
            'sid': result['sid']
        })
    else:
        return Response({
            'success': False,
            'error': result['error']
        }, status=500)
```

Test via API:
```bash
curl -X POST http://localhost:8001/api/v1/test-sms/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "message": "Test SMS"}'
```

---

## 💬 WhatsApp Integration

### Step 1: Enable WhatsApp Sandbox

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Follow instructions to join sandbox
3. Send "join [your-code]" to the Twilio WhatsApp number
4. You'll receive a confirmation

### Step 2: Send WhatsApp Messages

Add to `sms_utils.py`:

```python
def send_whatsapp(self, to_number, message):
    """
    Send WhatsApp message
    
    Args:
        to_number (str): Recipient phone number with country code
        message (str): Message content
    """
    if not self.client:
        return {'success': False, 'error': 'Twilio not configured'}
    
    try:
        # Format WhatsApp number
        if not to_number.startswith('whatsapp:'):
            if not to_number.startswith('+'):
                to_number = f'+91{to_number}'
            to_number = f'whatsapp:{to_number}'
        
        whatsapp_from = settings.TWILIO_WHATSAPP_NUMBER
        if not whatsapp_from.startswith('whatsapp:'):
            whatsapp_from = f'whatsapp:{whatsapp_from}'
        
        message_obj = self.client.messages.create(
            body=message,
            from_=whatsapp_from,
            to=to_number
        )
        
        logger.info(f"WhatsApp sent successfully. SID: {message_obj.sid}")
        return {
            'success': True,
            'sid': message_obj.sid,
            'status': message_obj.status
        }
        
    except Exception as e:
        logger.error(f"Failed to send WhatsApp: {str(e)}")
        return {'success': False, 'error': str(e)}
```

---

## 💰 Pricing (India)

### SMS Pricing
- **Outbound SMS**: ₹0.60 - ₹1.20 per message
- **Inbound SMS**: ₹0.60 per message
- **Phone Number**: ₹100-200 per month

### WhatsApp Pricing
- **Business-initiated**: ₹0.40 - ₹0.80 per message
- **User-initiated (24hr window)**: Free
- **Template messages**: Required for business-initiated

### Cost Estimation for VehicAid

**Assumptions:**
- 1000 service requests/month
- 3 SMS per request (confirmation, assigned, completed)
- Total: 3000 SMS/month

**Monthly Cost:**
- SMS: 3000 × ₹0.80 = ₹2,400
- Phone Number: ₹150
- **Total: ~₹2,550/month**

---

## 🔒 Security Best Practices

### 1. Protect Credentials
```python
# Never commit credentials
# Always use environment variables
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
```

### 2. Rate Limiting
```python
from django.core.cache import cache
from django.utils import timezone

def check_sms_rate_limit(phone_number, limit=5, period=3600):
    """
    Check if phone number has exceeded SMS rate limit
    
    Args:
        phone_number: Phone number to check
        limit: Maximum SMS allowed
        period: Time period in seconds (default: 1 hour)
    """
    cache_key = f'sms_rate_{phone_number}'
    count = cache.get(cache_key, 0)
    
    if count >= limit:
        return False
    
    cache.set(cache_key, count + 1, period)
    return True
```

### 3. Validate Phone Numbers
```python
from phonenumbers import parse, is_valid_number, NumberParseException

def validate_phone_number(phone_number):
    """Validate phone number format"""
    try:
        parsed = parse(phone_number, "IN")  # Default to India
        return is_valid_number(parsed)
    except NumberParseException:
        return False
```

### 4. Handle Failures
```python
def send_sms_with_retry(phone, message, max_retries=3):
    """Send SMS with retry logic"""
    for attempt in range(max_retries):
        result = sms_service.send_sms(phone, message)
        if result['success']:
            return result
        time.sleep(2 ** attempt)  # Exponential backoff
    return result
```

---

## 📊 Monitoring & Logging

### View SMS Logs in Twilio Console

1. Go to: https://console.twilio.com/us1/monitor/logs/sms
2. Filter by:
   - Date range
   - Status (delivered, failed, etc.)
   - Phone number

### Add Custom Logging

```python
import logging

logger = logging.getLogger('sms')

# Log all SMS attempts
logger.info(f"SMS sent to {phone}: {message[:50]}...")
logger.error(f"SMS failed: {error}")
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Unable to create record"
**Solution**: 
- Verify phone number for trial account
- Check phone number format (+919876543210)
- Ensure sufficient credit

### Issue 2: "Invalid 'To' Phone Number"
**Solution**:
- Add country code (+91 for India)
- Remove spaces and special characters
- Verify number is in E.164 format

### Issue 3: "Authentication Error"
**Solution**:
- Check Account SID and Auth Token
- Regenerate Auth Token if compromised
- Verify credentials in .env file

### Issue 4: Messages Not Delivered
**Solution**:
- Check Twilio logs for delivery status
- Verify recipient phone is active
- Check for carrier blocks
- Ensure message doesn't contain spam keywords

---

## 🚀 Production Checklist

- [ ] Upgrade to paid Twilio account
- [ ] Buy dedicated phone number
- [ ] Set up SMS templates
- [ ] Implement rate limiting
- [ ] Add phone number validation
- [ ] Set up monitoring/alerts
- [ ] Configure retry logic
- [ ] Add opt-out mechanism
- [ ] Test in production environment
- [ ] Monitor delivery rates

---

## 📈 Advanced Features

### 1. Two-Way SMS
```python
# Webhook endpoint for incoming SMS
@csrf_exempt
def sms_webhook(request):
    """Handle incoming SMS from Twilio"""
    from_number = request.POST.get('From')
    message_body = request.POST.get('Body')
    
    # Process incoming message
    # ...
    
    return HttpResponse(status=200)
```

### 2. SMS Delivery Status
```python
@csrf_exempt
def sms_status_callback(request):
    """Handle SMS delivery status updates"""
    message_sid = request.POST.get('MessageSid')
    status = request.POST.get('MessageStatus')
    
    # Update database with delivery status
    # ...
    
    return HttpResponse(status=200)
```

### 3. Bulk SMS
```python
def send_bulk_sms(recipients, message):
    """Send SMS to multiple recipients"""
    results = []
    for phone in recipients:
        result = sms_service.send_sms(phone, message)
        results.append(result)
        time.sleep(0.1)  # Rate limiting
    return results
```

---

## ✅ Quick Setup Checklist

- [ ] Create Twilio account
- [ ] Get Account SID and Auth Token
- [ ] Get phone number
- [ ] Verify recipient numbers (trial)
- [ ] Install twilio package
- [ ] Add credentials to .env
- [ ] Create SMS utility
- [ ] Test SMS sending
- [ ] Implement SMS templates
- [ ] Add error handling
- [ ] Set up logging

---

**Previous**: [SMTP Email Setup Guide](./SMTP_SETUP.md)

---

*Last Updated: January 17, 2026*
