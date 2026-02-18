"""
Vues pour la réinitialisation de mot de passe.
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import PasswordResetSerializer, PasswordResetConfirmSerializer

User = get_user_model()

class PasswordResetRequestView(views.APIView):
    """Vue pour demander la réinitialisation du mot de passe."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
                
                subject = "Réinitialisation de votre mot de passe - Tuteur Intelligent"
                message = f"Bonjour {user.first_name or user.username},\n\n" \
                          f"Vous avez demandé la réinitialisation de votre mot de passe.\n" \
                          f"Veuillez cliquer sur le lien suivant pour choisir un nouveau mot de passe :\n\n" \
                          f"{reset_url}\n\n" \
                          f"Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.\n\n" \
                          f"L'équipe Tuteur Intelligent"
                
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                
                return Response({
                    "message": "Si un compte existe avec cet email, un lien de réinitialisation vous a été envoyé."
                }, status=status.HTTP_200_OK)
            
            # Security: we don't reveal if the user exists or not
            return Response({
                "message": "Si un compte existe avec cet email, un lien de réinitialisation vous a été envoyé."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(views.APIView):
    """Vue pour confirmer la réinitialisation du mot de passe."""
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
                
                if default_token_generator.check_token(user, token):
                    user.set_password(serializer.validated_data['new_password'])
                    user.save()
                    return Response({
                        "message": "Votre mot de passe a été réinitialisé avec succès."
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "error": "Le lien de réinitialisation est invalide ou a expiré."
                    }, status=status.HTTP_400_BAD_REQUEST)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response({
                    "error": "Le lien de réinitialisation est invalide."
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
