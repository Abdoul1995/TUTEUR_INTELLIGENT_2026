import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react'

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

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: 'student',
    level: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs')
        return
      }
    }
    setError('')
    setStep(step + 1)
  }

  const prevStep = () => {
    setError('')
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Créer un compte
            </h1>
            <p className="text-gray-600 mt-2">
              Rejoignez Tuteur Intelligent dès maintenant
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              2
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="username" className="label">
                    Nom d'utilisateur *
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    className="input"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="votre_nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vous@exemple.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="label">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="input pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 8 caractères
                  </p>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full btn-primary py-3"
                >
                  Continuer
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="label">
                      Prénom
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      className="input"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Jean"
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name" className="label">
                      Nom
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      className="input"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="level" className="label">
                    Niveau scolaire
                  </label>
                  <select
                    id="level"
                    className="input"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option value="">Sélectionnez votre niveau</option>
                    {LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 btn-outline py-3"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-primary py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      'Créer mon compte'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Ou
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
