import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';

export async function GET(
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
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      const questions = await queryRunner.query(
        `SELECT * FROM exams WHERE management_id = ?`,
        [management_id]
      );
      
      return NextResponse.json({
        success: true,
        questions
      }, { status: 200 });
      
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('获取题目失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { management_id: string; question_id: string } }
) {
  try {
    const management_id = parseInt(params.management_id);
    const question_id = parseInt(params.question_id);
    
    if (!management_id || isNaN(management_id) || !question_id || isNaN(question_id)) {
      return NextResponse.json(
        { error: '无效的题目ID' },
        { status: 400 }
      );
    }
    
    const { question_number, question_type, question, answer, score } = await request.json();
    
    // 验证题目数据
    if (!question_number || !question_type || !question || !answer || score === undefined) {
      return NextResponse.json(
        { error: '题目信息不完整' },
        { status: 400 }
      );
    }
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      // 更新题目
      await queryRunner.query(
        `UPDATE exams 
         SET 
            question_number = ?,
            question_type = ?,
            question = ?,
            answer = ?,
            score = ?
         WHERE question_id = ? AND management_id = ?`,
        [question_number, question_type, question, answer, score, question_id, management_id]
      );
      
      return NextResponse.json({
        success: true,
        message: '题目更新成功'
      }, { status: 200 });
      
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