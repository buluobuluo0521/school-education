'use client'
import React, { useEffect, useState } from 'react';
import EmptyState from '@/components/EmptyState';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
type ExamRecord = {
  id: number;
  examId: string;
  username: string;
  totalScore: number;
  correctCount: number;
  createdAt: string;
};

const ExamRecordPage = () => {
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  // 添加删除函数
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条考试记录吗？')) return;

    try {
      const response = await fetch(`/api/proxy/submit-exam?id=${id}`, { 
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('删除失败');

      // 更新本地记录列表
      setRecords(records.filter(record => record.id !== id));
      alert('删除成功');
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败，请重试');
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
    }
  }, []);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/proxy/submit-exam', { method: 'GET' });
        if (!response.ok) throw new Error('获取考试记录失败');
        const data = await response.json();
        setRecords(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <div className="p-8">加载中...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
    <Navbar 
      activeTab="考试记录"
      setActiveTab={() => {}}
      navItems={['首页', '考试中心', '考试记录', '错题集']}
      username={username}  // 动态绑定用户名
      classInfo="一年级三班"
    />

    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">考试记录</h1>
      {records.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {records.map((record) => (
            <div key={record.id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">考试ID: {record.examId}</p>
                <p className="text-base font-medium text-blue-500">用户: {record.username}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 bg">
                  <p className="text-red-500">得分: {record.totalScore}</p>
                  <p className="text-green-500">正确题数: {record.correctCount}</p>
                  <p className="text-sm text-gray-500 col-span-2">时间: {new Date(record.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(record.id)} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    {/* 页脚组件 */}
      <Footer />
    </div>
    
  );
};

export default ExamRecordPage;