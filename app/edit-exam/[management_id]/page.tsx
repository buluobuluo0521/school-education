"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

// 定义试卷和题目数据类型
interface Exam {
  management_id: number;
  exam_name: string;
  exam_type: string;
}

interface Question {
  question_id: number;
  question_number: string;
  question_type: string;
  question: string;
  answer: string;
  score: number;
}

export default function EditExamPage() {
  const router = useRouter();
  const { management_id } = useParams();
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 当前选中的题目索引

  // 从后端加载试卷和题目数据
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setIsLoading(true);
        // 获取试卷基本信息
        const examResponse = await axios.get(
          `/api/proxy/mss/get-exam-papers/${management_id}`
        );
        const examData = examResponse.data;
        if (!examData.success) {
          throw new Error("获取试卷信息失败");
        }
        setExamName(examData.exam.exam_name);
        setExamType(examData.exam.exam_type);

        // 获取题目列表
        const questionsResponse = await axios.get(
          `/api/proxy/mss/get-list-questions/${management_id}`
        );
        const questionsData = questionsResponse.data;
        if (!questionsData.success) {
          throw new Error("获取题目信息失败");
        }
        setQuestions(questionsData.questions);
      } catch (err: any) {
        console.error("加载试卷和题目数据时出错:", err);
        setError(err.message || "加载数据失败，请重试");
      } finally {
        setIsLoading(false);
      }
    };

    if (management_id) {
      fetchExamData();
    }
  }, [management_id]);

  // 添加新题目
  const addNewQuestion = () => {
    const newQuestions = [
      ...questions,
      {
        question_id: Date.now(),
        question_number: `${questions.length + 1}`,
        question_type: "单选题",
        question: "",
        answer: "",
        score: 0,
      },
    ];
    setQuestions(newQuestions);
    setCurrentQuestionIndex(newQuestions.length - 1); // 自动选中新添加的题目
  };

  // 更新题目信息
  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  // 删除题目
  const deleteQuestion = (index: number) => {
    if (window.confirm("确定删除该题目吗？")) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      
      // 更新题号
      const renumbered = updatedQuestions.map((q, idx) => ({
        ...q,
        question_number: `${idx + 1}`,
      }));
      
      // 调整当前选中的题目索引
      let newCurrentIndex = currentQuestionIndex;
      if (index === currentQuestionIndex) {
        // 如果删除的是当前题目
        if (renumbered.length === 0) {
          newCurrentIndex = -1; // 没有题目了
        } else if (currentQuestionIndex >= renumbered.length) {
          newCurrentIndex = renumbered.length - 1; // 删除的是最后一个，则选中新的最后一个
        }
        // 否则保持当前位置（后面的题目会自动前移）
      } else if (index < currentQuestionIndex) {
        newCurrentIndex = currentQuestionIndex - 1; // 删除的是前面的题目，当前索引减一
      }
      
      setQuestions(renumbered);
      setCurrentQuestionIndex(newCurrentIndex);
    }
  };

  // 保存试卷和题目
  const saveExam = async () => {
    try {
      // 验证试卷基本信息
      if (!examName || !examType) {
        alert("请填写试卷名称和类型");
        return;
      }

      // 验证题目
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.answer || q.score <= 0) {
          alert(`第${i + 1}题不完整，请检查题目内容、答案和分值`);
          return;
        }
      }

      // 更新试卷基本信息
      await axios.put(`/api/proxy/mss/update-exam/${management_id}`, {
        exam_name: examName,
        exam_type: examType,
      });

      // 更新题目信息
      const saveQuestionsResponse = await axios.put(
        `/api/proxy/mss/update-questions/${management_id}`,
        {
          questions: questions.map((q) => ({
            question_id: q.question_id > 0 ? q.question_id : null,
            question_number: q.question_number,
            question_type: q.question_type,
            content: q.question,
            answer: q.answer,
            score: q.score,
          })),
        }
      );

      if (!saveQuestionsResponse.data.success) {
        throw new Error("保存题目失败");
      }

      alert("试卷保存成功");
      router.push("/teacher");
    } catch (error: any) {
      console.error("保存试卷时出错:", error);
      alert(error.message || "保存失败，请重试");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* 左侧题目导航栏 */}
      <div className="w-1/4 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg mb-2">题目列表</h2>
          <button
            onClick={addNewQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            添加题目
          </button>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          {questions.map((question, index) => (
            <div
              key={question.question_id}
              className={`p-4 border-b border-gray-200 cursor-pointer flex justify-between items-center ${
                currentQuestionIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              <div>
                <span className="font-medium">题{index + 1}: </span>
                <span>{question.question_type}</span>
                <span className="ml-2">({question.score}分)</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteQuestion(index);
                }}
                className="text-red-500 hover:text-red-700"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧编辑区域 */}
      <div className="flex-1 p-6">
        {/* 试卷基本信息 */}
        <div className="space-y-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">编辑试卷</h1>
          <div>
            <div className="bg-blue-100 p-3 rounded-t-md">
              <h2 className="font-bold text-blue-800">试卷名称</h2>
            </div>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-b-md text-lg"
              placeholder="请输入试卷名称"
            />
          </div>

          <div>
            <div className="bg-blue-100 p-3 rounded-t-md">
              <h2 className="font-bold text-blue-800">试卷类型</h2>
            </div>
            <input
              type="text"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-b-md text-lg"
              placeholder="请输入试卷类型"
            />
          </div>
        </div>

        {/* 当前题目编辑区域 */}
        {questions.length > 0 && currentQuestionIndex >= 0 && (
          <div className="border border-gray-200 rounded-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">题目 {currentQuestionIndex + 1}</h2>
              <button
                onClick={() => deleteQuestion(currentQuestionIndex)}
                className="text-red-500 hover:text-red-700"
              >
                删除此题
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* 题号 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">题号</label>
                <input
                  type="text"
                  value={questions[currentQuestionIndex].question_number}
                  onChange={(e) =>
                    updateQuestion(currentQuestionIndex, "question_number", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* 题型 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">题型</label>
                <select
                  value={questions[currentQuestionIndex].question_type}
                  onChange={(e) =>
                    updateQuestion(currentQuestionIndex, "question_type", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="单选题">单选题</option>
                  <option value="多选题">多选题</option>
                  <option value="填空题">填空题</option>
                  <option value="简答题">简答题</option>
                  <option value="论述题">论述题</option>
                </select>
              </div>

              {/* 分值 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">分值</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={questions[currentQuestionIndex].score}
                  onChange={(e) =>
                    updateQuestion(currentQuestionIndex, "score", parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* 题目内容 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">题目内容</label>
              <textarea
                rows={4}
                value={questions[currentQuestionIndex].question}
                onChange={(e) =>
                  updateQuestion(currentQuestionIndex, "question", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="请输入题目内容..."
              />
            </div>

            {/* 答案 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">答案</label>
              <textarea
                rows={4}
                value={questions[currentQuestionIndex].answer}
                onChange={(e) =>
                  updateQuestion(currentQuestionIndex, "answer", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="请输入答案..."
              />
            </div>

            {/* 上一题/下一题按钮 */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-md ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                上一题
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`px-6 py-2 rounded-md ${
                  currentQuestionIndex === questions.length - 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                下一题
              </button>
            </div>
          </div>
        )}

        {/* 保存试卷按钮 */}
        <div className="mt-8">
          <button
            onClick={saveExam}
            className="w-full py-3 bg-green-600 text-white rounded-md text-lg font-bold hover:bg-green-700"
          >
            保存试卷
          </button>
        </div>
      </div>
    </div>
  );
}