'use client'

import { useCallback, useState } from 'react'

// 简单的客户端路由hook
export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState('/')

  const push = useCallback((path: string) => {
    setCurrentPath(path)
    // 在实际应用中，这里可以集成 TanStack Router
    console.log(`Navigating to: ${path}`)
  }, [])

  const back = useCallback(() => {
    // 简单的返回逻辑
    console.log('Going back')
  }, [])

  return {
    currentPath,
    push,
    back,
  }
}
