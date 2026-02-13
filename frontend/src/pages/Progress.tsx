import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import {
  Target,
  Brain,
  Star,
  BookOpen,
  Flame,
  Award
} from 'lucide-react'
import type { SubjectProgress, WeakArea, StudentAchievement } from '../types'

export function Progress() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([])
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([])
  const [achievements, setAchievements] = useState<StudentAchievement[]>([])

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const [statsData, subjectData, weakAreasData, achievementsData] = await Promise.all([
        api.getStats(),
        api.getSubjectProgress(),
        api.getWeakAreas(),
        api.getMyAchievements()
      ])
      setStats(statsData)
      setSubjectProgress(subjectData.results || subjectData)
      setWeakAreas(weakAreasData.results || weakAreasData)
      setAchievements(achievementsData.results || achievementsData)
    } catch (error) {
      console.error('Error loading progress:', error)
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ma progression</h1>
          <p className="text-gray-600 mt-2">
            Suivez votre évolution et identifiez vos points forts
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_lessons || 0}</div>
            <div className="text-sm text-gray-500">Leçons vues</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_exercises || 0}</div>
            <div className="text-sm text-gray-500">Exercices complétés</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.current_streak || 0}</div>
            <div className="text-sm text-gray-500">Jours de suite</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.average_score || 0}%</div>
            <div className="text-sm text-gray-500">Score moyen</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subject Progress */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Progression par matière
              </h2>

              {subjectProgress.length > 0 ? (
                <div className="space-y-6">
                  {subjectProgress.map((sp) => (
                    <div key={sp.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${sp.subject_color}20` }}
                          >
                            <BookOpen className="w-5 h-5" style={{ color: sp.subject_color }} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{sp.subject_name}</p>
                            <p className="text-sm text-gray-500">
                              {sp.lessons_completed} / {sp.total_lessons} leçons
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {sp.completion_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
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
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Commencez à explorer les leçons pour voir votre progression
                  </p>
                  <Link to="/lessons" className="btn-primary mt-4 inline-flex">
                    Explorer les leçons
                  </Link>
                </div>
              )}
            </div>

            {/* Weekly Activity */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Activité de la semaine
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats?.lessons_this_week || 0}</p>
                  <p className="text-sm text-blue-700">Leçons</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-600">{stats?.exercises_this_week || 0}</p>
                  <p className="text-sm text-green-700">Exercices</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-purple-600">{stats?.quizzes_this_week || 0}</p>
                  <p className="text-sm text-purple-700">Quiz</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weak Areas */}
            {weakAreas.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-red-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Points à améliorer
                  </h2>
                </div>
                <div className="space-y-3">
                  {weakAreas.slice(0, 5).map((area) => (
                    <div key={area.id} className="p-3 bg-red-50 rounded-lg">
                      <p className="font-medium text-red-800">{area.concept}</p>
                      <p className="text-sm text-red-600">{area.subject_name}</p>
                      <p className="text-xs text-red-500 mt-1">
                        {area.error_count} erreurs
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/exercises"
                  className="block text-center text-primary-600 text-sm mt-4 hover:text-primary-700"
                >
                  S'entraîner
                </Link>
              </div>
            )}

            {/* Achievements */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Award className="w-5 h-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mes badges
                </h2>
              </div>

              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: achievement.achievement_details.color }}
                      >
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {achievement.achievement_details.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(achievement.earned_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    Complétez des exercices pour gagner des badges !
                  </p>
                </div>
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
                <Link to="/quizzes" className="btn-outline w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Passer un quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
