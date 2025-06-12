// app/api/proxy/exam-management/[management_id]/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { management_id: string } }
) {
  try {
    const management_id = parseInt(params.management_id);
    
    if (!management_id || isNaN(management_id)) {
      return NextResponse.json(
        { error: '无效的试卷ID' },
        { status: 400 }
      );
    }
    
    const { questions } = await request.json();
    
    // 验证题目列表
    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: '题目列表无效' },
        { status: 400 }
      );
    }
    
    // 验证每个题目的必填字段
    for (const q of questions) {
      if (!q.question_number || !q.content || !q.answer || q.score === undefined) {
        return NextResponse.json(
          { error: '题目信息不完整' },
          { status: 400 }
        );
      }
    }
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      await queryRunner.startTransaction();
      
      // 1. 删除现有题目
      await queryRunner.query(
        `DELETE FROM exams WHERE management_id = ?`,
        [management_id]
      );
      
      // 2. 插入新的题目列表（更新后的列表）
      if (questions.length > 0) {
        const placeholders = questions.map(() => 
          `(?, ?, ?, ?, ?, ?)`
        ).join(',');
        
        const values = questions.flatMap(q => [
          management_id,
          q.question_number,
          q.content,
          q.score,
          q.question_type,
          q.answer
        ]);
        
        await queryRunner.query(
          `INSERT INTO exams (management_id, question_number, question, score, question_type, answer)
           VALUES ${placeholders}`,
          values
        );
      }
      
      await queryRunner.commitTransaction();
      
      return NextResponse.json({
        success: true,
        message: '题目更新成功',
        insertedCount: questions.length
      }, { status: 200 });
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('更新题目失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}