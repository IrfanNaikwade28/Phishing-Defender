import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.get('/profile')
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    setToken(res.data.access_token)
    toast.success('Welcome back!')
  }

  const register = async (email, password) => {
    await api.post('/register', { email, password })
    toast.success('Account created. Please login.')
  }

  const logout = () => {
    setToken(null)
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
