import os
import django
from django.core.mail import send_mail

# Forcer le chargement du .env
from dotenv import load_dotenv
load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_smtp():
    print(f"Tentative d'envoi d'email via {os.getenv('EMAIL_HOST')}...")
    print(f"Utilisateur : {os.getenv('EMAIL_HOST_USER')}")
    try:
        send_mail(
            'Test Email - Tuteur Intelligent',
            'Ceci est un test pour vérifier la configuration SMTP.',
            os.getenv('DEFAULT_FROM_EMAIL'),
            [os.getenv('EMAIL_HOST_USER')],
            fail_silently=False,
        )
        print("✅ succès ! L'email a été envoyé.")
    except Exception as e:
        print(f"❌ Échec : {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_smtp()
