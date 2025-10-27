import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="font-semibold text-lg">🛡️ Phishing Defender</Link>
        <nav className="flex gap-4 items-center">
          {token && (
            <>
              <Link to="/" className="hover:underline">Dashboard</Link>
              <Link to="/history" className="hover:underline">History</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button onClick={handleLogout} className="btn">Logout</button>
            </>
          )}
          {!token && (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
