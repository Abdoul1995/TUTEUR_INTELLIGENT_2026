export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: 'student' | 'teacher' | 'parent' | 'admin'
  level?: string
  date_of_birth?: string
  phone?: string
  avatar?: string
  bio?: string
  is_active_student: boolean
  created_at: string
  updated_at: string
}

export interface Subject {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
  order: number
  is_active: boolean
  chapter_count: number
}

export interface Chapter {
  id: number
  title: string
  slug: string
  description: string
  subject: number
  subject_name: string
  order: number
  is_active: boolean
  lesson_count: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: number
  title: string
  slug: string
  content: string
  summary: string
  level: string
  chapter: number
  chapter_title: string
  subject_name: string
  duration_minutes: number
  order: number
  is_official: boolean
  image?: string
  video_url?: string
  resources?: LessonResource[]
  is_viewed?: boolean
  completion_percentage?: number
  created_at: string
  updated_at: string
}

export interface LessonResource {
  id: number
  title: string
  resource_type: 'pdf' | 'video' | 'audio' | 'image' | 'link' | 'other'
  file?: string
  url?: string
  description: string
  order: number
}

export interface Exercise {
  id: number
  title: string
  description: string
  exercise_type: 'qcm' | 'classic'
  type_display: string
  difficulty: 'easy' | 'medium' | 'hard'
  difficulty_display: string
  level: string
  subject: number
  subject_name: string
  lesson?: number
  lesson_title?: string
  points: number
  time_limit?: number
  order: number
  content: any
  hints: string[]
  explanation: string
  attempts_count?: number
  best_score?: number
  correct_answers?: any
}

export interface ExerciseAttempt {
  id: number
  exercise: number
  exercise_title: string
  answer: any
  is_correct: boolean
  score: number
  time_spent: number
  hints_used: number
  attempt_number: number
  created_at: string
}

export interface Quiz {
  id: number
  title: string
  description: string
  subject: number
  subject_name: string
  lesson?: number
  lesson_title?: string
  level: string
  time_limit?: number
  passing_score: number
  exercise_count: number
  exercises?: Exercise[]
}

export interface QuizAttempt {
  id: number
  quiz: number
  quiz_title: string
  score: number
  total_score: number
  percentage: number
  is_passed: boolean
  time_spent: number
  completed: boolean
  started_at: string
  completed_at?: string
}

export interface Progress {
  id: number
  student: number
  student_name: string
  total_lessons_viewed: number
  total_exercises_completed: number
  total_quizzes_completed: number
  total_points: number
  current_streak: number
  longest_streak: number
  last_activity?: string
  weekly_goal: number
  weekly_progress: {
    lessons_this_week: number
    goal: number
    percentage: number
  }
}

export interface SubjectProgress {
  id: number
  subject: number
  subject_name: string
  subject_color: string
  lessons_completed: number
  total_lessons: number
  completion_percentage: number
  exercises_completed: number
  average_score: number
  mastery_level: number
}

export interface WeakArea {
  id: number
  subject: number
  subject_name: string
  concept: string
  description: string
  error_count: number
  recommended_lessons_count: number
  is_resolved: boolean
  created_at: string
  resolved_at?: string
}

export interface Achievement {
  id: number
  name: string
  description: string
  achievement_type: string
  type_display: string
  icon: string
  color: string
  requirement: number
}

export interface StudentAchievement {
  id: number
  achievement: number
  achievement_details: Achievement
  earned_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  user_type: string
  level?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
