'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WrongBookPage() {
  const [wrongs, setWrongs] = useState<any[]>([]);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
      fetch(`/api/proxy/wrongbook?username=${user}`)
        .then(res => res.json())
        .then(setWrongs);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeTab="错题集"
        setActiveTab={() => {}}
        navItems={['首页', '考试中心', '考试记录', '错题集']}
        username={username}
        classInfo="一年级三班"
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">我的错题集</h1>
        {wrongs.length === 0 ? (
          <div className="text-gray-500">暂无错题，继续加油！</div>
        ) : (
          <div className="space-y-6">
            {wrongs.map((item, idx) => (
              <div key={item.id} className="bg-white p-6 rounded shadow">
                <div className="mb-2 font-semibold">题目{idx + 1}：</div>
                <div className="mb-2">{item.content}</div>
                <div className="mb-2">
                  {item.options.map((opt: string, i: number) => (
                    <div key={i}>
                      {String.fromCharCode(65 + i)}. {opt}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-red-500">你的答案：{item.userAnswer}</span>
                  <span className="ml-4 text-green-600">正确答案：{item.correctAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
