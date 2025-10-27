import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-2xl font-semibold mb-4">Welcome back</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full" type="submit">Login</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="underline">Register</Link></p>
    </div>
  )
}
