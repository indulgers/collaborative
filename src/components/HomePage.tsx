import React from 'react'
import HocuspocusDemo from './HocuspocusDemo'
import RouterDemo from './RouterDemo'

const HomePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎使用 Next.js + TanStack Router
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          这是一个使用 TanStack Router 和 Hocuspocus 的简化项目
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">TanStack Router 演示</h2>
          <p className="text-gray-600 mb-4">
            强大的类型安全路由器，提供出色的开发体验和性能。
          </p>
          <RouterDemo />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Hocuspocus 协作</h2>
          <p className="text-gray-600 mb-4">
            实时协作编辑功能，基于 Y.js 的强大同步引擎。
          </p>
          <HocuspocusDemo />
        </div>
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">功能特点</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="space-y-2 text-gray-700">
            <li>• 🚀 Next.js 15 + React 19</li>
            <li>• 🎯 TanStack Router 客户端路由</li>
            <li>• 🔄 Hocuspocus 实时协作</li>
            <li>• 🎨 Tailwind CSS 样式</li>
          </ul>
          <ul className="space-y-2 text-gray-700">
            <li>• ⚡ TypeScript 全面支持</li>
            <li>• 🛠️ 现代化开发工具</li>
            <li>• 📦 优化的打包配置</li>
            <li>• 🧪 Ready for production</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HomePage
