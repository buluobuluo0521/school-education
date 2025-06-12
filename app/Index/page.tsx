'use client'
import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation'; // 新增导入
import { useRouter } from 'next/navigation';
 
function App() {
  const pathname = usePathname(); // 获取当前路由
  const router = useRouter();
  const [username, setUsername] = useState<string>('');

  // 从 localStorage 中获取用户名
  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
    }
  }, []);


 

  return (
    
    <div className="min-h-screen bg-gray-50">
      {/* 移除Navbar */}
      <main className="container mx-auto px-4 py-12">
        {/* 欢迎区域 - 新增样式 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col items-center text-center">
            {/* 猫咪图标 */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
              <span className="text-4xl">🐱</span>
            </div>
            {/* 欢迎标题 */}
            <h1 className="text-[clamp(1.8rem,5vw,3rem)] font-bold text-gray-800 mb-4 tracking-tight">
              欢迎来到小猫考试
            </h1>
            {/* 系统介绍 */}
            <p className="text-gray-600 text-lg max-w-2xl mb-8">
                小学生的考试系统。
            </p>
            {/* 功能入口按钮 */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => {
                    router.push('/Exam');
                  }} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
              >
                开始考试
                
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;