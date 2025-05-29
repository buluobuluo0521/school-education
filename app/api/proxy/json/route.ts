import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// 定义JSON文件的存储路径
const DATA_FILE_PATH = 'd:/stored.json'

// 确保数据目录存在
async function ensureDirectory() {
    const dir = path.dirname(DATA_FILE_PATH)
    try {
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir, { recursive: true })
    }
}

// GET请求处理程序
export const GET = async () => {
    try {
        await ensureDirectory()

        try {
            const data = await fs.readFile(DATA_FILE_PATH, 'utf-8')
            return NextResponse.json(JSON.parse(data))
        } catch (error) {
            // 如果文件不存在，返回空对象
            return NextResponse.json({})
        }
    } catch (error) {
        return NextResponse.json(
            { error: '读取数据失败' },
            { status: 500 }
        )
    }
}

// POST请求处理程序
export const POST = async (request: NextRequest) => {
    try {
        await ensureDirectory()

        const data = await request.json()
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2))

        return NextResponse.json({ message: '数据保存成功' })
    } catch (error) {
        return NextResponse.json(
            { error: '保存数据失败' },
            { status: 500 }
        )
    }
}

