from .models import User

def get_allowed_levels(user_level):
    """
    Retourne la liste des niveaux autorisés pour un élève donné (niveau actuel et inférieurs).
    """
    if not user_level:
        return []

    levels = [code for code, label in User.LEVEL_CHOICES]
    
    try:
        index = levels.index(user_level)
        return levels[:index + 1]
    except ValueError:
        return []
