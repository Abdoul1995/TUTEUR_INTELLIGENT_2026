import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData = await api.getCurrentUser()
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.login(credentials.username, credentials.password)
      if (response.user && response.token) {
        // Stocker le token dans localStorage
        localStorage.setItem('token', response.token)
        setUser(response.user)
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await api.register(data)
      if (response.user && response.token) {
        // Stocker le token dans localStorage
        localStorage.setItem('token', response.token)
        setUser(response.user)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      setUser(null)
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await api.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
