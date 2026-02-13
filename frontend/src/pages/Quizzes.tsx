import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Brain, Clock, CheckCircle2, Star, ChevronRight, Play } from 'lucide-react'
import type { Subject, Quiz } from '../types'

const LEVELS = [
  { value: 'cp1', label: 'CP1' },
  { value: 'cp2', label: 'CP2' },
  { value: 'ce1', label: 'CE1' },
  { value: 'ce2', label: 'CE2' },
  { value: 'cm1', label: 'CM1' },
  { value: 'cm2', label: 'CM2' },
  { value: 'sixieme', label: '6ème' },
  { value: 'cinquieme', label: '5ème' },
  { value: 'quatrieme', label: '4ème' },
  { value: 'troisieme', label: '3ème' },
  { value: 'seconde', label: 'Seconde' },
  { value: 'premiere', label: 'Première' },
  { value: 'terminale', label: 'Terminale' },
]

export function Quizzes() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedSubject, selectedLevel])

  const loadData = async () => {
    try {
      const [subjectsData, quizzesData] = await Promise.all([
        api.getSubjects(),
        api.getQuizzes({ 
          subject: selectedSubject, 
          level: selectedLevel 
        })
      ])
      setSubjects(subjectsData.results || subjectsData)
      setQuizzes(quizzesData.results || quizzesData)
    } catch (error) {
      console.error('Error loading quizzes:', error)
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
          <h1 className="text-3xl font-bold text-gray-900">Quiz</h1>
          <p className="text-gray-600 mt-2">
            Testez vos connaissances avec nos quiz interactifs
          </p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="input flex-1"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Toutes les matières</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.slug}>
                  {subject.name}
                </option>
              ))}
            </select>
            
            <select
              className="input flex-1"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Tous les niveaux</option>
              {LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quizzes Grid */}
        {quizzes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                to={`/quizzes/${quiz.id}`}
                className="card hover:shadow-lg transition-shadow group"
              >
                <div className="h-48 bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                  <Brain className="w-20 h-20 text-white/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-blue">{quiz.subject_name}</span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {quiz.passing_score}% pour réussir
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {quiz.title}
                  </h3>
                  
                  {quiz.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {quiz.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      {quiz.exercise_count} exercices
                    </span>
                    {quiz.time_limit && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.time_limit} min
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    <Play className="w-4 h-4 mr-2" />
                    Commencer le quiz
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun quiz disponible
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos filtres
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
