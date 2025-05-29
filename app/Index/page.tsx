
'use client'
import React, { useState } from 'react';
import './css/app.css';  // 修改相对路径

function App() {
  const [activeTab, setActiveTab] = useState('考试中心');
  const [examType, setExamType] = useState('全部');
  const [subject, setSubject] = useState('全部');
  
  const navItems = ['首页', '考试中心', '考试记录', '错题集'];
  
  const examTypes = ['全部', '固定试卷', '时段试卷', '任务试卷'];
  const subjects = ['全部', '语文', '数学'];
  
  // 模拟试卷数据
  const exams = [
    {
      id: 1,
      title: "一年级语文卷",
      subject: "语文(一年级)",
      questions: 6,
      totalScore: 20,
      duration: "22分钟",
      startTime: "2024-08-10 00:00:00",
      endTime: "2024-09-09 00:00:00",
      type: "固定试卷"
    },
    {
      id: 2,
      title: "期中考试",
      subject: "语文(一年级)",
      questions: 1,
      totalScore: 5,
      duration: "4分钟",
      startTime: "",
      endTime: "",
      type: "时段试卷"
    },
    {
      id: 3,
      title: "测试答题",
      subject: "语文(一年级)",
      questions: 5,
      totalScore: 18,
      duration: "120分钟",
      startTime: "",
      endTime: "",
      type: "任务试卷"
    }
  ];

  // 过滤试卷
  const filteredExams = exams.filter(exam => {
    return (examType === '全部' || exam.type === examType) && 
           (subject === '全部' || exam.subject.includes(subject));
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 text-white font-bold text-xl px-3 py-2 rounded-md">
                  考
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-800">考试系统</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`${
                      activeTab === item
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">学生姓名</div>
                <div className="text-xs text-gray-500">一年级三班</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">考试中心</h1>
          <p className="mt-2 text-sm text-gray-500">
            选择试卷类型和学科，开始您的考试
          </p>
        </div>

        {/* 筛选区域 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">试卷类型：</span>
              <div className="flex flex-wrap gap-2">
                {examTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setExamType(type)}
                    className={`px-4 py-2 text-sm rounded-full ${
                      examType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">学科：</span>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubject(sub)}
                    className={`px-4 py-2 text-sm rounded-full ${
                      subject === sub
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 试卷列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {exam.type}
                  </span>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">学科</span>
                    <span className="text-gray-900 font-medium">{exam.subject}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">题目数量</span>
                    <span className="text-gray-900 font-medium">{exam.questions}题</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">试卷总分</span>
                    <span className="text-gray-900 font-medium">{exam.totalScore}分</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">考试时长</span>
                    <span className="text-gray-900 font-medium">{exam.duration}</span>
                  </div>
                  
                  {exam.startTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">开始时间</span>
                      <span className="text-gray-900 font-medium">{exam.startTime}</span>
                    </div>
                  )}
                  
                  {exam.endTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">结束时间</span>
                      <span className="text-gray-900 font-medium">{exam.endTime}</span>
                    </div>
                  )}
                </div>
                
                <button className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                  开始答题
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">没有找到符合条件的试卷</h3>
            <p className="mt-1 text-sm text-gray-500">
              请尝试选择其他筛选条件
            </p>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 考试系统 - 提供专业在线考试服务
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;