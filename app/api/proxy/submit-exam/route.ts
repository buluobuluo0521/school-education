
import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database'; // 假设lib/database.ts导出了TypeORM数据源
import { ExamRecord } from '@/lib/entities/ExamRecord';
interface RequestBody {
    examId: string;
    username: string;
    totalScore: number;
    correctCount: number;
  }

export async function GET(request: NextRequest) {
  try {
      if  (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
      }
      const examRepository = AppDataSource.getRepository(ExamRecord);
      const exams = await examRepository.find();
      
      return NextResponse.json(exams);
  } catch (error) {
      console.error("获取考试记录失败:", error);
      return NextResponse.json(
          { error: '获取考试记录失败' },
          { status: 500 }
      );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 获取查询参数中的id
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: '缺少考试记录ID' },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const examRepository = AppDataSource.getRepository(ExamRecord);
    const result = await examRepository.delete(Number(id));

    if (result.affected === 0) {
      return NextResponse.json(
        { error: '未找到该考试记录' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '考试记录删除成功' });
  } catch (error) {
    console.error('删除考试记录失败:', error);
    return NextResponse.json(
      { error: '删除考试记录失败' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
    const body: RequestBody = await request.json();
  
    // 参数校验
    if (!body.examId || !body.username || body.totalScore === undefined || body.correctCount === undefined) {
      return NextResponse.json({ code: 400, message: '缺少必要参数' }, { status: 400 });
    }
  
    try {
      // 使用TypeORM插入记录
      const examRecord = new ExamRecord();
      examRecord.examId = body.examId;
      examRecord.username = body.username;
      examRecord.totalScore = body.totalScore;
      examRecord.correctCount = body.correctCount;
  
      await AppDataSource.manager.save(examRecord);
  
      return NextResponse.json({ code: 200, message: '记录保存成功', data: { recordId: examRecord.id } });
    } catch (error) {
      console.error('保存考试记录失败:', error);
      return NextResponse.json({ code: 500, message: '服务器内部错误' }, { status: 500 });
    }
  }