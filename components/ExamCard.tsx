'use client'
import React from 'react';
  interface Exam {
  id: number;
  title: string;
  subject: string;
  questions: number;
  totalScore: number;
  duration: string;
  startTime?: string;
  endTime?: string;
  type: string;
}

interface ExamCardProps {
  exam: Exam;
  onStartExam: (examId: number, examType: string, subject: string) => void;
}

const ExamCard = ({ exam, onStartExam }: ExamCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
        
        <button
          className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          onClick={() => onStartExam(exam.id, exam.type, exam.subject)}
        >
          开始答题
        </button>
      </div>
    </div>
  );
};

export default ExamCard;  