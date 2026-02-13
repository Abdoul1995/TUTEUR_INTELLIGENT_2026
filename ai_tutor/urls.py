from django.urls import path
from .views import ChatView, GenerateExerciseView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='ai-chat'),
    path('generate-exercise/', GenerateExerciseView.as_view(), name='generate-exercise'),
]
