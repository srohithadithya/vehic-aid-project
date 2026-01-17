from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Test email configuration'

    def add_arguments(self, parser):
        parser.add_argument('recipient', type=str, help='Recipient email address')

    def handle(self, *args, **options):
        recipient = options['recipient']
        
        self.stdout.write(f'Sending test email to {recipient}...')
        
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
