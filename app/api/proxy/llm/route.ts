import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// LM Studio默认的API地址
const LM_STUDIO_API_URL = 'http://localhost:1234/v1/chat/completions'

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json()
        
        // 构建发送给LM Studio的请求
        const response = await axios.post(LM_STUDIO_API_URL, {
            messages: requestData.messages || [],
            model: requestData.model || "local-model", // LM Studio本地模型
            temperature: requestData.temperature || 0.7,
            max_tokens: requestData.max_tokens || 1000,
            stream: false
        })

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('LLM API Error:', error)
        return NextResponse.json(
            { 
                error: '与LLM服务通信失败',
                details: error.message 
            },
            { status: 500 }
        )
    }
}


