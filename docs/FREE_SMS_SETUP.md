# 📱 Free SMS Setup Guide for VehicAid

## Overview
This guide covers **FREE SMS services** for the VehicAid platform. Perfect for development, testing, and small-scale production.

---

## 🆓 Free SMS Services Comparison

| Service | Free Tier | Best For | Setup Time |
|---------|-----------|----------|------------|
| **Textlocal** | 25 SMS/day | India-focused | 5 min |
| **Fast2SMS** | 50 SMS/day | India, Easy setup | 5 min |
| **MSG91** | 100 SMS/day | India, Professional | 10 min |
| **Vonage (Nexmo)** | €2 credit | International | 10 min |
| **Sinch** | Free trial | Global | 10 min |

---

## 🇮🇳 Option 1: Textlocal (Recommended for India)

### Features
- ✅ **25 FREE SMS per day**
- ✅ India-focused
- ✅ No credit card required
- ✅ Simple API
- ✅ Supports Unicode (Hindi, etc.)

### Step 1: Create Account

1. Go to: https://www.textlocal.in/signup/
2. Fill in details:
   - Name
   - Email
   - Phone number
   - Password
3. Verify email and phone
4. Login to dashboard

### Step 2: Get API Key

1. Go to: https://www.textlocal.in/user/index.php/settings/api/
2. Click **Create New API Key**
3. Enter key name: "VehicAid"
4. Copy the API key (starts with your username)

### Step 3: Get Sender ID

1. Go to: https://www.textlocal.in/user/index.php/settings/sender/
2. Request a sender ID (e.g., "VEHAID")
3. Wait for approval (usually 24-48 hours)
4. For testing, use: **TXTLCL** (default sender ID)

### Django Integration

#### Install Package
```bash
pip install requests
```

#### Add to `.env`
```env
# Textlocal Configuration
TEXTLOCAL_API_KEY=your_api_key_here
TEXTLOCAL_SENDER=TXTLCL
```

#### Create Utility (`backend/apps/services/utils/sms_utils.py`)

```python
import requests
import logging
from django.conf import settings
from urllib.parse import quote

logger = logging.getLogger(__name__)

class TextlocalSMSService:
    """Free SMS service using Textlocal (India)"""
    
    def __init__(self):
        self.api_key = settings.TEXTLOCAL_API_KEY
        self.sender = settings.TEXTLOCAL_SENDER
        self.base_url = "https://api.textlocal.in/send/"
    
    def send_sms(self, phone_number, message):
        """
        Send SMS via Textlocal
        
        Args:
            phone_number (str): 10-digit Indian mobile number (without +91)
            message (str): SMS content (max 160 characters)
        
        Returns:
            dict: Response with success status
        """
        try:
            # Remove +91 if present
            phone_number = phone_number.replace('+91', '').replace(' ', '')
            
            # Validate 10-digit number
            if len(phone_number) != 10:
                return {'success': False, 'error': 'Invalid phone number'}
            
            # Prepare data
            data = {
                'apikey': self.api_key,
                'numbers': phone_number,
                'message': message,
                'sender': self.sender
            }
            
            # Send request
            response = requests.post(self.base_url, data=data)
            result = response.json()
            
            if result.get('status') == 'success':
                logger.info(f"SMS sent successfully to {phone_number}")
                return {
                    'success': True,
                    'message_id': result.get('messages', [{}])[0].get('id'),
                    'balance': result.get('balance')
                }
            else:
                logger.error(f"SMS failed: {result.get('errors')}")
                return {
                    'success': False,
                    'error': result.get('errors', [{}])[0].get('message')
                }
                
        except Exception as e:
            logger.error(f"SMS exception: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_service_request_sms(self, user, service_request):
        """Send SMS when service request is created"""
        message = f"VehicAid: Request #{service_request.id} received. Service: {service_request.get_service_type_display()}. We'll notify you when assigned."
        return self.send_sms(user.phone_number, message)
    
    def send_provider_assigned_sms(self, user, service_request, provider):
        """Send SMS when provider is assigned"""
        message = f"VehicAid: Provider {provider.get_full_name()} assigned to request #{service_request.id}. They'll contact you soon."
        return self.send_sms(user.phone_number, message)
    
    def send_otp_sms(self, phone_number, otp):
        """Send OTP for verification"""
        message = f"Your VehicAid OTP is: {otp}. Valid for 10 minutes. Don't share this code."
        return self.send_sms(phone_number, message)


# Singleton instance
sms_service = TextlocalSMSService()
```

---

## 🇮🇳 Option 2: Fast2SMS (Alternative)

### Features
- ✅ **50 FREE SMS per day**
- ✅ Very easy setup
- ✅ India only
- ✅ Instant activation

### Setup

1. **Sign up**: https://www.fast2sms.com/
2. **Get API Key**: Dashboard → API Keys
3. **Add to `.env`**:
```env
FAST2SMS_API_KEY=your_api_key_here
```

### Code Implementation

