import os
import posixpath
from django.conf import settings
from django.http import HttpResponse, Http404
from django.views.static import serve
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.services.models import ChatMessage
from django.db.models import Q

class ProtectedMediaView(APIView):
    """
    Ensures storage policies: users can only access files they are authorized for.
    For chat attachments: users must be the sender or receiver of the related message/request.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, path):
        # 1. Identify what kind of file it is based on path
        # In our case, currently only 'chat_attachments/'
        
        if path.startswith('chat_attachments/'):
            # Check if user is part of the chat
            # This is slow but secure for RLS
            try:
                # ChatMessage.image field stores 'chat_attachments/filename.ext'
                # We filter by image path and user involvement
                msg = ChatMessage.objects.filter(
                    Q(image=path) | Q(image=f"chat_attachments/{path.split('/')[-1]}"),
                    Q(request__booker=request.user) | Q(request__provider=request.user) | Q(sender=request.user)
                ).exists()
                
                if not msg and getattr(request.user, 'role', None) != 'admin':
                    return Response({"error": "You do not have permission to view this file."}, status=403)
            except Exception:
                return Response({"error": "File validation failed."}, status=403)

        # 2. Serve the file using Django's serve (or X-Accel-Redirect in prod)
        # Note: In a real production environment, you should use Nginx X-Accel-Redirect or S3 Signed URLs.
        # This implementation follows the "Storage Policies" requirement for the provided environment.
        
        document_root = settings.MEDIA_ROOT
        return serve(request, path, document_root=document_root)
