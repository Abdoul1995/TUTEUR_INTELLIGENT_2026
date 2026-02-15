import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export function Home() {
  const { isAuthenticated } = useAuth()
  const features = [
    {
      icon: BookOpen,
      title: 'Leçons interactives',
      description: 'Accédez à des leçons conformes au programme officiel, expliquées de manière simple et ludique.',
    },
    {
      icon: Brain,
      title: 'Exercices adaptatifs',
      description: 'Pratiquez avec des exercices qui s\'adaptent à votre niveau et votre rythme d\'apprentissage.',
    },
    {
      icon: Target,
      title: 'Révision intelligente',
      description: 'Identifiez vos points faibles et recevez des recommandations personnalisées.',
    },
    {
      icon: TrendingUp,
      title: 'Suivi de progression',
      description: 'Visualisez votre évolution et célébrez vos réussites avec des badges.',
    },
  ]

  const levels = [
    { name: 'Primaire', range: 'CP1 - CM2', color: 'bg-green-500' },
    { name: 'Collège', range: '6ème - 3ème', color: 'bg-blue-500' },
    { name: 'Lycée', range: 'Seconde - Terminale', color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Application éducative intelligente
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Apprenez à votre rythme avec un{' '}
                <span className="text-yellow-300">tuteur intelligent</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Une solution éducative numérique conçue pour accompagner les élèves
                du primaire et du secondaire dans leur apprentissage quotidien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isAuthenticated ? (
                  <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-8 py-3">
                    Commencer gratuitement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-8 py-3">
                    Mon Tableau de Bord
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                )}
              </div>

              <div className="mt-10 flex items-center space-x-6 text-sm text-primary-100">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Gratuit
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Sans publicité
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Programme officiel
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <BookOpen className="w-10 h-10 mx-auto mb-3" />
                      <div className="text-3xl font-bold">500+</div>
                      <div className="text-primary-100">Leçons</div>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <Brain className="w-10 h-10 mx-auto mb-3" />
                      <div className="text-3xl font-bold">2000+</div>
                      <div className="text-primary-100">Exercices</div>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <Users className="w-10 h-10 mx-auto mb-3" />
                      <div className="text-3xl font-bold">10K+</div>
                      <div className="text-primary-100">Élèves</div>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <Target className="w-10 h-10 mx-auto mb-3" />
                      <div className="text-3xl font-bold">95%</div>
                      <div className="text-primary-100">Réussite</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour réussir votre scolarité,
              dans une seule application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pour tous les niveaux
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Du primaire au lycée, trouvez le contenu adapté à votre niveau scolaire.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {levels.map((level, index) => (
              <div key={index} className="card overflow-hidden">
                <div className={`h-2 ${level.color}`} />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {level.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {level.range}
                  </p>
                  <Link
                    to={`/lessons?level=${level.name.toLowerCase()}`}
                    className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                  >
                    Voir les leçons
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers d'élèves qui utilisent déjà Tuteur Intelligent
            pour améliorer leurs résultats scolaires.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-8 py-3"
              >
                Créer un compte gratuit
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dashboard"
                className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-8 py-3"
              >
                Accéder à mon espace
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
