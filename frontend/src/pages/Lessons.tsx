import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { BookOpen, Search, Clock, ChevronRight } from 'lucide-react'
import type { Subject, Lesson } from '../types'

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

export function Lessons() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '')
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '')

  useEffect(() => {
    loadData()
  }, [selectedSubject, selectedLevel])

  const loadData = async () => {
    try {
      const [subjectsData, lessonsData] = await Promise.all([
        api.getSubjects(),
        api.getLessons({
          subject: selectedSubject,
          level: selectedLevel
        })
      ])
      setSubjects(subjectsData.results || subjectsData)
      setLessons(lessonsData.results || lessonsData)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadData()
  }

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Leçons</h1>
          <p className="text-gray-600 mt-2">
            Explorez nos leçons conformes au programme officiel
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une leçon..."
                  className="input pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex gap-4">
              <select
                className="input"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value)
                  if (e.target.value) {
                    setSearchParams({ subject: e.target.value })
                  } else {
                    setSearchParams({})
                  }
                }}
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

        {/* Subjects */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(selectedSubject === subject.slug ? '' : subject.slug)
              }}
              className={`card p-4 text-center transition-all hover:shadow-md ${selectedSubject === subject.slug
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : ''
                }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
              </div>
              <p className="font-medium text-gray-900 text-sm">{subject.name}</p>
              <p className="text-xs text-gray-500">{subject.chapter_count} chapitres</p>
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.slug}`}
                className="card hover:shadow-lg transition-shadow group"
              >
                <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  {lesson.image ? (
                    <img
                      src={lesson.image}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-primary-300" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge-blue text-xs">
                      {lesson.subject_name}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {lesson.duration_minutes} min
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {lesson.summary || 'Aucun résumé disponible'}
                  </p>
                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    Commencer la leçon
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune leçon trouvée
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
