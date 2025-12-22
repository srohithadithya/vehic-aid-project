import re

def mask_phone_number(phone):
    """
    Masks a phone number for privacy.
    Example: +91 9876543210 -> +91 ******3210
    """
    if not phone:
        return ""
    
    digits = re.sub(r'\D', '', phone)
    if len(digits) < 4:
        return phone
        
    return f"{phone[:-4]}****" if len(phone) > 4 else "****"

def mask_email(email):
    """
    Masks an email for privacy.
    Example: john.doe@example.com -> j***e@example.com
    """
    if not email or "@" not in email:
        return email
        
    user, domain = email.split("@")
    if len(user) <= 2:
        return f"*@{domain}"
        
    return f"{user[0]}***{user[-1]}@{domain}"