```python
import requests
from django.conf import settings

class Fast2SMSService:
    """Free SMS using Fast2SMS"""
    
    def __init__(self):
        self.api_key = settings.FAST2SMS_API_KEY
        self.base_url = "https://www.fast2sms.com/dev/bulkV2"
    
    def send_sms(self, phone_number, message):
        """Send SMS via Fast2SMS"""
        try:
            phone_number = phone_number.replace('+91', '').replace(' ', '')
            
            headers = {
                'authorization': self.api_key,
                'Content-Type': 'application/json'
            }
            
            payload = {
                'route': 'q',  # Quick route
                'message': message,
                'language': 'english',
                'flash': 0,
                'numbers': phone_number
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            result = response.json()
            
            if result.get('return'):
                return {
                    'success': True,
                    'message_id': result.get('request_id')
                }
            else:
                return {
                    'success': False,
                    'error': result.get('message')
                }
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
```

---

## 🇮🇳 Option 3: MSG91 (Professional Free Tier)

### Features
- ✅ **100 FREE SMS per day**
- ✅ Professional service
- ✅ OTP templates
- ✅ Good for production

### Setup

1. **Sign up**: https://msg91.com/signup
2. **Verify account**
3. **Get Auth Key**: Settings → API Keys
4. **Create Template** (for OTP):
   - Go to Templates
   - Create OTP template
   - Get Template ID

### Code Implementation

```python
import requests
from django.conf import settings

class MSG91Service:
    """Free SMS using MSG91"""
    
    def __init__(self):
        self.auth_key = settings.MSG91_AUTH_KEY
        self.sender_id = settings.MSG91_SENDER_ID
        self.base_url = "https://api.msg91.com/api/v5/flow/"
    
    def send_otp(self, phone_number, otp):
        """Send OTP via MSG91"""
        try:
            phone_number = phone_number.replace('+91', '').replace(' ', '')
            
            headers = {
                'authkey': self.auth_key,
                'content-type': 'application/json'
            }
            
            payload = {
                'flow_id': settings.MSG91_TEMPLATE_ID,
                'sender': self.sender_id,
                'mobiles': f'91{phone_number}',
                'otp': otp
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            result = response.json()
            
            if result.get('type') == 'success':
                return {'success': True, 'message_id': result.get('request_id')}
            else:
                return {'success': False, 'error': result.get('message')}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
```

---

## 🌍 Option 4: Vonage (Nexmo) - International

### Features
- ✅ **€2 free credit** (~₹180)
- ✅ Global coverage
- ✅ Professional API
- ✅ Good documentation

### Setup

1. **Sign up**: https://dashboard.nexmo.com/sign-up
2. **Get API credentials**
3. **Install SDK**:
```bash
pip install vonage
```

### Code Implementation

```python
import vonage
from django.conf import settings

class VonageSMSService:
    """SMS using Vonage (free credit)"""
    
    def __init__(self):
        self.client = vonage.Client(
            key=settings.VONAGE_API_KEY,
            secret=settings.VONAGE_API_SECRET
        )
        self.sms = vonage.Sms(self.client)
    
    def send_sms(self, phone_number, message):
        """Send SMS via Vonage"""
        try:
            if not phone_number.startswith('+'):
                phone_number = f'+91{phone_number}'
            
            response = self.sms.send_message({
                'from': 'VehicAid',
                'to': phone_number,
                'text': message
            })
            
            if response['messages'][0]['status'] == '0':
                return {'success': True, 'message_id': response['messages'][0]['message-id']}
            else:
                return {'success': False, 'error': response['messages'][0]['error-text']}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
```

---

## 🔧 Unified SMS Service (Use Any Provider)

Create a unified service that can switch between providers:

```python
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class UnifiedSMSService:
    """Unified SMS service supporting multiple providers"""
    
    def __init__(self):
        self.provider = settings.SMS_PROVIDER  # 'textlocal', 'fast2sms', 'msg91', 'vonage'
        
        if self.provider == 'textlocal':
            from .textlocal import TextlocalSMSService
            self.service = TextlocalSMSService()
        elif self.provider == 'fast2sms':
            from .fast2sms import Fast2SMSService
            self.service = Fast2SMSService()
        elif self.provider == 'msg91':
            from .msg91 import MSG91Service
            self.service = MSG91Service()
        elif self.provider == 'vonage':
            from .vonage import VonageSMSService
            self.service = VonageSMSService()
        else:
            logger.warning(f"Unknown SMS provider: {self.provider}")
            self.service = None
    
    def send_sms(self, phone_number, message):
        """Send SMS using configured provider"""
        if not self.service:
            return {'success': False, 'error': 'SMS service not configured'}
        
        return self.service.send_sms(phone_number, message)
    
    def send_service_request_sms(self, user, service_request):
        """Send service request confirmation"""
        message = f"VehicAid: Request #{service_request.id} received. Service: {service_request.get_service_type_display()}."
        return self.send_sms(user.phone_number, message)
    
    def send_provider_assigned_sms(self, user, service_request, provider):
        """Send provider assignment notification"""
        message = f"VehicAid: Provider {provider.get_full_name()} assigned to #{service_request.id}."
        return self.send_sms(user.phone_number, message)
    
    def send_otp_sms(self, phone_number, otp):
        """Send OTP"""
        message = f"Your VehicAid OTP: {otp}. Valid for 10 min. Don't share."
        return self.send_sms(phone_number, message)


# Global instance
sms_service = UnifiedSMSService()
```

