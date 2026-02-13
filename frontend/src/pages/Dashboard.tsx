import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import {
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  ArrowRight,
  Flame,
  Star,
  Zap
} from 'lucide-react'
import type { Lesson, Quiz, Progress, SubjectProgress, WeakArea } from '../types'

export function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<{
    progress?: Progress
    subject_progress?: SubjectProgress[]
    recent_achievements?: any[]
    weak_areas?: WeakArea[]
  }>({})
  const [recommendedLessons, setRecommendedLessons] = useState<Lesson[]>([])
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [dashboardData, lessonsData, quizzesData] = await Promise.all([
        api.getDashboard(),
        api.getRecommendedLessons(),
        api.getQuizzes({ level: user?.level })
      ])
      setDashboard(dashboardData)
      setRecommendedLessons(lessonsData.results || lessonsData)
      setUpcomingQuizzes(quizzesData.results?.slice(0, 3) || quizzesData.slice(0, 3))
    } catch (error) {
      console.error('Error loading dashboard:', error)
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

  const { progress, subject_progress, weak_areas } = dashboard

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour, {user?.first_name || user?.username} ! 👋
            </h1>
            {user?.level && (
              <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full uppercase">
                {user.level}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            Voici votre progression aujourd'hui
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Leçons</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {progress?.total_lessons_viewed || 0}
            </div>
            <div className="text-sm text-gray-500">vues</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Exercices</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {progress?.total_exercises_completed || 0}
            </div>
            <div className="text-sm text-gray-500">complétés</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Série</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {progress?.current_streak || 0}
            </div>
            <div className="text-sm text-gray-500">jours</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Points</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {progress?.total_points || 0}
            </div>
            <div className="text-sm text-gray-500">cumulés</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Goal */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Objectif hebdomadaire
                </h2>
                <span className="text-sm text-gray-500">
                  {progress?.weekly_progress?.lessons_this_week || 0} / {progress?.weekly_goal || 5} leçons
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all"
                  style={{ width: `${progress?.weekly_progress?.percentage || 0}%` }}
                />
              </div>
            </div>

            {/* Recommended Lessons */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Leçons recommandées pour vous
                </h2>
                <Link to="/lessons" className="text-primary-600 text-sm hover:text-primary-700">
                  Voir tout
                </Link>
              </div>

              {recommendedLessons.length > 0 ? (
                <div className="space-y-4">
                  {recommendedLessons.slice(0, 3).map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/lessons/${lesson.slug}`}
                      className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">
                          {lesson.subject_name} • {lesson.duration_minutes} min
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Commencez par explorer nos leçons !
                </p>
              )}
            </div>

            {/* Subject Progress */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Progression par matière
              </h2>

              {subject_progress && subject_progress.length > 0 ? (
                <div className="space-y-4">
                  {subject_progress.map((sp) => (
                    <div key={sp.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">{sp.subject_name}</span>
                        <span className="text-sm text-gray-500">
                          {sp.completion_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${sp.completion_percentage}%`,
                            backgroundColor: sp.subject_color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Votre progression par matière apparaîtra ici
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weak Areas */}
            {weak_areas && weak_areas.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-red-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Points à améliorer
                  </h2>
                </div>
                <div className="space-y-3">
                  {weak_areas.slice(0, 3).map((area) => (
                    <div key={area.id} className="p-3 bg-red-50 rounded-lg">
                      <p className="font-medium text-red-800">{area.concept}</p>
                      <p className="text-sm text-red-600">{area.subject_name}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/progress"
                  className="block text-center text-primary-600 text-sm mt-4 hover:text-primary-700"
                >
                  Voir tous les points faibles
                </Link>
              </div>
            )}

            {/* Upcoming Quizzes */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Quiz à venir
                </h2>
              </div>

              {upcomingQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {upcomingQuizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      to={`/quizzes/${quiz.id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{quiz.title}</p>
                      <p className="text-sm text-gray-500">
                        {quiz.exercise_count} exercices
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucun quiz disponible
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <div className="space-y-3">
                <Link to="/lessons" className="btn-outline w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continuer mes leçons
                </Link>
                <Link to="/exercises" className="btn-outline w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Faire des exercices
                </Link>
                <Link to="/progress" className="btn-outline w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir ma progression
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
