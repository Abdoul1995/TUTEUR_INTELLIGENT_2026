import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  Home,
  User,
  LogOut,
  BarChart3,
  GraduationCap,
  Menu,
  X,
  ClipboardList,
  Languages
} from 'lucide-react'
import { useState } from 'react'

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr'
    i18n.changeLanguage(newLang)
  }

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.lessons'), href: '/lessons', icon: BookOpen },
    { name: t('nav.exercises'), href: '/exercises', icon: ClipboardList },
  ]

  const authNavigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: BarChart3 },
    { name: t('nav.progress'), href: '/progress', icon: GraduationCap },
    { name: t('nav.profile'), href: '/profile', icon: User },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
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
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
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
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center space-x-1"
                title={i18n.language === 'fr' ? 'Switch to English' : 'Passer en Français'}
              >
                <Languages className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{i18n.language}</span>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn-outline text-sm">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    {t('nav.register')}
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
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${isActive(item.href)
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
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${isActive(item.href)
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
                    onClick={toggleLanguage}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 uppercase"
                  >
                    <Languages className="w-5 h-5 mr-3" />
                    {i18n.language === 'fr' ? 'English' : 'Français'}
                  </button>
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    {t('nav.logout')}
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 uppercase"
                  >
                    <Languages className="w-5 h-5 mr-3" />
                    {i18n.language === 'fr' ? 'English' : 'Français'}
                  </button>
                  <div className="border-t border-gray-100 my-2" />
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5 mr-3" />
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50"
                  >
                    <GraduationCap className="w-5 h-5 mr-3" />
                    {t('nav.register')}
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