---

## ⚙️ Configuration

### Update `settings.py`

```python
# SMS Configuration
SMS_PROVIDER = os.getenv('SMS_PROVIDER', 'textlocal')  # textlocal, fast2sms, msg91, vonage

# Textlocal
TEXTLOCAL_API_KEY = os.getenv('TEXTLOCAL_API_KEY', '')
TEXTLOCAL_SENDER = os.getenv('TEXTLOCAL_SENDER', 'TXTLCL')

# Fast2SMS
FAST2SMS_API_KEY = os.getenv('FAST2SMS_API_KEY', '')

# MSG91
MSG91_AUTH_KEY = os.getenv('MSG91_AUTH_KEY', '')
MSG91_SENDER_ID = os.getenv('MSG91_SENDER_ID', '')
MSG91_TEMPLATE_ID = os.getenv('MSG91_TEMPLATE_ID', '')

# Vonage
VONAGE_API_KEY = os.getenv('VONAGE_API_KEY', '')
VONAGE_API_SECRET = os.getenv('VONAGE_API_SECRET', '')
```

### Update `.env`

```env
# Choose your SMS provider
SMS_PROVIDER=textlocal

# Textlocal (Recommended - 25 SMS/day free)
TEXTLOCAL_API_KEY=your_api_key_here
TEXTLOCAL_SENDER=TXTLCL

# OR Fast2SMS (50 SMS/day free)
# FAST2SMS_API_KEY=your_api_key_here

# OR MSG91 (100 SMS/day free)
# MSG91_AUTH_KEY=your_auth_key_here
# MSG91_SENDER_ID=VEHAID
# MSG91_TEMPLATE_ID=your_template_id

# OR Vonage (€2 free credit)
# VONAGE_API_KEY=your_api_key
# VONAGE_API_SECRET=your_api_secret
```

---

## 🧪 Testing

### Test Command

Create `backend/apps/services/management/commands/test_sms.py`:

```python
from django.core.management.base import BaseCommand
from apps.services.utils.sms_utils import sms_service

class Command(BaseCommand):
    help = 'Test SMS configuration'

    def add_arguments(self, parser):
        parser.add_argument('phone', type=str, help='10-digit phone number')
        parser.add_argument('--message', type=str, default='Test from VehicAid!', help='Message')

    def handle(self, *args, **options):
        phone = options['phone']
        message = options['message']
        
        self.stdout.write(f'Sending SMS to {phone}...')
        
        result = sms_service.send_sms(phone, message)
        
        if result['success']:
            self.stdout.write(self.style.SUCCESS('✅ SMS sent successfully!'))
            if 'message_id' in result:
                self.stdout.write(f'Message ID: {result["message_id"]}')
            if 'balance' in result:
                self.stdout.write(f'Remaining balance: {result["balance"]}')
        else:
            self.stdout.write(self.style.ERROR('❌ Failed to send SMS'))
            self.stdout.write(f'Error: {result.get("error")}')
```

### Run Test

```bash
python manage.py test_sms 9876543210 --message "Hello from VehicAid!"
```

---

## 💰 Cost Comparison

| Service | Free Tier | After Free | Best For |
|---------|-----------|------------|----------|
| **Textlocal** | 25/day | ₹0.20/SMS | Small apps |
| **Fast2SMS** | 50/day | ₹0.15/SMS | Testing |
| **MSG91** | 100/day | ₹0.18/SMS | Production |
| **Vonage** | €2 credit | ₹0.50/SMS | International |

---

## ✅ Recommendations

### For Development:
**Use Textlocal** (25 SMS/day free)
- Easy setup
- India-focused
- Reliable

### For Testing:
**Use Fast2SMS** (50 SMS/day free)
- More free SMS
- Quick setup
- Good for testing

### For Production (Small Scale):
**Use MSG91** (100 SMS/day free)
- Professional
- OTP templates
- Good deliverability

### For Production (Large Scale):
**Upgrade to paid plan** of any service
- Better rates
- Higher limits
- Priority support

---

## 🔒 Security Best Practices

1. **Never commit API keys**
2. **Use environment variables**
3. **Implement rate limiting**
4. **Validate phone numbers**
5. **Log all SMS attempts**
6. **Handle failures gracefully**

---

## ⚠️ Limitations of Free Services

- ✅ Daily limits (25-100 SMS)
- ✅ India only (most services)
- ✅ May include promotional footer
- ✅ Slower delivery than paid
- ✅ Limited support

---

## 🚀 Quick Setup Checklist

- [ ] Choose SMS provider (Textlocal recommended)
- [ ] Create account
- [ ] Get API key
- [ ] Add to `.env`
- [ ] Install dependencies
- [ ] Create SMS utility
- [ ] Test SMS sending
- [ ] Implement in application

---

**Recommended**: Start with **Textlocal** (25 SMS/day free) for development and testing!

---

*Last Updated: January 20, 2026*
