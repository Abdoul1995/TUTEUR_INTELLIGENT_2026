import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { GraduationCap, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import api from '../services/api'

export function ResetPassword() {
    const { uid, token } = useParams<{ uid: string; token: string }>()
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        new_password: '',
        new_password_confirm: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.new_password !== formData.new_password_confirm) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            await api.confirmPasswordReset(uid!, token!, formData)
            setIsSuccess(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.new_password?.[0] || "Le lien est invalide ou a expiré.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="card p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Mot de passe modifié !
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion.
                        </p>
                        <Link to="/login" className="btn-primary w-full py-3">
                            Aller à la connexion maintenant
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Nouveau mot de passe
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Choisissez un nouveau mot de passe sécurisé
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="label">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input pr-10"
                                    value={formData.new_password}
                                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
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
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className="label">
                                Confirmer le nouveau mot de passe
                            </label>
                            <input
                                id="confirm_password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="input"
                                value={formData.new_password_confirm}
                                onChange={(e) => setFormData({ ...formData, new_password_confirm: e.target.value })}
                                placeholder="••••••••"
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Mise à jour...
                                </>
                            ) : (
                                'Réinitialiser le mot de passe'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
