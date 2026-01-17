"""
Email utility for VehicAid platform
Handles all email notifications
"""
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_email(subject, text_content, html_content, recipient_list):
    """Send email with both text and HTML versions"""
    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipient_list
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        logger.info(f"Email sent to {recipient_list}")
        return True
    except Exception as e:
        logger.error(f"Email failed: {str(e)}")
        return False


def send_service_request_email(user, service_request):
    """Send email when service request is created"""
    subject = f'Service Request #{service_request.id} - Confirmation'
    
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
    
    return send_email(subject, text_content, html_content, [user.email])


def send_provider_assigned_email(user, service_request, provider):
    """Send email when provider is assigned"""
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
    
    return send_email(subject, text_content, html_content, [user.email])


def send_service_completed_email(user, service_request):
    """Send email when service is completed"""
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
    
    return send_email(subject, text_content, html_content, [user.email])


def send_otp_email(user_email, otp):
    """Send OTP for verification"""
    subject = 'VehicAid - Your Verification Code'
    
    text_content = f"""
Your VehicAid verification code is: {otp}

This code will expire in 10 minutes.
Do not share this code with anyone.

VehicAid Team
"""
    
    html_content = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Verification Code</h2>
        <p>Your VehicAid verification code is:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0;">{otp}</h1>
        </div>
        
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #ef4444;"><strong>Do not share this code with anyone.</strong></p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
            VehicAid - Your Trusted Roadside Assistance Partner
        </p>
    </div>
</body>
</html>
"""
    
    return send_email(subject, text_content, html_content, [user_email])
