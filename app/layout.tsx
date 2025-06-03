import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import '@/app/Index/css/app.css'  

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '考试系统',
  description: '基于Next.js的现代化前后端分离开发平台',
}