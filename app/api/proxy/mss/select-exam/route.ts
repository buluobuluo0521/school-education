import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // 确保数据库连接初始化
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // 获取查询参数（分页等）
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const searchQuery = searchParams.get('q') || '';
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // 构建SQL查询
    let query = 'SELECT * FROM exam_management';
    const params = [];
    
    // 添加搜索条件
    if (searchQuery) {
      query += ' WHERE exam_name LIKE ?';
      params.push(`%${searchQuery}%`);
    }
    
    // 添加分页
    query += ' ORDER BY creation_time DESC';
    query += ` LIMIT ${(pageNum - 1) * limitNum}, ${limitNum}`;
    
    // 执行查询
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      const exams = await queryRunner.query(query, params);
      
      // 获取总数
      const countQuery = searchQuery 
        ? 'SELECT COUNT(*) as count FROM exam_management WHERE exam_name LIKE ?'
        : 'SELECT COUNT(*) as count FROM exam_management';
        
      const countResult = await queryRunner.query(
        countQuery, 
        searchQuery ? [`%${searchQuery}%`] : []
      );
      
      const totalCount = countResult[0].count;
      const totalPages = Math.ceil(totalCount / limitNum);
      
      return NextResponse.json({
        success: true,
        exams,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages
        }
      }, { status: 200 });
      
    } finally {
      await queryRunner.release();
    }
    
  } catch (error:any) {
    console.error('获取试卷列表失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器内部错误',
        details: error.message 
      },
      { status: 500 }
    );
  }
}