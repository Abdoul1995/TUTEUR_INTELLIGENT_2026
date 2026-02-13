import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Brain, Search, Clock, Star, ChevronRight, CheckCircle2 } from 'lucide-react'
import type { Subject, Exercise } from '../types'
import { AIExerciseGenerator } from '../components/exercises/AIExerciseGenerator'

const DIFFICULTIES = [
  { value: 'easy', label: 'Facile', color: 'green' },
  { value: 'medium', label: 'Moyen', color: 'yellow' },
  { value: 'hard', label: 'Difficile', color: 'red' },
]

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

export function Exercises() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedSubject, selectedDifficulty, selectedLevel])

  const loadData = async () => {
    try {
      const [subjectsData, exercisesData] = await Promise.all([
        api.getSubjects(),
        api.getExercises({
          subject: selectedSubject,
          difficulty: selectedDifficulty,
          level: selectedLevel
        })
      ])
      setSubjects(subjectsData.results || subjectsData)
      setExercises(exercisesData.results || exercisesData)
    } catch (error) {
      console.error('Error loading exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExerciseGenerated = async (exerciseData: any) => {
    try {
      // Prepare data for saving
      const dataToSave = {
        ...exerciseData,
      }

      // Find subject ID if possible
      const subjectObj = subjects.find(s => s.name === exerciseData.subject || s.slug === exerciseData.subject)
      if (subjectObj) {
        dataToSave.subject = subjectObj.id
      }

      // Set default values
      if (!dataToSave.difficulty) dataToSave.difficulty = 'medium'
      if (!dataToSave.exercise_type) dataToSave.exercise_type = 'qcm'
      if (!dataToSave.points) dataToSave.points = 10

      const newExercise = await api.createExercise(dataToSave)
      navigate(`/exercises/${newExercise.id}`)
    } catch (error) {
      console.error("Error creating exercise:", error)
      alert("Erreur lors de la sauvegarde de l'exercice.")
    }
  }

  const filteredExercises = exercises.filter(exercise =>
    exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exercices</h1>
            <p className="text-gray-600 mt-2">
              Pratiquez avec des exercices adaptés à votre niveau
            </p>
          </div>
          <AIExerciseGenerator subjects={subjects} onExerciseGenerated={handleExerciseGenerated} />
        </div>

        {/* Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un exercice..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <select
                className="input"
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
                className="input"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">Toutes les difficultés</option>
                {DIFFICULTIES.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>

              <select
                className="input"
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
        </div>

        {/* Difficulty Legend */}
        <div className="flex flex-wrap gap-4 mb-8">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.value}
              onClick={() => setSelectedDifficulty(
                selectedDifficulty === diff.value ? '' : diff.value
              )}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${selectedDifficulty === diff.value
                  ? `bg-${diff.color}-200`
                  : 'bg-white hover:bg-gray-50'
                }`}
            >
              <div className={`w-3 h-3 rounded-full bg-${diff.color}-500 mr-2`} />
              <span className="text-sm font-medium">{diff.label}</span>
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <Link
                key={exercise.id}
                to={`/exercises/${exercise.id}`}
                className="card hover:shadow-lg transition-shadow group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`badge ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty_display}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {exercise.points} pts
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {exercise.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {exercise.description || 'Aucune description disponible'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{exercise.subject_name}</span>
                    {exercise.time_limit && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {exercise.time_limit}s
                      </span>
                    )}
                  </div>

                  {exercise.best_score !== undefined && exercise.best_score > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Meilleur score: {exercise.best_score}/{exercise.points}
                    </div>
                  )}

                  <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                    Commencer l'exercice
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
              Aucun exercice trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
