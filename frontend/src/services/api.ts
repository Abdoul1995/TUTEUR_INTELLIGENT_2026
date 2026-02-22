import axios, { AxiosInstance, AxiosError } from 'axios'

const baseAppUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const API_BASE_URL = baseAppUrl.endsWith('/') ? baseAppUrl : `${baseAppUrl}/`

class ApiService {
  public client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Token ${token}`
        }
        // Désactiver withCredentials pour éviter les problèmes CORS
        config.withCredentials = false
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth
  async login(username: string, password: string) {
    const response = await this.client.post('users/login/', { username, password })
    return response.data
  }

  async register(data: any) {
    const response = await this.client.post('users/register/', data)
    return response.data
  }

  async logout() {
    const response = await this.client.post('users/logout/')
    return response.data
  }

  async getCurrentUser() {
    const response = await this.client.get('users/me/')
    return response.data
  }

  async requestPasswordReset(email: string) {
    const response = await this.client.post('users/password-reset/', { email })
    return response.data
  }

  async confirmPasswordReset(uidb64: string, token: string, data: any) {
    const response = await this.client.post(`users/password-reset-confirm/${uidb64}/${token}/`, data)
    return response.data
  }

  // Subjects
  async getSubjects() {
    const response = await this.client.get('lessons/subjects/')
    return response.data
  }

  async getSubject(slug: string) {
    const response = await this.client.get(`lessons/subjects/${slug}/`)
    return response.data
  }

  // Chapters
  async getChapters(params?: { subject?: string }) {
    const response = await this.client.get('lessons/chapters/', { params })
    return response.data
  }

  async getChapter(slug: string) {
    const response = await this.client.get(`lessons/chapters/${slug}/`)
    return response.data
  }

  // Lessons
  async getLessons(params?: { subject?: string; level?: string; search?: string }) {
    const response = await this.client.get('lessons/lessons/', { params })
    return response.data
  }

  async getLesson(slug: string) {
    const response = await this.client.get(`lessons/lessons/${slug}/`)
    return response.data
  }

  async markLessonViewed(slug: string, data: { completed?: boolean; completion_percentage?: number }) {
    const response = await this.client.post(`lessons/lessons/${slug}/mark_viewed/`, data)
    return response.data
  }

  async getRecommendedLessons() {
    const response = await this.client.get('lessons/lessons/recommended/')
    return response.data
  }

  async getMyLessons() {
    const response = await this.client.get('lessons/lessons/my_lessons/')
    return response.data
  }

  // Exercises
  async getExercises(params?: { subject?: string; level?: string; difficulty?: string }) {
    const response = await this.client.get('exercises/', { params })
    return response.data
  }

  async getExercise(id: number) {
    const response = await this.client.get(`exercises/${id}/`)
    return response.data
  }

  async createExercise(data: any) {
    const response = await this.client.post('exercises/', data)
    return response.data
  }

  async submitExercise(id: number, data: { answer: any; time_spent?: number; hints_used?: number }) {
    const response = await this.client.post(`exercises/${id}/submit/`, data)
    return response.data
  }

  async getMyExerciseAttempts() {
    const response = await this.client.get('exercises/my_attempts/')
    return response.data
  }

  // Quizzes
  async getQuizzes(params?: { subject?: string; level?: string }) {
    const response = await this.client.get('exercises/quizzes/', { params })
    return response.data
  }

  async getQuiz(id: number) {
    const response = await this.client.get(`exercises/quizzes/${id}/`)
    return response.data
  }

  async startQuiz(id: number) {
    const response = await this.client.post(`exercises/quizzes/${id}/start/`)
    return response.data
  }

  async submitQuiz(id: number, data: { attempt_id: number; answers: Record<string, any> }) {
    const response = await this.client.post(`exercises/quizzes/${id}/submit/`, data)
    return response.data
  }

  async getMyQuizAttempts() {
    const response = await this.client.get('exercises/quizzes/my_attempts/')
    return response.data
  }

  // Progress
  async getDashboard() {
    const response = await this.client.get('progress/dashboard/')
    return response.data
  }

  async getStats() {
    const response = await this.client.get('progress/stats/')
    return response.data
  }

  async updateStreak() {
    const response = await this.client.post('progress/update-streak/')
    return response.data
  }

  async addPoints(points: number) {
    const response = await this.client.post('progress/add-points/', { points })
    return response.data
  }

  // Subject Progress
  async getSubjectProgress() {
    const response = await this.client.get('progress/subjects/')
    return response.data
  }

  // Weak Areas
  async getWeakAreas() {
    const response = await this.client.get('progress/weak-areas/')
    return response.data
  }

  async markWeakAreaResolved(id: number) {
    const response = await this.client.post(`progress/weak-areas/${id}/mark_resolved/`)
    return response.data
  }

  // Achievements
  async getAchievements() {
    const response = await this.client.get('progress/achievements/')
    return response.data
  }

  async getMyAchievements() {
    const response = await this.client.get('progress/my-achievements/')
    return response.data
  }
}

export const api = new ApiService()
export default api
