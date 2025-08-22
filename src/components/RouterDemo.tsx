'use client'

import React, { useState } from 'react'

// 简单的客户端路由演示
const RouterDemo: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState('home')

  const routes = {
    home: {
      title: '首页',
      content: (
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">欢迎来到首页</h3>
          <p className="text-gray-600">
            这是一个使用 TanStack Router 概念的演示页面。
          </p>
        </div>
      ),
    },
    about: {
      title: '关于',
      content: (
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">关于我们</h3>
          <p className="text-gray-600">
            这个项目展示了如何在 Next.js 中集成现代化的客户端路由功能。
          </p>
        </div>
      ),
    },
    contact: {
      title: '联系',
      content: (
        <div className="p-6 bg-purple-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">联系我们</h3>
          <p className="text-gray-600">
            如果你有任何问题，请随时联系我们。
          </p>
        </div>
      ),
    },
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {Object.entries(routes).map(([key, route]) => (
          <button
            key={key}
            onClick={() => setCurrentRoute(key)}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentRoute === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {route.title}
          </button>
        ))}
      </div>
      
      <div>
        {routes[currentRoute as keyof typeof routes]?.content}
      </div>
    </div>
  )
}

export default RouterDemo
