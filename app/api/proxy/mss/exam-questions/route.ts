// app/api/proxy/exam-questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { management_id, questions } = await request.json();
    
    // 验证输入
    if (!management_id || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: '缺少参数或题目列表无效' },
        { status: 400 }
      );
    }
    
    // 检查题目列表是否为空
    if (questions.length === 0) {
      return NextResponse.json(
        { error: '题目列表不能为空' },
        { status: 400 }
      );
    }
    
    // 验证每个题目对象的字段
    for (const q of questions) {
      if (!q.question_number || !q.question || !q.score || !q.question_type || !q.answer) {
        return NextResponse.json(
          { error: '每个题目必须包含题号、内容、分值、题型和答案' },
          { status: 400 }
        );
      }
    }
    
    // 确保数据库已连接
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // 获取数据库连接
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      // 开始事务
      await queryRunner.startTransaction();
      
      // 构建批量插入的SQL
      const placeholders = questions.map(() => `(?, ?, ?, ?, ?, ?)`).join(',');
      const values = questions.flatMap(q => [
        management_id,
        q.question_number,
        q.question, 
        q.score,
        q.question_type,
        q.answer
      ]);
      // 执行批量插入
      const insertResult = await queryRunner.query(
        `INSERT INTO exams (management_id, question_number, question, score, question_type, answer) 
         VALUES ${placeholders}`,
        values
      );
      
      // 提交事务
      await queryRunner.commitTransaction();
      
      return NextResponse.json({
        success: true,
        insertedId: insertResult.insertId 
      }, { status: 200 });
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('保存题目失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}