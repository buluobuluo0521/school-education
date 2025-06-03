'use client'
import React from 'react';
 interface ExamFiltersProps {
  examType: string;
  setExamType: (type: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  examTypes: string[];
  subjects: string[];
}

const ExamFilters = ({ examType, setExamType, subject, setSubject, examTypes, subjects }: ExamFiltersProps) => {
  return (
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
        {/* 切换学科 */}
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
  );
};

export default ExamFilters;  