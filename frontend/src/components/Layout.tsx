import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  BookOpen, 
  Home, 
  User, 
  LogOut, 
  BarChart3, 
  GraduationCap,
  Menu,
  X,
  Brain,
  ClipboardList
} from 'lucide-react'
import { useState } from 'react'

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Leçons', href: '/lessons', icon: BookOpen },
    { name: 'Exercices', href: '/exercises', icon: ClipboardList },
    { name: 'Quiz', href: '/quizzes', icon: Brain },
  ]

  const authNavigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3 },
    { name: 'Progression', href: '/progress', icon: GraduationCap },
    { name: 'Profil', href: '/profile', icon: User },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient hidden sm:block">
                  Tuteur Intelligent
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="h-6 w-px bg-gray-200 mx-2" />
                  {authNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <button
                    onClick={logout}
                    className="btn-outline text-sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn-outline text-sm">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  {authNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Déconnexion
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50"
                  >
                    <GraduationCap className="w-5 h-5 mr-3" />
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-semibold text-gray-900">
                Tuteur Intelligent
              </span>
            </div>
            <div className="text-sm text-gray-500">
              © 2026 Tuteur Intelligent. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
