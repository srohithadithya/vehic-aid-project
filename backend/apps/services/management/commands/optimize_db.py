"""
Database optimization utilities.
Run this to optimize queries and add performance indexes.
"""

from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Optimize database performance with indexes and query optimization'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting database optimization...'))
        
        with connection.cursor() as cursor:
            # Create indexes for frequently queried fields
            indexes = [
                # Service requests
                "CREATE INDEX IF NOT EXISTS idx_service_request_status ON services_servicerequest(status)",
                "CREATE INDEX IF NOT EXISTS idx_service_request_created ON services_servicerequest(created_at DESC)",
                "CREATE INDEX IF NOT EXISTS idx_service_request_booker ON services_servicerequest(booker_id)",
                "CREATE INDEX IF NOT EXISTS idx_service_request_provider ON services_servicerequest(provider_id)",
                
                # Subscriptions
                "CREATE INDEX IF NOT EXISTS idx_subscription_active ON services_usersubscription(is_active, status)",
                "CREATE INDEX IF NOT EXISTS idx_subscription_user ON services_usersubscription(user_id)",
                "CREATE INDEX IF NOT EXISTS idx_subscription_end_date ON services_usersubscription(end_date)",
                
                # Wallet transactions
                "CREATE INDEX IF NOT EXISTS idx_wallet_transactions ON services_wallettransaction(wallet_id, created_at DESC)",
                "CREATE INDEX IF NOT EXISTS idx_wallet_type ON services_wallettransaction(transaction_type)",
                
                # Reward transactions
                "CREATE INDEX IF NOT EXISTS idx_reward_transactions ON services_rewardtransaction(rewards_program_id, created_at DESC)",
                
                # Reviews
                "CREATE INDEX IF NOT EXISTS idx_review_provider ON services_review(provider_id)",
                "CREATE INDEX IF NOT EXISTS idx_review_rating ON services_review(rating)",
                
                # Users
                "CREATE INDEX IF NOT EXISTS idx_user_email ON users_customuser(email)",
                "CREATE INDEX IF NOT EXISTS idx_user_phone ON users_customuser(phone_number)",
            ]
            
            for index_sql in indexes:
                try:
                    cursor.execute(index_sql)
                    self.stdout.write(self.style.SUCCESS(f'✅ Created index'))
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'⚠️  Index may already exist: {str(e)}'))
            
            # Analyze tables for query optimization
            tables = [
                'services_servicerequest',
                'services_usersubscription',
                'services_wallettransaction',
                'services_rewardtransaction',
                'services_review',
                'users_customuser',
            ]
            
            for table in tables:
                try:
                    cursor.execute(f'ANALYZE {table}')
                    self.stdout.write(self.style.SUCCESS(f'✅ Analyzed {table}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'❌ Error analyzing {table}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS('🎉 Database optimization completed!'))
