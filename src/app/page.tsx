import { Metadata } from 'next'
import HomePage from '../components/HomePage'
import * as constants from '../constants'

export const metadata: Metadata = {
  title: `首页 | ${constants.APP_NAME}`,
  description: '一个使用 TanStack Router 和 Hocuspocus 的 Next.js 应用',
}

export default function Page() {
  return <HomePage />
}
