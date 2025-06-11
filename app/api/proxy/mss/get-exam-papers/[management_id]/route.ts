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
      const exam = await queryRunner.query(
        `SELECT * FROM exam_management WHERE management_id = ?`,
        [management_id]
      );
      
      if (!exam || exam.length === 0) {
        return NextResponse.json(
          { error: '试卷不存在' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        exam: exam[0]
      }, { status: 200 });
      
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('获取试卷失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

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
    
    const { exam_name, exam_type } = await request.json();
    
    // 验证输入
    if (!exam_name || !exam_type) {
      return NextResponse.json(
        { error: '试卷名称和类型不能为空' },
        { status: 400 }
      );
    }
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      // 执行更新
      await queryRunner.query(
        `UPDATE exam_management 
         SET exam_name = ?, exam_type = ?
         WHERE management_id = ?`,
        [exam_name, exam_type, management_id]
      );
      
      return NextResponse.json({
        success: true,
        message: '试卷信息更新成功'
      }, { status: 200 });
      
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('更新试卷失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}