import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Moon, Sun, LayoutDashboard, History as HistoryIcon, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => (
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark'
  ))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <header className="border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </span>
          Phishing Defender
        </Link>
        <nav className="flex gap-2 items-center">
          {token && (
            <>
              <Link to="/" className="btn-ghost"><LayoutDashboard className="h-4 w-4"/> <span className="hidden sm:inline">Dashboard</span></Link>
              <Link to="/history" className="btn-ghost"><HistoryIcon className="h-4 w-4"/> <span className="hidden sm:inline">History</span></Link>
              <Link to="/profile" className="btn-ghost"><User className="h-4 w-4"/> <span className="hidden sm:inline">Profile</span></Link>
              <button onClick={() => setDark(d => !d)} className="btn-ghost" aria-label="Toggle theme">
                {dark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
              </button>
              <button onClick={handleLogout} className="btn ml-1"><LogOut className="h-4 w-4 mr-1"/> Logout</button>
            </>
          )}
          {!token && (
            <>
              <button onClick={() => setDark(d => !d)} className="btn-ghost mr-1" aria-label="Toggle theme">
                {dark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
              </button>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
