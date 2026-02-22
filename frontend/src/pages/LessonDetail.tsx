import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  BookOpen,
  Clock,
  ChevronLeft,
  Play,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react'
import type { Lesson } from '../types'

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

const getMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export function LessonDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      loadLesson()
    }
  }, [slug])

  const loadLesson = async () => {
    try {
      const data = await api.getLesson(slug!)
      setLesson(data)
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
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
                    src={getMediaUrl(lesson.image)}
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
                        src={getYoutubeEmbedUrl(lesson.video_url)}
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

                {/* PDF Content */}
                {lesson.pdf_content && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Support de cours (PDF)
                      </h2>
                      <a
                        href={getMediaUrl(lesson.pdf_content)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger le PDF
                      </a>
                    </div>
                    <div className="w-full h-[600px] border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50 flex flex-col items-center justify-center text-center p-4">
                      <object
                        data={`${getMediaUrl(lesson.pdf_content)}#toolbar=0`}
                        type="application/pdf"
                        className="w-full h-full"
                      >
                        <p className="text-gray-500 mb-4">
                          Votre navigateur ne peut pas afficher directement ce fichier PDF.
                        </p>
                        <a
                          href={getMediaUrl(lesson.pdf_content)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger le fichier
                        </a>
                      </object>
                    </div>
                  </div>
                )}

              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                      href={resource.file ? getMediaUrl(resource.file) : resource.url}
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
