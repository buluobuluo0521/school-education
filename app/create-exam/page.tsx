'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateExamPage() {
  const router = useRouter();
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 调用API将数据插入试卷管理表
      const response = await fetch('/api/proxy/mss/exam-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ examName, examType })
      });
      
      if (!response.ok) {
        throw new Error('创建试卷失败');
      }
      
      const result = await response.json();
      alert('试卷创建成功！');
      
      // 返回试卷列表页
      router.push('/teacher');
    } catch (error) {
      console.error('创建试卷时出错:', error);
      alert('创建试卷失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">新建试卷</h1>
        
       
        <form onSubmit={handleSubmit} className="space-y-6">
        
          <div>
            <button 
              type="button" 
              className="w-full px-4 py-4 bg-blue-600 text-white rounded-md text-left font-medium text-lg"
              onClick={() => document.getElementById('examName')?.focus()}
            >
              试卷名称
            </button>
            <input
              id="examName"
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md mt-2 text-lg"
              placeholder="请输入试卷名称"
              required
            />
          </div>
          
          {/* 试卷类型输入框 */}
          <div>
            <button 
              type="button" 
              className="w-full px-4 py-4 bg-blue-600 text-white rounded-md text-left font-medium text-lg"
              onClick={() => document.getElementById('examType')?.focus()}
            >
              试卷类型
            </button>
            <input
              id="examType"
              type="text"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md mt-2 text-lg"
              placeholder="请输入试卷类型"
              required
            />
          </div>
          
          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-md text-white font-bold text-lg transition ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            确定新建
          </button>
        </form>
      </div>
    </div>
  );
}