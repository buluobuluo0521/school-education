'use client'

import { useState } from 'react'
import axios from 'axios'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const LLMChat = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)
        try {
            const { data } = await axios.post('/api/proxy/llm', {
                messages: [...messages, userMessage],
                model: 'local-model',
                temperature: 0.7,
                max_tokens: 1000
            })
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.choices[0].message.content
            }])
        } catch (error) {
            console.error('聊天请求错误:', error)
            alert('发送消息失败，请稍后重试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl h-[700px]">
            <div className="card-body h-full flex flex-col p-6">
                {/* 聊天历史 */}
                <div className="flex-1 overflow-auto mb-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat ${
                                message.role === 'user' ? 'chat-end' : 'chat-start'
                            }`}
                        >
                            <div className={`chat-bubble ${
                                message.role === 'user' 
                                    ? 'chat-bubble-primary' 
                                    : 'chat-bubble-secondary'
                            }`}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="chat chat-start">
                            <div className="chat-bubble chat-bubble-secondary opacity-70">
                                AI正在思考中...
                            </div>
                        </div>
                    )}
                </div>

                {/* 输入框 */}
                <form onSubmit={handleSubmit} className="join w-full">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="输入你的问题..."
                        className="input input-bordered join-item w-full"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary join-item"
                    >
                        发送
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LLMChat