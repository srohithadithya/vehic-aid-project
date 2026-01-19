# Fast2SMS Integration Documentation

## Overview

VehicAid uses **Fast2SMS** as the SMS gateway for sending transactional messages, OTPs, and notifications to users. Fast2SMS is chosen for its:
- Free tier (50 SMS/day)
- Indian market focus
- Simple API
- Reliable delivery
- Affordable pricing

---

## Implementation Details

### Location
- **Service Class**: `backend/apps/services/utils/sms_utils.py`
- **Alternative Service**: `backend/apps/services/services/sms.py`
- **Settings**: `backend/vehic_aid_backend/settings/base.py`
- **Test Command**: `backend/apps/services/management/commands/test_sms.py`

### Configuration

**Settings (base.py)**:
```python
SMS_PROVIDER = env('SMS_PROVIDER', default='fast2sms')
FAST2SMS_API_KEY = env('FAST2SMS_API_KEY', default='')
```

**Environment Variables**:
```env
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_api_key_from_fast2sms_dashboard
```

---

## API Specification

### Endpoint
```
POST https://www.fast2sms.com/dev/bulkV2
```

### Headers
```json
{
  "authorization": "YOUR_API_KEY",
  "Content-Type": "application/json"
}
```

### Request Payload
```json
{
  "route": "q",
  "message": "Your message here (max 160 chars)",
  "language": "english",
  "flash": 0,
  "numbers": "9876543210"
}
```

### Response (Success)
```json
{
  "return": true,
  "request_id": "abc123xyz",
  "message": ["SMS sent successfully"]
}
```

### Response (Failure)
```json
{
  "return": false,
  "message": "Error description"
}
```

---

## Service Class

### Fast2SMSService

```python
class Fast2SMSService:
    """Free SMS service using Fast2SMS (50 SMS/day free)"""
    
    def __init__(self):
        self.api_key = settings.FAST2SMS_API_KEY
        self.base_url = "https://www.fast2sms.com/dev/bulkV2"
    
    def send_sms(self, phone_number, message):
        """
        Send SMS via Fast2SMS
        
        Args:
            phone_number (str): 10-digit Indian mobile number
            message (str): SMS content (max 160 characters)
        
        Returns:
            dict: {
                'success': bool,
                'message_id': str (if successful),
                'error': str (if failed)
            }
        """
```

### Features

1. **Phone Number Cleaning**
   - Removes `+91` prefix
   - Removes spaces and hyphens
   - Validates 10-digit format

2. **Message Truncation**
   - Automatically truncates to 160 characters
   - Prevents API errors from long messages

3. **Error Handling**
   - Timeout handling (10 seconds)
   - Network error handling
   - API error handling
   - Structured error responses

4. **Logging**
   - Success logs with phone number
   - Error logs with details
   - Uses Django logging framework

---

## Usage Examples

### 1. Send OTP
```python
from apps.services.utils.sms_utils import sms_service

result = sms_service.send_otp_sms('9876543210', '123456')

if result['success']:
    print(f"OTP sent! Message ID: {result['message_id']}")
else:
    print(f"Failed: {result['error']}")
```

### 2. Service Request Confirmation
```python
result = sms_service.send_service_request_sms(user, service_request)
```

### 3. Provider Assignment Notification
```python
result = sms_service.send_provider_assigned_sms(user, service_request, provider)
```

### 4. Service Completion
```python
result = sms_service.send_service_completed_sms(user, service_request)
```

### 5. Custom Message
```python
result = sms_service.send_sms('9876543210', 'Your custom message here')
```

---

## Message Templates

### 1. OTP Message
```
Your VehicAid OTP: 123456. Valid for 10 min. Don't share.
```
**Length**: 56 characters

### 2. Service Request Received
```
VehicAid: Request #42 received. Service: Towing. We'll notify you when assigned.
```
**Length**: 82 characters

### 3. Provider Assigned
```
VehicAid: Provider John Doe assigned to request #42. They'll contact you soon.
```
**Length**: 80 characters

