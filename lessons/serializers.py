"""
Sérialiseurs pour les leçons.
"""
from rest_framework import serializers
from .models import Subject, Chapter, Lesson, LessonResource, LessonView


class SubjectSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les matières."""
    
    chapter_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color',
            'order', 'is_active', 'chapter_count'
        ]
    
    def get_chapter_count(self, obj):
        return obj.chapters.filter(is_active=True).count()


class ChapterListSerializer(serializers.ModelSerializer):
    """Sérialiseur liste pour les chapitres."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lesson_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Chapter
        fields = [
            'id', 'title', 'slug', 'description', 'subject', 'subject_name',
            'order', 'is_active', 'lesson_count'
        ]
    
    def get_lesson_count(self, obj):
        return obj.lessons.filter(is_active=True).count()


class ChapterDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détail pour les chapitres."""
    
    subject = SubjectSerializer(read_only=True)
    lessons = serializers.SerializerMethodField()
    
    class Meta:
        model = Chapter
        fields = [
            'id', 'title', 'slug', 'description', 'subject',
            'order', 'is_active', 'lessons', 'created_at', 'updated_at'
        ]
    
    def get_lessons(self, obj):
        lessons = obj.lessons.filter(is_active=True)
        return LessonListSerializer(lessons, many=True).data


class LessonResourceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les ressources de leçon."""
    
    class Meta:
        model = LessonResource
        fields = ['id', 'title', 'resource_type', 'file', 'url', 'description', 'order']


class LessonListSerializer(serializers.ModelSerializer):
    """Sérialiseur liste pour les leçons."""
    
    chapter_title = serializers.CharField(source='chapter.title', read_only=True)
    subject_name = serializers.CharField(source='chapter.subject.name', read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'slug', 'summary', 'level', 'chapter', 
            'chapter_title', 'subject_name', 'duration_minutes',
            'order', 'image', 'is_official'
        ]


class LessonDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détail pour les leçons."""
    
    chapter = ChapterListSerializer(read_only=True)
    resources = LessonResourceSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    is_viewed = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'slug', 'content', 'summary', 'level',
            'chapter', 'duration_minutes', 'order', 'is_official',
            'image', 'video_url', 'author', 'author_name',
            'resources', 'is_viewed', 'completion_percentage',
            'created_at', 'updated_at'
        ]
    
    def get_is_viewed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.views.filter(student=request.user).exists()
        return False
    
    def get_completion_percentage(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            view = obj.views.filter(student=request.user).first()
            if view:
                return view.completion_percentage
        return 0


class LessonViewSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les vues de leçons."""
    
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = LessonView
        fields = [
            'id', 'lesson', 'lesson_title', 'viewed_at',
            'completed', 'completion_percentage'
        ]
        read_only_fields = ['viewed_at']


class LessonViewUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la mise à jour des vues de leçons."""
    
    class Meta:
        model = LessonView
        fields = ['completed', 'completion_percentage']
