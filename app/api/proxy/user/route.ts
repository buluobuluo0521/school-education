import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { User } from '@/lib/entities/User';

export async function GET() {
    try {
        await AppDataSource.initialize();
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: '获取用户列表失败' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const userData = await request.json();
        await AppDataSource.initialize();
        const userRepository = AppDataSource.getRepository(User);
        
        const user = new User();
        user.username = userData.username;
        user.email = userData.email;
        user.password = userData.password;
        
        await userRepository.save(user);
        
        return NextResponse.json({ message: '用户创建成功', user });
    } catch (error) {
        return NextResponse.json(
            { error: '创建用户失败' },
            { status: 500 }
        );
    }
}