### 4. Service Completed
```
VehicAid: Service request #42 completed! Thank you for using VehicAid.
```
**Length**: 71 characters

### 5. Subscription Expiry Alert
```
Hi username, your Vehic-Aid Premium Plan expires in 3 days. Renew now to continue enjoying premium benefits!
```
**Length**: ~105 characters (varies with username and plan)

### 6. Subscription Renewed
```
Your Vehic-Aid Premium Plan has been renewed successfully. Thank you for choosing Vehic-Aid!
```
**Length**: 91 characters

---

## Testing

### Command Line Test
```bash
# Basic test
python manage.py test_sms 9876543210

# Custom message
python manage.py test_sms 9876543210 --message "Test from VehicAid!"

# Expected output (success):
# Sending SMS to 9876543210...
# ✅ SMS sent successfully!
# Message ID: abc123xyz

# Expected output (failure):
# Sending SMS to 9876543210...
# ❌ Failed to send SMS
# Error: Invalid API key
```

### Python Test
```python
from apps.services.utils.sms_utils import sms_service

# Test basic SMS
result = sms_service.send_sms('9876543210', 'Test message')
print(result)

# Test OTP
result = sms_service.send_otp_sms('9876543210', '123456')
print(result)
```

---

## Rate Limits & Pricing

### Free Tier
- **Daily Limit**: 50 SMS/day
- **Cost**: ₹0
- **Best For**: Development, testing, small-scale deployments

### Paid Plans
| Plan | Price per SMS | Monthly Cost (approx) |
|------|---------------|----------------------|
| Pay-as-you-go | ₹0.10 - ₹0.15 | Based on usage |
| Bulk Plans | ₹0.08 - ₹0.12 | Discounts on volume |

### Usage Estimates for VehicAid
Assuming 100 service requests/day:
- OTP: 100 SMS
- Request confirmation: 100 SMS
- Provider assignment: 100 SMS
- Service completion: 100 SMS
- **Total**: ~400 SMS/day

**Monthly Cost**: 400 × 30 × ₹0.10 = ₹1,200/month

---

## Error Handling

### Common Errors

1. **Invalid API Key**
```python
{
    'success': False,
    'error': 'Invalid authorization key'
}
```
**Solution**: Check FAST2SMS_API_KEY in .env

2. **Invalid Phone Number**
```python
{
    'success': False,
    'error': 'Invalid phone number'
}
```
**Solution**: Ensure 10-digit Indian mobile number

3. **Timeout**
```python
{
    'success': False,
    'error': 'Request timeout'
}
```
**Solution**: Check internet connection, retry

4. **Daily Limit Exceeded**
```python
{
    'success': False,
    'error': 'Daily limit exceeded'
}
```
**Solution**: Upgrade to paid plan or wait for reset

---

## Best Practices

### 1. Message Length
- Keep messages under 160 characters
- Use abbreviations where appropriate
- Test message templates before deployment

### 2. Phone Number Validation
- Always validate before sending
- Store numbers in E.164 format (+919876543210)
- Clean before sending to API

### 3. Error Handling
```python
result = sms_service.send_sms(phone, message)

if not result['success']:
    # Log error
    logger.error(f"SMS failed: {result['error']}")
    
    # Fallback to email or push notification
    send_email_notification(user, message)
    
    # Or queue for retry
    retry_sms.delay(phone, message)
```

### 4. Rate Limiting
```python
from django.core.cache import cache

def send_sms_with_rate_limit(phone, message):
    # Check if SMS sent recently (prevent duplicates)
    cache_key = f"sms_sent_{phone}_{hash(message)}"
    
    if cache.get(cache_key):
        return {'success': False, 'error': 'Duplicate SMS prevented'}
    
    # Send SMS
    result = sms_service.send_sms(phone, message)
    
    # Cache for 5 minutes
    if result['success']:
        cache.set(cache_key, True, 300)
    
    return result
```

