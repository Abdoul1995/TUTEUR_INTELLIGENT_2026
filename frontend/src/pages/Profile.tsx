import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Camera,
  Save,
  Loader2
} from 'lucide-react'

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

export function Profile() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    level: user?.level || '',
    bio: user?.bio || '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // API call to update profile would go here
      // await api.updateProfile(formData)
      await refreshUser()
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getLevelLabel = (value: string) => {
    return LEVELS.find(l => l.value === value)?.label || value
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="card p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-500">@{user?.username}</p>

              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm">
                <GraduationCap className="w-4 h-4 mr-1" />
                {user?.user_type === 'student' ? 'Élève' :
                  user?.user_type === 'teacher' ? 'Enseignant' :
                    user?.user_type === 'parent' ? 'Parent' : 'Administrateur'}
              </div>

              {user?.level && (
                <p className="mt-2 text-sm text-gray-500">
                  Niveau: {getLevelLabel(user.level)}
                </p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations personnelles
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline text-sm"
                  >
                    Modifier
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-outline text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-primary text-sm"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="input"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900">{user?.first_name || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="label flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      Nom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="input"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900">{user?.last_name || '-'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                    Niveau scolaire
                  </label>
                  {isEditing ? (
                    <select
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
                  ) : (
                    <p className="text-gray-900">
                      {user?.level ? getLevelLabel(user.level) : '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Bio</label>
                  {isEditing ? (
                    <textarea
                      className="input h-24 resize-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Parlez-nous de vous..."
                    />
                  ) : (
                    <p className="text-gray-900">{user?.bio || '-'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations du compte
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Nom d'utilisateur</span>
                  <span className="text-gray-900 font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Type de compte</span>
                  <span className="text-gray-900 font-medium">
                    {user?.user_type === 'student' ? 'Élève' :
                      user?.user_type === 'teacher' ? 'Enseignant' :
                        user?.user_type === 'parent' ? 'Parent' : 'Administrateur'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date d'inscription</span>
                  <span className="text-gray-900 font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
