// app/api/proxy/exam-management/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { examName, examType } = await request.json();
    
    // 验证输入数据
    if (!examName || !examType) {
      return NextResponse.json(
        { error: '试卷名称和类型不能为空' },
        { status: 400 }
      );
    }
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // 获取数据库连接
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect(); // 确保连接
    
    try {
      // 执行插入查询
      await queryRunner.query(
        `INSERT INTO exam_management (exam_name, exam_type, creation_time) 
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [examName, examType]
      );
      
      // 查询最后插入的ID
      const result = await queryRunner.query(
        "SELECT LAST_INSERT_ID() as management_id"
      );
      
      const managementId = result[0].management_id;
      
      return NextResponse.json({
        success: true,
        managementId
      }, { status: 200 });
      
    } finally {
      // 释放连接
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error('创建试卷时数据库错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}