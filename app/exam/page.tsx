'use client'
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';

export default function ExamPage() {

  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [examId, setExamId] = useState('');
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setExamId(urlParams.get('id') || '');
    
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/proxy/question');
        if (!response.ok) throw new Error('获取考试数据失败');
        const data = await response.json();
        console.log(data)
        setExams(data);
      } catch (error) {
        console.error('获取考试数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeTab="考试页面"
        setActiveTab={() => {}}
        navItems={['首页', '考试中心', '考试记录', '错题集', '考试页面']}
        username="学生姓名"
        classInfo="一年级三班"
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900">考试进行中</h1>
          <p className="mt-4 text-lg text-gray-600">当前考试ID：{examId}</p>
        </div>

        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((question, index) => (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">第{index + 1}题（{question.score}分）</h3>
                <p className="text-gray-700 mb-4">{question.content}</p>
                <div className="space-y-2">
                  {question.options.map((option: string, i: number) => (
                    <div
                      key={i}
                      onClick={() => !submitted && setUserAnswers(prev => ({
                        ...prev,
                        [question.id]: String.fromCharCode(65 + i)
                      }))}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        userAnswers[question.id] === String.fromCharCode(65 + i)
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : 'border bg-gray-50'
                      } ${
                        submitted && 
                        (String.fromCharCode(65 + i) === question.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : userAnswers[question.id] === String.fromCharCode(65 + i)
                            ? 'bg-red-100 border-red-500'
                            : '')
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">加载试题中...</p>
          </div>
        )}

        {!loading && !submitted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-7xl mx-auto text-right">
              <button
                onClick={() => {
                  const score = exams.reduce((acc, question) => {
                    return userAnswers[question.id] === question.correctAnswer
                      ? acc + question.score
                      : acc;
                  }, 0);
                  setTotalScore(score);
                  setSubmitted(true);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                提交试卷
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold">总得分：{totalScore}</span>
                <span className="ml-4 text-gray-600">
                  正确题数：{Object.keys(userAnswers).filter(k => userAnswers[k] === exams.find(q => q.id === k)?.correctAnswer).length}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.location.href = '/Index'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  返回考试中心
                </button>
                <div className="text-red-600">
                  {totalScore >= 60 ? '考试合格 🎉' : '考试未通过 ❌'}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}