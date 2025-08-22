// 基础类型定义
export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
}

// Hocuspocus 相关类型
export interface HocuspocusConfig {
  url: string
  name: string
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 路由类型
export interface Route {
  title: string
  path: string
  component: React.ComponentType
}
