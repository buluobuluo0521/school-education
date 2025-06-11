'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function UserManagePage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const data = await axios.post('/api/proxy/register', form)
      console.log(data)
      if(data){
        alert('注册成功！')
        setForm({ username: '', email: '', password: '' })
        router.push('/login')
      }
    } catch {
      setError('创建用户失败')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">用户注册</h1>
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
        <button type="submit" className="btn btn-primary">注册用户</button>
        {error && <div className="text-error">{error}</div>}
      </form>
    </div>
  )
}