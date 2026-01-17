from django.core.management.base import BaseCommand
from apps.services.utils.sms_utils import sms_service


class Command(BaseCommand):
    help = 'Test SMS configuration (Fast2SMS)'

    def add_arguments(self, parser):
        parser.add_argument('phone', type=str, help='10-digit phone number')
        parser.add_argument('--message', type=str, default='Test SMS from VehicAid!', help='Message to send')

    def handle(self, *args, **options):
        phone = options['phone']
        message = options['message']
        
        self.stdout.write(f'Sending SMS to {phone}...')
        
        result = sms_service.send_sms(phone, message)
        
        if result['success']:
            self.stdout.write(self.style.SUCCESS('✅ SMS sent successfully!'))
            if 'message_id' in result:
                self.stdout.write(f'Message ID: {result["message_id"]}')
        else:
            self.stdout.write(self.style.ERROR('❌ Failed to send SMS'))
            self.stdout.write(f'Error: {result.get("error")}')
