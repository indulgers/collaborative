import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import * as constants from '../constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: constants.APP_NAME,
  description: '一个使用 TanStack Router 和 Hocuspocus 的现代 Next.js 应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
