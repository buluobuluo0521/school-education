'use client'
import React, { useState, useEffect } from 'react';
import ExamFilters from '@/components/ExamFilters';
import ExamCard from '@/components/ExamCard';
import EmptyState from '@/components/EmptyState';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation'; // 新增导入
import Navbar from '@/components/Navbar';
export default function ExamPage() {
  const [activeTab, setActiveTab] = useState('首页');
  const [examType, setExamType] = useState('全部');
  const [subject, setSubject] = useState('全部');
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const examTypes = ['全部', '固定试卷', '时段试卷', '任务试卷'];
  const subjects = ['全部', '语文', '数学'];
  const pathname = usePathname(); // 获取当前路由
  useEffect(() => {
    setActiveTab('考试中心'); // 确保从父组件传递了setActiveTab
  }, []);

  // 监听路由变化，同步更新activeTab
  // useEffect(() => {
  //   const pathToTab = {
  //     '/Index': '首页',
  //     '/exam': '考试中心',
  //     '/ExamRecord': '考试记录',
  //     '/WrongBook': '错题集'
  //   };
  //   const matchedTab = pathToTab[pathname as keyof typeof pathToTab];
  //   if (matchedTab) setActiveTab(matchedTab);
  // }, [pathname]);
  //获取考试数据
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/proxy/exams');
        if (!response.ok) throw new Error('获取考试数据失败');
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error('获取考试数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExams();
  }, []);

  // 过滤试卷
  const filteredExams = exams.filter(exam => {
    return (examType === '全部' || exam.type === examType) && 
           (subject === '全部' || exam.subject.includes(subject));
  });
  console.log(filteredExams);
  

  const handleStartExam = (examId: number, examType: string, subject: string) => {
 
    window.location.href = `/Exampage?id=${examId}&type=${examType}&name=${subject}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏组件 */}
      
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
              exam={{
                ...exam,

                // 因为是因为后端返回的时间字段是 ISO 8601 格式的 UTC 时间字符串显示时间是不对，然后我进行格式转换
                startTime: exam.startTime ? new Date(exam.startTime).toLocaleString('zh-CN', { 
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit' 
                }) : exam.startTime,
                // 同理格式化 endTime
                endTime: exam.endTime ? new Date(exam.endTime).toLocaleString('zh-CN', { 
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit' 
                }) : exam.endTime
              }} 


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

