'use client'

import { useState } from 'react'
import axios from 'axios'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })  // 改为username字段
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!form.username || !form.password) {  // 验证用户名是否为空
      setError('请输入用户名和密码')
      setLoading(false)
      return
    }
    try {
      const res = await axios.post('/api/proxy/login', form)
      setLoading(false)
      //localStorage 是浏览器提供的一种 持久化存储机制，用于在用户的浏览器中保存数据。
      localStorage.setItem('username', form.username); 
      window.location.href = '/Index'
    } catch (err: any) {
      setLoading(false)
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError('登录失败，请稍后重试')
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-8 space-y-4">
          <h1 className="text-2xl font-bold text-center mb-4">考试系统登录</h1>
          <div className="form-control">
            <input
              name="username"  // 改为username
              type="text"  // 输入类型改为text（用户名不一定是邮箱）
              placeholder="用户名"  // 占位符改为用户名
              className="input input-bordered w-full"
              value={form.username}  // 绑定username
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <input
              name="password"
              type="password"
              placeholder="密码"
              className="input input-bordered w-full"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={`btn btn-error w-full ${loading ? 'btn-disabled' : ''}`}>  {/* 将 btn-primary 改为 btn-error */}
            {loading ? '登录中...' : '登录'}
          </button>
          {error && <div className="text-error text-center">{error}</div>}
        </form>
      </div>
    </div>
  )
}