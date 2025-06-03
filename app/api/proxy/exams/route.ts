// pages/api/exams/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { Exam } from '@/lib/entities/Exam';

export async function GET(request: NextRequest) {
    try {
        await AppDataSource.initialize();
        const examRepository = AppDataSource.getRepository(Exam);
        const exams = await examRepository.find();
        
        return NextResponse.json(exams);
    } catch (error) {
        console.error("获取考试数据失败:", error);
        return NextResponse.json(
            { error: '获取考试数据失败' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const examData = await request.json();
        await AppDataSource.initialize();
        const examRepository = AppDataSource.getRepository(Exam);
        
        const newExam = examRepository.create({
            ...examData,
            startTime: examData.startTime ? new Date(examData.startTime) : null,
            endTime: examData.endTime ? new Date(examData.endTime) : null
        });
        
        await examRepository.save(newExam);
        
        return NextResponse.json({ message: '考试创建成功', exam: newExam });
    } catch (error) {
        console.error("创建考试失败:", error);
        return NextResponse.json(
            { error: '创建考试失败' },
            { status: 500 }
        );
    }
}