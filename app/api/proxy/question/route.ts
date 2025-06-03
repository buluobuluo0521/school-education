
import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { Question } from '@/lib/entities/Question';

export async function GET(request: NextRequest) {
    try {
        await AppDataSource.initialize();
        const examRepository = AppDataSource.getRepository(Question);
        const question = await examRepository.find();
        
        return NextResponse.json(question);
    } catch (error) {
        console.error("获取考试数据失败:", error);
        return NextResponse.json(
            { error: '获取考试数据失败' },
            { status: 500 }
        );
    }
}
