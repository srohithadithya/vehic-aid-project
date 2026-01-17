"""
Performance monitoring middleware for VehicAid
Tracks request/response times and logs slow queries
"""
import time
import logging
from django.utils.deprecation import MiddlewareMixin
from django.db import connection

logger = logging.getLogger('performance')


class PerformanceMonitoringMiddleware(MiddlewareMixin):
    """Monitor request performance and log slow requests"""
    
    def process_request(self, request):
        request._start_time = time.time()
        return None
    
    def process_response(self, request, response):
        if hasattr(request, '_start_time'):
            duration = time.time() - request._start_time
            
            # Log slow requests (> 1 second)
            if duration > 1.0:
                logger.warning(
                    f'Slow request: {request.method} {request.path} '
                    f'took {duration:.2f}s'
                )
            
            # Log all requests in debug mode
            logger.info(
                f'{request.method} {request.path} '
                f'{response.status_code} {duration:.3f}s'
            )
            
            # Add performance header
            response['X-Response-Time'] = f'{duration:.3f}s'
        
        return response


class DatabaseQueryCountMiddleware(MiddlewareMixin):
    """Monitor database query count per request"""
    
    def process_request(self, request):
        request._queries_start = len(connection.queries)
        return None
    
    def process_response(self, request, response):
        if hasattr(request, '_queries_start'):
            query_count = len(connection.queries) - request._queries_start
            
            # Log requests with many queries (> 20)
            if query_count > 20:
                logger.warning(
                    f'High query count: {request.method} {request.path} '
                    f'executed {query_count} queries'
                )
            
            # Add query count header
            response['X-DB-Query-Count'] = str(query_count)
        
        return response
