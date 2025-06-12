'use client'
import Navbar from '@/components/Navbar'
import React, { useEffect, useReducer, useState } from 'react'
import { usePathname } from 'next/navigation'; // 新增导入
import { useNavigationStore } from '@/lib/store/navigationStore';


export default function AppNavbarWrapper() {
  const path = usePathname(); // 获取当前路由

  if (path == '/' || path == '/login' || path == '/register' || path == '/teacher' || path == '/create-exam') {
    return null;
  }
  const { activeTab, setActiveTab } = useNavigationStore();
  const navItems = ['首页', '考试中心', '考试记录', '错题集']
  // console.log(activeTab);
  
  // // switch (path) {
  // //   case '/Index':
  // //     setActiveTab(navItems[0]);
  // //     break;
  // //   case '/exam':
  // //     // router.push('/exam');
  // //     setActiveTab(navItems[1]);
  // //     break;
  // //   // case '考试记录':
  // //   //   router.push('/ExamRecord');
  // //   //   break;
  // //   // case '错题集':
  // //   //   router.push('/WrongBook');
  // //   //   break;
  // //   // 其他导航项可在此扩展
  // //   default:
  // //     break;
  // // }

 
  // 监听路由变化，同步更新activeTab
 
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
