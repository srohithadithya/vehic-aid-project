# 📧 SMTP Email Setup Guide for VehicAid

## Overview
This guide will help you set up email notifications for the VehicAid platform using SMTP (Simple Mail Transfer Protocol).

---

## 📋 Table of Contents
1. [Gmail SMTP Setup (Recommended)](#gmail-smtp-setup)
2. [Other Email Providers](#other-email-providers)
3. [Django Configuration](#django-configuration)
4. [Testing Email](#testing-email)
5. [Email Templates](#email-templates)

---

## 📧 Gmail SMTP Setup (Recommended)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification**
4. Follow the setup wizard

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: **VehicAid Platform**
5. Click **Generate**
6. **Copy the 16-character password** (you won't see it again!)

### Step 3: SMTP Configuration Details

```
SMTP Server: smtp.gmail.com
SMTP Port: 587 (TLS) or 465 (SSL)
Username: your_email@gmail.com
Password: [16-character app password from Step 2]
Security: TLS/STARTTLS
```

---

## 🔧 Other Email Providers

### **Outlook/Hotmail**
```
SMTP Server: smtp-mail.outlook.com
Port: 587
Security: STARTTLS
Username: your_email@outlook.com
Password: your_password
```

### **Yahoo Mail**
```
SMTP Server: smtp.mail.yahoo.com
Port: 587
Security: STARTTLS
Username: your_email@yahoo.com
Password: your_app_password
```

### **SendGrid (Professional)**
```
SMTP Server: smtp.sendgrid.net
Port: 587
Security: STARTTLS
Username: apikey
Password: [Your SendGrid API Key]
```

### **Mailgun (Professional)**
```
SMTP Server: smtp.mailgun.org
Port: 587
Security: STARTTLS
Username: postmaster@your-domain.mailgun.org
Password: [Your Mailgun SMTP Password]
```

---

## ⚙️ Django Configuration

### Step 1: Update Environment Variables

Add to `backend/.env`:

```env
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_16_char_app_password
DEFAULT_FROM_EMAIL=VehicAid <your_email@gmail.com>
SERVER_EMAIL=your_email@gmail.com
```

### Step 2: Update Django Settings

Add to `backend/vehic_aid_backend/settings.py`:

```python
# Email Configuration
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'VehicAid <noreply@vehicaid.com>')
SERVER_EMAIL = os.getenv('SERVER_EMAIL', DEFAULT_FROM_EMAIL)

# Email timeout
EMAIL_TIMEOUT = 10
```

### Step 3: Update Docker Environment

Add to `infrastructure/docker-compose.yml` under `web` service environment:

```yaml
environment:
  - EMAIL_HOST=smtp.gmail.com
  - EMAIL_PORT=587
  - EMAIL_USE_TLS=True
  - EMAIL_HOST_USER=${EMAIL_HOST_USER}
  - EMAIL_HOST_PASSWORD=${EMAIL_HOST_PASSWORD}
  - DEFAULT_FROM_EMAIL=VehicAid <${EMAIL_HOST_USER}>
```

---

## 🧪 Testing Email

### Method 1: Django Shell

```bash
# Enter Django shell
python manage.py shell

# Test email
from django.core.mail import send_mail

send_mail(
    'VehicAid Test Email',
    'This is a test email from VehicAid platform.',
    'your_email@gmail.com',
    ['recipient@example.com'],
    fail_silently=False,
)
```

### Method 2: Management Command

Create `backend/apps/services/management/commands/test_email.py`:

```python
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = 'Test email configuration'

    def add_arguments(self, parser):
        parser.add_argument('recipient', type=str, help='Recipient email address')

    def handle(self, *args, **options):
        recipient = options['recipient']
        
        try:
            send_mail(
                subject='VehicAid - Email Configuration Test',
                message='If you receive this email, your SMTP configuration is working correctly!',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Test email sent successfully to {recipient}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Failed to send email: {str(e)}'))
```

Run test:
```bash
python manage.py test_email your_email@example.com
```

---

## 📧 Email Templates

### Create Email Utility

Create `backend/apps/services/utils/email_utils.py`:

```python
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_service_request_email(user, service_request):
    """Send email when service request is created"""
    try:
        subject = f'Service Request #{service_request.id} - Confirmation'
        
        # Plain text version
        text_content = f"""
        Dear {user.get_full_name() or user.username},
        
        Your service request has been received successfully.
        
        Request ID: {service_request.id}
        Service Type: {service_request.get_service_type_display()}
        Status: {service_request.get_status_display()}
        
        We will notify you once a provider is assigned.
        
        Thank you for using VehicAid!
        
        Best regards,
        VehicAid Team
        """
        
        # HTML version (optional)
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">Service Request Confirmation</h2>
                <p>Dear {user.get_full_name() or user.username},</p>
                <p>Your service request has been received successfully.</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Request ID:</strong> {service_request.id}</p>
                    <p><strong>Service Type:</strong> {service_request.get_service_type_display()}</p>
                    <p><strong>Status:</strong> {service_request.get_status_display()}</p>
                </div>
                
                <p>We will notify you once a provider is assigned.</p>
                
                <p>Thank you for using VehicAid!</p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 12px;">
                    VehicAid - Your Trusted Roadside Assistance Partner
                </p>
            </div>
        </body>
        </html>
        """
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        
        logger.info(f"Service request email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send service request email: {str(e)}")
        return False


def send_provider_assigned_email(user, service_request, provider):
    """Send email when provider is assigned"""
    try:
        subject = f'Provider Assigned - Request #{service_request.id}'
        
        text_content = f"""
        Dear {user.get_full_name() or user.username},
        
        Good news! A service provider has been assigned to your request.
        
        Request ID: {service_request.id}
        Provider: {provider.get_full_name()}
        Provider ID: {provider.provider_id}
        
        The provider will contact you shortly.
        
        Best regards,
        VehicAid Team
        """
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #10b981;">Provider Assigned! 🚗</h2>
                <p>Dear {user.get_full_name() or user.username},</p>
                <p>Good news! A service provider has been assigned to your request.</p>
                
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                    <p><strong>Request ID:</strong> {service_request.id}</p>
                    <p><strong>Provider:</strong> {provider.get_full_name()}</p>
                    <p><strong>Provider ID:</strong> {provider.provider_id}</p>
                </div>
                
                <p>The provider will contact you shortly.</p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 12px;">
                    VehicAid - Your Trusted Roadside Assistance Partner
                </p>
            </div>
        </body>
        </html>
        """
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        
        logger.info(f"Provider assigned email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send provider assigned email: {str(e)}")
        return False


def send_service_completed_email(user, service_request):
    """Send email when service is completed"""
    try:
        subject = f'Service Completed - Request #{service_request.id}'
        
        text_content = f"""
        Dear {user.get_full_name() or user.username},
        
        Your service request has been completed successfully!
        
        Request ID: {service_request.id}
        Service Type: {service_request.get_service_type_display()}
        
        Thank you for using VehicAid. We hope to serve you again!
        
        Best regards,
        VehicAid Team
        """
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #10b981;">Service Completed! ✅</h2>
                <p>Dear {user.get_full_name() or user.username},</p>
                <p>Your service request has been completed successfully!</p>
                
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Request ID:</strong> {service_request.id}</p>
                    <p><strong>Service Type:</strong> {service_request.get_service_type_display()}</p>
                </div>
                
                <p>Thank you for using VehicAid. We hope to serve you again!</p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 12px;">
                    VehicAid - Your Trusted Roadside Assistance Partner
                </p>
            </div>
        </body>
        </html>
        """
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        
        logger.info(f"Service completed email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send service completed email: {str(e)}")
        return False
```

---

## 🔒 Security Best Practices

### 1. Never Commit Credentials
```bash
# Always use environment variables
# Never hardcode passwords in code
```

### 2. Use App Passwords
- For Gmail, always use App Passwords, not your main password
- Enable 2FA for better security

### 3. Limit Email Rate
```python
# In settings.py
EMAIL_TIMEOUT = 10  # seconds
```

### 4. Handle Failures Gracefully
```python
try:
    send_mail(...)
except Exception as e:
    logger.error(f"Email failed: {e}")
    # Don't crash the application
```

---

## 📊 Monitoring & Logging

### Add Email Logging

In `settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'email_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/email.log',
        },
    },
    'loggers': {
        'email': {
            'handlers': ['email_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "SMTPAuthenticationError"
**Solution**: 
- Check username/password
- For Gmail, use App Password
- Enable "Less secure app access" (not recommended)

### Issue 2: "Connection refused"
**Solution**:
- Check SMTP server and port
- Verify firewall settings
- Try different port (587 or 465)

### Issue 3: "Timeout"
**Solution**:
- Increase EMAIL_TIMEOUT
- Check internet connection
- Verify SMTP server is accessible

### Issue 4: Emails go to Spam
**Solution**:
- Set up SPF records for your domain
- Set up DKIM
- Use professional email service (SendGrid, Mailgun)

---

## 🚀 Production Recommendations

### For Production, Use Professional Services:

1. **SendGrid** (Recommended)
   - Free tier: 100 emails/day
   - Paid: Starting at $15/month
   - Great deliverability
   - Analytics included

2. **Mailgun**
   - Free tier: 5,000 emails/month
   - Pay as you go
   - Good for transactional emails

3. **Amazon SES**
   - Very cheap ($0.10 per 1,000 emails)
   - Requires AWS account
   - Excellent for high volume

---

## ✅ Quick Setup Checklist

- [ ] Enable 2FA on Gmail account
- [ ] Generate App Password
- [ ] Add credentials to `.env`
- [ ] Update `settings.py`
- [ ] Test email with Django shell
- [ ] Create email templates
- [ ] Add email logging
- [ ] Test in production environment

---

**Next**: [Twilio SMS Setup Guide](./TWILIO_SETUP.md)

---

*Last Updated: January 17, 2026*
