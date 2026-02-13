import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { 
  BookOpen, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  Play,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react'
import type { Lesson } from '../types'

export function LessonDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  useEffect(() => {
    if (slug) {
      loadLesson()
    }
  }, [slug])

  const loadLesson = async () => {
    try {
      const data = await api.getLesson(slug!)
      setLesson(data)
      setIsCompleted(data.is_viewed || false)
      setCompletionPercentage(data.completion_percentage || 0)
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsCompleted = async () => {
    try {
      await api.markLessonViewed(slug!, { completed: true, completion_percentage: 100 })
      setIsCompleted(true)
      setCompletionPercentage(100)
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Leçon non trouvée</h2>
          <Link to="/lessons" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
            Retour aux leçons
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {lesson.duration_minutes} min
              </span>
              {isCompleted && (
                <span className="badge-green flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Terminé
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="card overflow-hidden">
              {/* Lesson Header */}
              <div className="h-64 bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                {lesson.image ? (
                  <img 
                    src={lesson.image} 
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-24 h-24 text-white/50" />
                )}
              </div>
              
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="badge-blue">{lesson.subject_name}</span>
                  <span className="badge-gray">{lesson.chapter_title}</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {lesson.title}
                </h1>
                
                {lesson.summary && (
                  <p className="text-lg text-gray-600 mb-8">
                    {lesson.summary}
                  </p>
                )}
                
                {/* Video */}
                {lesson.video_url && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Vidéo de la leçon
                    </h2>
                    <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                      <iframe
                        src={lesson.video_url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Contenu de la leçon
                  </h2>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
                
                {/* Complete Button */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  {!isCompleted ? (
                    <button
                      onClick={markAsCompleted}
                      className="btn-primary w-full py-4 text-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Marquer comme terminé
                    </button>
                  ) : (
                    <div className="flex items-center justify-center p-4 bg-green-50 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">
                        Leçon terminée ! Bravo !
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Progression</h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">
                {completionPercentage}% complété
              </p>
            </div>
            
            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Ressources complémentaires
                </h3>
                <div className="space-y-3">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.file || resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {resource.resource_type === 'pdf' ? (
                        <FileText className="w-5 h-5 text-red-500 mr-3" />
                      ) : resource.resource_type === 'video' ? (
                        <Play className="w-5 h-5 text-blue-500 mr-3" />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-gray-500 mr-3" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {resource.title}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Next Steps */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Continuer</h3>
              <div className="space-y-3">
                <Link
                  to={`/exercises?lesson=${lesson.slug}`}
                  className="btn-outline w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Exercices associés
                </Link>
                <Link
                  to="/lessons"
                  className="btn-outline w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Autres leçons
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
