'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
  createdAt: string
}

export default function UserManagePage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/proxy/user')
      setUsers(res.data)
    } catch {
      setError('获取用户列表失败')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('/api/proxy/user', form)
      setForm({ username: '', email: '', password: '' })
      fetchUsers()
    } catch {
      setError('创建用户失败')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">用户维护</h1>
      <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-4 space-y-4">
        <div className="form-control">
          <input
            name="username"
            type="text"
            placeholder="用户名"
            className="input input-bordered"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <input
            name="email"
            type="email"
            placeholder="邮箱"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <input
            name="password"
            type="password"
            placeholder="密码"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">新增用户</button>
        {error && <div className="text-error">{error}</div>}
      </form>
      <div className="card bg-base-200 shadow-xl p-4">
        <h2 className="card-title mb-2">用户列表</h2>
        {loading ? (
          <div className="loading loading-spinner loading-lg"></div>
        ) : (
          <ul className="space-y-2">
            {users.map(user => (
              <li key={user.id} className="border-b py-2">
                <span className="font-semibold">{user.username}</span> ({user.email}) - {user.createdAt?.slice(0, 10)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}