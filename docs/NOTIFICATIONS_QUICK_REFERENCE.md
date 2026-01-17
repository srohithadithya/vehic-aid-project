# 📧📱 SMTP & Twilio Quick Reference Guide

## 🚀 Quick Setup Overview

This guide provides a quick reference for setting up email (SMTP) and SMS (Twilio) notifications in VehicAid.

---

## 📧 SMTP Email Setup (5 Minutes)

### Gmail Setup (Recommended for Development)

1. **Enable 2FA**: https://myaccount.google.com/security
2. **Generate App Password**: https://myaccount.google.com/apppasswords
3. **Add to `.env`**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_16_char_app_password
```

4. **Test**:
```bash
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Hello!', 'from@example.com', ['to@example.com'])
```

### Professional Services (Production)

| Service | Free Tier | Best For | Setup Time |
|---------|-----------|----------|------------|
| **SendGrid** | 100/day | Transactional emails | 10 min |
| **Mailgun** | 5,000/month | High volume | 10 min |
| **Amazon SES** | 62,000/month | Very high volume | 15 min |

---

## 📱 Twilio SMS Setup (10 Minutes)

### Quick Start

1. **Create Account**: https://www.twilio.com/try-twilio
2. **Get Credentials**: https://console.twilio.com/
   - Copy **Account SID**
   - Copy **Auth Token**
3. **Get Phone Number**: Console → Phone Numbers → Get a trial number
4. **Verify Recipients** (Trial only): Console → Phone Numbers → Verified Numbers

### Add to `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Install & Test:
```bash
pip install twilio
python manage.py shell
>>> from twilio.rest import Client
>>> client = Client('ACCOUNT_SID', 'AUTH_TOKEN')
>>> message = client.messages.create(
...     body='Test from VehicAid!',
...     from_='+1234567890',
...     to='+919876543210'
... )
>>> print(message.sid)
```

---

## 🔧 Django Integration

### Install Dependencies
```bash
pip install twilio
pip freeze > requirements.txt
```

### Update `settings.py`
```python
# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

# Twilio
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
```

---

## 📝 Usage Examples

### Send Email
```python
from django.core.mail import send_mail

send_mail(
    subject='Service Request Confirmation',
    message='Your request #123 has been received.',
    from_email='noreply@vehicaid.com',
    recipient_list=['customer@example.com'],
    fail_silently=False,
)
```

### Send SMS
```python
from twilio.rest import Client
from django.conf import settings

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

message = client.messages.create(
    body='VehicAid: Request #123 received!',
    from_=settings.TWILIO_PHONE_NUMBER,
    to='+919876543210'
)
```

---

## 💰 Cost Comparison

### Email Costs (Monthly)

| Service | Free Tier | Paid (1000 emails) | Paid (10,000 emails) |
|---------|-----------|-------------------|---------------------|
| Gmail | Free | N/A | N/A |
| SendGrid | 100/day | $15 | $15 |
| Mailgun | 5,000/month | Free | $35 |
| Amazon SES | 62,000/month | Free | $1 |

### SMS Costs (India)

| Volume | Cost per SMS | Monthly (1000 SMS) | Monthly (10,000 SMS) |
|--------|-------------|-------------------|---------------------|
| Twilio | ₹0.60-0.80 | ₹600-800 | ₹6,000-8,000 |
| + Phone Number | ₹150/month | ₹150 | ₹150 |
| **Total** | - | **₹750-950** | **₹6,150-8,150** |

---

## 🎯 When to Use What

### Use Email For:
- ✅ Detailed information
- ✅ Receipts and invoices
- ✅ Marketing campaigns
- ✅ Non-urgent notifications
- ✅ Rich content (HTML, images)

### Use SMS For:
- ✅ Time-sensitive alerts
- ✅ OTP verification
- ✅ Critical updates
- ✅ High open rates needed
- ✅ Users without email

### Use Both For:
- ✅ Service request confirmations
- ✅ Provider assignments
- ✅ Payment confirmations
- ✅ Important status changes

---

## ⚠️ Common Issues

### Email Issues

| Problem | Solution |
|---------|----------|
| Authentication failed | Use App Password (Gmail) |
| Emails go to spam | Use professional service (SendGrid) |
| Connection timeout | Check firewall, try port 465 |

### SMS Issues

| Problem | Solution |
|---------|----------|
| Invalid phone number | Add country code (+91) |
| Not delivered | Verify number (trial account) |
| Authentication error | Check SID and Auth Token |

---

## 🔒 Security Checklist

- [ ] Never commit credentials to Git
- [ ] Use environment variables
- [ ] Enable 2FA on email account
- [ ] Use App Passwords (not main password)
- [ ] Rotate credentials regularly
- [ ] Implement rate limiting
- [ ] Log all notifications
- [ ] Handle failures gracefully

---

## 📊 Monitoring

### Email Monitoring
```python
# Add to settings.py
LOGGING = {
    'loggers': {
        'django.core.mail': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },
}
```

### SMS Monitoring
- Twilio Console: https://console.twilio.com/us1/monitor/logs/sms
- Check delivery status
- Monitor failed messages
- Track costs

---

## 🚀 Production Recommendations

### Email (Production)
1. **Use SendGrid or Mailgun**
2. Set up SPF/DKIM records
3. Monitor delivery rates
4. Implement retry logic
5. Use email templates

### SMS (Production)
1. **Upgrade to paid Twilio account**
2. Buy dedicated phone number
3. Implement rate limiting
4. Add phone validation
5. Monitor delivery rates
6. Set up webhooks for status

---

## 📚 Full Documentation

- **SMTP Setup**: [docs/SMTP_SETUP.md](./SMTP_SETUP.md)
- **Twilio Setup**: [docs/TWILIO_SETUP.md](./TWILIO_SETUP.md)

---

## ✅ Setup Checklist

### Email
- [ ] Gmail account with 2FA
- [ ] App Password generated
- [ ] Credentials in `.env`
- [ ] Test email sent successfully

### SMS
- [ ] Twilio account created
- [ ] Phone number obtained
- [ ] Recipients verified (trial)
- [ ] Credentials in `.env`
- [ ] Test SMS sent successfully

### Integration
- [ ] Dependencies installed
- [ ] Settings updated
- [ ] Utility functions created
- [ ] Error handling added
- [ ] Logging configured

---

## 🎓 Next Steps

1. **Read Full Guides**:
   - [SMTP Setup Guide](./SMTP_SETUP.md)
   - [Twilio Setup Guide](./TWILIO_SETUP.md)

2. **Implement Notifications**:
   - Service request confirmations
   - Provider assignments
   - Status updates
   - Payment confirmations

3. **Test Thoroughly**:
   - Development environment
   - Staging environment
   - Production environment

4. **Monitor & Optimize**:
   - Track delivery rates
   - Monitor costs
   - Optimize templates
   - Handle failures

---

*Last Updated: January 17, 2026*
