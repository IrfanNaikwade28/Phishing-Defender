import { useState } from 'react'
import api from '../api/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Profile() {
  const { user } = useAuth()
  const [newPassword, setNewPassword] = useState('')

  const changePassword = async (e) => {
    e.preventDefault()
    try {
      await api.post('/profile/password', { new_password: newPassword })
      toast.success('Password updated')
      setNewPassword('')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Update failed')
    }
  }

  return (
    <motion.div className="card"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <h1 className="text-xl font-semibold">Profile</h1>
      <p className="text-sm text-gray-500">{user?.email}</p>

      <form className="mt-4 flex gap-2" onSubmit={changePassword}>
        <input className="input" type="password" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        <button className="btn" type="submit">Update</button>
      </form>
    </motion.div>
  )
}
