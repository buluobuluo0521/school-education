'use client'
import Navbar from '@/components/Navbar'
import React, { useEffect, useState } from 'react'

export default function AppNavbarWrapper() {
  const [activeTab, setActiveTab] = useState('首页')
  const navItems = ['首页', '考试中心', '考试记录', '错题集']
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const user = localStorage.getItem('username')
    if (user) setUsername(user)
  }, [])

  return (
    <Navbar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      navItems={navItems}
      username={username}
      classInfo="一年级三班"
    />
  )
}
