import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  Brain,
  ChevronLeft,
  Clock,
  CheckCircle2,
  ArrowRight,
  Trophy,
  RotateCcw,
  AlertCircle
} from 'lucide-react'
import type { Quiz, Exercise } from '../types'

export function QuizDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [result, setResult] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    if (id) {
      loadQuiz()
    }
  }, [id])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (started && !result) {
      timer = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [started, result])

  const loadQuiz = async () => {
    try {
      const data = await api.getQuiz(parseInt(id!))
      setQuiz(data)
    } catch (error) {
      console.error('Error loading quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = async () => {
    try {
      const response = await api.startQuiz(parseInt(id!))
      setAttemptId(response.attempt_id)
      setStarted(true)
    } catch (error) {
      console.error('Error starting quiz:', error)
    }
  }

  const handleAnswer = (answer: any) => {
    if (!quiz?.exercises) return
    const exercise = quiz.exercises[currentQuestion]
    setAnswers({ ...answers, [exercise.id]: answer })
  }

  const nextQuestion = () => {
    if (quiz?.exercises && currentQuestion < quiz.exercises.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitQuiz = async () => {
    if (!attemptId) return

    try {
      const response = await api.submitQuiz(parseInt(id!), {
        attempt_id: attemptId,
        answers
      })
      setResult(response)
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  const renderQuestion = (exercise: Exercise) => {
    switch (exercise.exercise_type) {
      case 'qcm':
        return (
          <div className="space-y-3">
            {exercise.content.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${answers[exercise.id] === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
                  }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${answers[exercise.id] === index ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                    }`}>
                    {answers[exercise.id] === index && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )

      case 'text':
        return (
          <textarea
            value={answers[exercise.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="input w-full h-32 resize-none"
            placeholder="Votre réponse..."
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={answers[exercise.id] || ''}
            onChange={(e) => handleAnswer(parseFloat(e.target.value))}
            className="input w-full"
            placeholder="Votre réponse..."
          />
        )

      default:
        return (
          <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
            Type d'exercice non supporté
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Quiz non trouvé</h2>
        </div>
      </div>
    )
  }

  // Quiz Introduction
  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour
          </button>

          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>

            {quiz.description && (
              <p className="text-gray-600 mb-8">{quiz.description}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="font-semibold">{quiz.exercise_count}</p>
                <p className="text-sm text-gray-500">Exercices</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="font-semibold">{quiz.time_limit || '-'}</p>
                <p className="text-sm text-gray-500">Minutes</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <Trophy className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="font-semibold">{quiz.passing_score}%</p>
                <p className="text-sm text-gray-500">Pour réussir</p>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="btn-primary text-lg px-8 py-4"
            >
              Commencer le quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Results
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`card p-8 text-center ${result.is_passed ? 'border-green-500 border-2' : 'border-red-500 border-2'}`}>
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${result.is_passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
              {result.is_passed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-red-600" />
              )}
            </div>

            <h1 className={`text-3xl font-bold mb-4 ${result.is_passed ? 'text-green-800' : 'text-red-800'
              }`}>
              {result.is_passed ? 'Félicitations !' : 'Quiz terminé'}
            </h1>

            <p className="text-gray-600 mb-8">
              {result.is_passed
                ? 'Vous avez réussi le quiz !'
                : 'Vous n\'avez pas atteint le score de réussite.'}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">{result.score}</p>
                <p className="text-sm text-gray-500">Points</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">{result.percentage}%</p>
                <p className="text-sm text-gray-500">Score</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                </p>
                <p className="text-sm text-gray-500">Temps</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-outline flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réessayer
              </button>
              <button
                onClick={() => navigate('/quizzes')}
                className="btn-primary flex items-center"
              >
                Autres quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz in Progress
  const currentExercise = quiz.exercises?.[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} / {quiz.exercises?.length}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / (quiz.exercises?.length || 1)) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        {currentExercise && (
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentExercise.content.question || currentExercise.title}
            </h2>

            {renderQuestion(currentExercise)}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="btn-outline disabled:opacity-50"
              >
                Précédent
              </button>

              {currentQuestion < (quiz.exercises?.length || 0) - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="btn-primary"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  className="btn-primary"
                >
                  Terminer le quiz
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