### 5. Logging
```python
import logging

logger = logging.getLogger(__name__)

# Log all SMS attempts
logger.info(f"Sending SMS to {phone}: {message[:50]}...")

# Log results
if result['success']:
    logger.info(f"SMS sent successfully. ID: {result['message_id']}")
else:
    logger.error(f"SMS failed: {result['error']}")
```

---

## Security Considerations

### 1. API Key Protection
- Never commit API keys to Git
- Use environment variables
- Rotate keys periodically
- Restrict API key to your IP (in Fast2SMS dashboard)

### 2. Phone Number Privacy
- Don't log full phone numbers in production
- Mask numbers in logs: `98765*****`
- Comply with GDPR/data protection laws

### 3. Message Content
- Don't send sensitive data via SMS
- Use secure links for password resets
- Implement OTP expiry (10 minutes)

---

## Monitoring & Analytics

### Track SMS Metrics
```python
from apps.services.models import SMSMessageLog

# Log every SMS sent
SMSMessageLog.objects.create(
    to_number=phone,
    message_body=message,
    status='SENT' if result['success'] else 'FAILED',
    gateway_response=str(result)
)

# Query metrics
total_sent = SMSMessageLog.objects.filter(status='SENT').count()
total_failed = SMSMessageLog.objects.filter(status='FAILED').count()
success_rate = (total_sent / (total_sent + total_failed)) * 100
```

### Dashboard Metrics
- Total SMS sent (daily/monthly)
- Success rate
- Failure reasons
- Cost tracking
- Peak usage times

---

## Troubleshooting

### SMS Not Received

1. **Check API Response**
   ```python
   result = sms_service.send_sms(phone, message)
   print(result)  # Check for errors
   ```

2. **Verify Phone Number**
   - Must be 10 digits
   - Must be Indian mobile number
   - Must be active

3. **Check Fast2SMS Dashboard**
   - Login to Fast2SMS
   - Check SMS logs
   - Verify delivery status

4. **Check DND Status**
   - If user is on DND, promotional SMS won't deliver
   - Use transactional route (route='q')

### API Key Issues

1. **Invalid Key Error**
   - Regenerate key in Fast2SMS dashboard
   - Update .env file
   - Restart Django server

2. **Key Not Found**
   - Check .env file exists
   - Check environment variable is loaded
   - Verify settings.py reads correctly

---

## Migration Guide

### From Other SMS Providers

If migrating from Twilio/MSG91:

1. **Update Environment Variables**
   ```env
   # Old
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   
   # New
   SMS_PROVIDER=fast2sms
   FAST2SMS_API_KEY=...
   ```

2. **Update Code**
   ```python
   # Old
   from twilio.rest import Client
   client = Client(account_sid, auth_token)
   
   # New
   from apps.services.utils.sms_utils import sms_service
   result = sms_service.send_sms(phone, message)
   ```

3. **Update Phone Format**
   - Fast2SMS expects 10-digit numbers
   - Remove country code before sending

---

## Future Enhancements

### Planned Features
1. **SMS Templates**: Pre-defined templates with variables
2. **Bulk SMS**: Send to multiple recipients
3. **Scheduled SMS**: Queue SMS for later delivery
4. **Unicode Support**: Send messages in Hindi/regional languages
5. **Delivery Reports**: Track delivery status
6. **A/B Testing**: Test different message formats
7. **Smart Retry**: Automatic retry on failure

### Alternative Providers
If Fast2SMS becomes unreliable:
- **Twilio**: International, reliable, expensive
- **MSG91**: Indian, feature-rich, moderate pricing
- **Kaleyra**: Enterprise-grade, high volume

---

## Support

### Fast2SMS Support
- **Website**: https://www.fast2sms.com
- **Support Email**: support@fast2sms.com
- **Documentation**: https://docs.fast2sms.com

### VehicAid Internal
- **SMS Service Owner**: Backend Team
- **File Location**: `backend/apps/services/utils/sms_utils.py`
- **Issues**: Report to backend team lead

---

**Last Updated**: January 19, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
