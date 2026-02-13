"""
Admin pour les leçons.
"""
from django.contrib import admin
from .models import Subject, Chapter, Lesson, LessonResource, LessonView


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    """Admin pour les matières."""
    
    list_display = ['name', 'order', 'is_active', 'chapter_count']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    
    def chapter_count(self, obj):
        return obj.chapters.count()
    chapter_count.short_description = 'Chapitres'


class LessonResourceInline(admin.TabularInline):
    """Inline pour les ressources de leçon."""
    model = LessonResource
    extra = 1


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    """Admin pour les chapitres."""
    
    list_display = ['title', 'subject', 'order', 'is_active', 'lesson_count']
    list_filter = ['subject', 'is_active']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    
    def lesson_count(self, obj):
        return obj.lessons.count()
    lesson_count.short_description = 'Leçons'


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    """Admin pour les leçons."""
    
    list_display = [
        'title', 'chapter', 'level', 'duration_minutes',
        'is_official', 'is_active', 'created_at'
    ]
    list_filter = ['level', 'is_official', 'is_active', 'chapter__subject']
    search_fields = ['title', 'content', 'summary']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonResourceInline]


@admin.register(LessonView)
class LessonViewAdmin(admin.ModelAdmin):
    """Admin pour les vues de leçons."""
    
    list_display = ['student', 'lesson', 'viewed_at', 'completed', 'completion_percentage']
    list_filter = ['completed', 'viewed_at']
    search_fields = ['student__username', 'lesson__title']
