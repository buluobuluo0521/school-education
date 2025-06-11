import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { WrongBook } from '@/lib/entities/WrongBook';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: '缺少用户名' }, { status: 400 });
  }
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const repo = AppDataSource.getRepository(WrongBook);
    const wrongs = await repo.find({ where: { username } });
    return NextResponse.json(wrongs);
  } catch (error) {
    return NextResponse.json({ error: '获取错题失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.username || !body.questionId || !body.userAnswer || !body.correctAnswer || !body.content || !body.options) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const repo = AppDataSource.getRepository(WrongBook);
    // 防止重复插入同一题
    const exist = await repo.findOne({ where: { username: body.username, questionId: body.questionId } });
    if (exist) {
      return NextResponse.json({ message: '已存在' });
    }
    const wrong = repo.create(body);
    await repo.save(wrong);
    return NextResponse.json({ message: '保存成功' });
  } catch (error) {
    return NextResponse.json({ error: '保存错题失败' }, { status: 500 });
  }
}
