'use client'
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ExamFilters from '@/components/ExamFilters';
import ExamCard from '@/components/ExamCard';
import EmptyState from '@/components/EmptyState';
import Footer from '@/components/Footer';
 

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

  const handleStartExam = (examId: number) => {
    console.log(`开始考试: ${examId}`);
    // 这里可以添加开始考试的逻辑
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={navItems}
        username="学生姓名"
        classInfo="一年级三班"
      />
  {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">考试中心</h1>
          <p className="mt-2 text-sm text-gray-500">选择试卷类型和学科，开始您的考试</p>
        </div>
 {/* 考试过滤器组件 */}
        <ExamFilters 
          examType={examType} 
          setExamType={setExamType} 
          subject={subject} 
          setSubject={setSubject}
          examTypes={examTypes}
          subjects={subjects}
        />
{/* 考试卡片网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard 
              key={exam.id} 
              exam={exam} 
              onStartExam={handleStartExam} 
            />
          ))}
        </div>
        {/* 空状态显示 */}
        {filteredExams.length === 0 && <EmptyState />}
      </main>
       {/* 页脚组件 */}
      <Footer />
    </div>
  );
}

export default App;