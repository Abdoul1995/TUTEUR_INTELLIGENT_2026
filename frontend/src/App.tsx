import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Lessons } from './pages/Lessons'
import { LessonDetail } from './pages/LessonDetail'
import { Exercises } from './pages/Exercises'
import { ExerciseDetail } from './pages/ExerciseDetail'
import { Quizzes } from './pages/Quizzes'
import { QuizDetail } from './pages/QuizDetail'
import { Progress } from './pages/Progress'
import { Profile } from './pages/Profile'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ChatWidget } from './components/ai/ChatWidget'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="lessons" element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          } />
          <Route path="lessons/:slug" element={
            <ProtectedRoute>
              <LessonDetail />
            </ProtectedRoute>
          } />
          <Route path="exercises" element={
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          } />
          <Route path="exercises/:id" element={
            <ProtectedRoute>
              <ExerciseDetail />
            </ProtectedRoute>
          } />
          <Route path="quizzes" element={
            <ProtectedRoute>
              <Quizzes />
            </ProtectedRoute>
          } />
          <Route path="quizzes/:id" element={
            <ProtectedRoute>
              <QuizDetail />
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
      <ChatWidget />
    </AuthProvider>
  )
}

export default App
