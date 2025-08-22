import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 简化的中间件，移除认证逻辑
export function middleware(request: NextRequest) {
  // 这里可以添加你需要的中间件逻辑
  // 例如：日志记录、重定向等
  
  const response = NextResponse.next()
  
  // 添加一些基本的安全头
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  return response
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
