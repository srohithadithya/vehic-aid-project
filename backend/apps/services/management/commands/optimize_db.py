"""
Database optimization utilities for VehicAid
"""
from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Optimize database performance'

    def handle(self, *args, **options):
        self.stdout.write('Optimizing database...')
        
        with connection.cursor() as cursor:
            # Analyze tables
            self.stdout.write('Analyzing tables...')
            cursor.execute("ANALYZE;")
            
            # Vacuum database (PostgreSQL)
            self.stdout.write('Vacuuming database...')
            cursor.execute("VACUUM ANALYZE;")
            
            # Get table sizes
            cursor.execute("""
                SELECT 
                    schemaname,
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
                FROM pg_tables
                WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
                ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
                LIMIT 10;
            """)
            
            self.stdout.write('\nTop 10 largest tables:')
            for row in cursor.fetchall():
                self.stdout.write(f'  {row[1]}: {row[2]}')
            
            # Get index usage
            cursor.execute("""
                SELECT
                    schemaname,
                    tablename,
                    indexname,
                    idx_scan as scans
                FROM pg_stat_user_indexes
                WHERE idx_scan = 0
                ORDER BY schemaname, tablename;
            """)
            
            unused = cursor.fetchall()
            if unused:
                self.stdout.write('\nUnused indexes (consider removing):')
                for row in unused:
                    self.stdout.write(f'  {row[2]} on {row[1]}')
            
        self.stdout.write(self.style.SUCCESS('\n✅ Database optimization complete!'))
