"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

// 定义试卷数据结构接口
interface Exam {
  management_id: number;
  exam_name: string;
  exam_type: string;
  creation_time: string;
}

export default function TeacherExamPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEditExam = (managementId: number) => {
    router.push(`/edit-exam/${managementId}`);
  };

  // 从API获取试卷数据
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        // 调用后端API获取所有试卷列表
        const response = await axios.get("/api/proxy/mss/select-exam");

        // 检查响应是否成功
        if (response.data && response.data.success) {
          // 提取试卷数据并按创建时间倒序排列
          const sortedExams = response.data.exams.sort(
            (a: Exam, b: Exam) =>
              new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
          );
          setExams(sortedExams);
        } else {
          setError("获取试卷数据失败");
        }
      } catch (err) {
        console.error("获取试卷时出错:", err);
        setError("获取试卷数据时发生错误");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  // 处理新建试卷按钮点击
  const handleCreateNewExam = () => {
    router.push("/create-exam");
  };

  // 格式化日期为 YYYY-MM-DD 格式
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN");
  };

  // 处理试卷删除
// 在handleDeleteExam函数中修改以下部分
// 处理试卷删除
const handleDeleteExam = async (managementId: number) => {
  const confirmDelete = window.confirm(`确定要删除试卷 "${exams.find(e => e.management_id === managementId)?.exam_name}" 吗？此操作不可恢复！`);
  
  if (!confirmDelete) return;

  setDeletingId(managementId);
  
  try {
    // 修改点1：使用 params 传递参数而不是路径参数
    const response = await axios.delete("/api/proxy/mss/delete-exam", {
      params: { management_id: managementId } // 使用查询参数传递ID
    });
    
    if (response.data && response.data.success) {
      setExams(exams.filter(exam => exam.management_id !== managementId));
      toast.success("试卷删除成功");
    } else {
      throw new Error(response.data?.error || "删除失败");
    }
  } catch (error: any) {
    // ...（原有错误处理保持不变）
  } finally {
    setDeletingId(null);
  }
};

  // 过滤试卷列表（根据搜索查询）
  const filteredExams = exams.filter((exam) =>
    exam.exam_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
      {/* 标题区域 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">试卷管理模块</h1>

        {/* 搜索和新建按钮区域 */}
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索试卷..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={handleCreateNewExam}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md"
          >
            新建试卷
          </button>
        </div>
      </div>

      {/* 试卷列表区域 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* 列表标题栏 */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">试卷列表</h2>
          <span className="text-sm text-gray-500">
            {filteredExams.length} 份试卷
          </span>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* 错误提示 */}
        {error && !isLoading && (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() => window.location.reload()}
            >
              重新加载
            </button>
          </div>
        )}

        {/* 无试卷提示 */}
        {!isLoading && !error && filteredExams.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">没有找到相关试卷</p>
            {exams.length === 0 && (
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleCreateNewExam}
              >
                创建新试卷
              </button>
            )}
          </div>
        )}

        {/* 试卷列表 */}
        {!isLoading && !error && filteredExams.length > 0 && (
          <>
            {filteredExams.map((exam) => (
              <div
                key={exam.management_id}
                className="border-b border-gray-200 p-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div className="flex items-center">
                  <span className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium mr-4">
                    {exam.exam_name}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {exam.exam_type}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      创建时间: {formatDate(exam.creation_time)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    发布
                  </button>
                  <button
                    onClick={() => handleEditExam(exam.management_id)}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.management_id)}
                    disabled={deletingId === exam.management_id}
                    className={`bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center 
                    ${deletingId === exam.management_id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                  >
                    {deletingId === exam.management_id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        删除中
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        删除
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* 分页控件 */}
            <div className="flex justify-center py-3">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full ${i === 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                      } flex items-center justify-center text-sm font-medium`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}