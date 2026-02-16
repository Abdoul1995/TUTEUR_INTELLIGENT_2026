import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { aiService } from '../services/ai.service'
import {
  Brain,
  ChevronLeft,
  Clock,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Star
} from 'lucide-react'
import type { Exercise } from '../types'

export function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [answer, setAnswer] = useState<any>(null)
  const [result, setResult] = useState<any>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)


  useEffect(() => {
    if (id) {
      loadExercise()
    }
  }, [id])


  useEffect(() => {
    const timer = setInterval(() => {
      if (!result) {
        setTimeSpent(prev => prev + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [result])

  const loadExercise = async () => {
    try {
      const data = await api.getExercise(parseInt(id!))
      setExercise(data)
    } catch (error) {
      console.error('Error loading exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (answer === null) return

    setIsSubmitting(true)
    try {
      let submitAnswer = answer

      // Convert index to letter for QCM
      if (exercise?.exercise_type === 'qcm' && typeof answer === 'number') {
        submitAnswer = String.fromCharCode(65 + answer)
      }

      const response = await api.submitExercise(parseInt(id!), {
        answer: submitAnswer,
        time_spent: timeSpent,
        hints_used: hintsUsed
      })
      setResult(response)
    } catch (error) {
      console.error('Error submitting exercise:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHint = () => {
    if (exercise?.hints && hintsUsed < exercise.hints.length) {
      setShowHint(true)
      setHintsUsed(prev => prev + 1)
    }
  }

  const resetExercise = () => {
    setAnswer(null)
    setResult(null)
    setShowHint(false)
    setHintsUsed(0)
    setTimeSpent(0)
  }

  const handleRegenerate = async () => {
    if (!exercise) return

    if (!window.confirm("Voulez-vous générer un nouvel exercice similaire ?")) return;

    setIsSubmitting(true)
    try {
      const ex = exercise as any
      // Generate new content
      const newExerciseData = await aiService.generateExercise(
        ex.subject_name || ex.title, // Fallback to title if subject name missing
        exercise.level,
        exercise.title,
        exercise.difficulty, // This is 'easy'/'medium'/'hard' from DB
        'classic'
      )

      // Save it
      const dataToSave = {
        ...newExerciseData,
        subject: ex.subject,
        level: exercise.level,
        difficulty: exercise.difficulty,
        exercise_type: 'classic',
        points: 10
      }

      const savedExercise = await api.createExercise(dataToSave)
      navigate(`/exercises/${savedExercise.id}`)

    } catch (error) {
      console.error('Error generating exercise:', error)
      alert("Erreur lors de la régénération")
    } finally {
      setIsSubmitting(false)
    }
  }


  const renderQuestion = () => {
    if (!exercise) return null

    switch (exercise.exercise_type) {
      case 'qcm':
        return (
          <div className="space-y-3">
            {exercise.content.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => setAnswer(index)}
                disabled={result !== null}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${answer === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
                  } ${result ? 'cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${answer === index ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                    }`}>
                    {answer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )

      case 'classic':
        return (
          <div className="space-y-8">
            {/* Subject Text */}
            {exercise.content.text && (
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-primary-600" />
                  Sujet / Énoncé
                </h3>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {exercise.content.text}
                </div>
              </div>
            )}

            {/* Questions List */}
            {exercise.content.questions && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
                {exercise.content.questions.map((question: string, index: number) => (
                  <div key={index} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 pt-1">{question}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Manual Toggle for Answers (Classic Mode) */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowHint(!showHint)} // Reusing showHint state for simplicity, or add new state
                className="flex items-center justify-center w-full py-3 px-4 rounded-xl border-2 border-primary-100 text-primary-700 hover:bg-primary-50 transition-colors"
                title="Voir la correction"
              >
                {showHint ? 'Masquer la correction' : 'Voir la correction'}
              </button>

              {showHint && exercise.correct_answers && (
                <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200 animate-in fade-in slide-in-from-top-4">
                  <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Corrigé Type
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(exercise.correct_answers) ? (
                      exercise.correct_answers.map((ans: string, i: number) => (
                        <div key={i} className="flex gap-3">
                          <span className="font-bold text-green-700">{i + 1}.</span>
                          <span className="text-green-800">{ans}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-green-800 whitespace-pre-wrap">
                        {String(exercise.correct_answers)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Note for classic exercises */}
            <p className="text-center text-sm text-gray-500 italic mt-4">
              Cet exercice est une fiche de travail. Faites-le sur papier ou à l'oral, puis vérifiez avec la correction.
            </p>
          </div>
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

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Exercice non trouvé</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              {exercise.points} pts
            </span>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="card p-8">
          {/* Title & Difficulty */}
          <div className="flex items-center justify-between mb-6">
            <span className={`badge ${exercise.difficulty === 'easy' ? 'badge-green' :
              exercise.difficulty === 'medium' ? 'badge-yellow' : 'badge-red'
              }`}>
              {exercise.difficulty_display}
            </span>
            <span className="text-sm text-gray-500">{exercise.type_display}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {exercise.title}
          </h1>

          {exercise.description && (
            <p className="text-gray-600 mb-6">{exercise.description}</p>
          )}

          {/* Question */}
          {exercise.content.question && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-lg font-medium text-gray-900">
                {exercise.content.question}
              </p>
            </div>
          )}

          {/* Hints */}
          {showHint && exercise.hints && exercise.hints[hintsUsed - 1] && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start">
                <Lightbulb className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 mb-1">Indice {hintsUsed}</p>
                  <p className="text-yellow-700">{exercise.hints[hintsUsed - 1]}</p>
                </div>
              </div>
            </div>
          )}

          {/* Answer Input */}
          <div className="mb-6">
            {renderQuestion()}
          </div>

          {/* Result */}
          {result && (
            <div className={`mb-6 p-6 rounded-xl ${result.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
              <div className="flex items-center mb-4">
                {result.is_correct ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600 mr-3" />
                )}
                <div>
                  <p className={`text-lg font-semibold ${result.is_correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {result.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    Score: {result.score}/{exercise.points} points
                  </p>
                </div>
              </div>

              {result.explanation && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-medium text-gray-700 mb-2">Explication:</p>
                  <p className="text-gray-600">{result.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {exercise.exercise_type === 'classic' ? (
              <>
                <button
                  onClick={() => navigate('/exercises')}
                  className="btn-outline flex items-center justify-center flex-1"
                >
                  Terminer
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center justify-center flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Régénérer
                    </>
                  )}
                </button>
              </>
            ) : (
              !result ? (
                <>
                  {exercise.hints && exercise.hints.length > 0 && hintsUsed < exercise.hints.length && (
                    <button
                      onClick={handleHint}
                      className="btn-outline flex items-center justify-center"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Demander un indice (-2 pts)
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={answer === null || isSubmitting}
                    className="btn-primary flex-1"
                  >
                    {isSubmitting ? 'Vérification...' : 'Valider ma réponse'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={resetExercise}
                    className="btn-outline flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réessayer
                  </button>
                  <button
                    onClick={() => navigate('/exercises')}
                    className="btn-primary flex items-center justify-center"
                  >
                    Autres exercices
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
