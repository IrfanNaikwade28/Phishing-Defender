import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import History from './pages/History.jsx'
import Profile from './pages/Profile.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  )
}
