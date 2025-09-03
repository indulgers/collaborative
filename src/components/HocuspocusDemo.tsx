'use client'

import React, { useEffect, useState } from 'react'
import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'

const HocuspocusDemo: React.FC = () => {
  const [doc] = useState(() => new Y.Doc())
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [sharedText, setSharedText] = useState('')

  useEffect(() => {
    const hocuspocusProvider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: 'demo-document',
      document: doc,
      token: 'super-secret-token', // 传递鉴权 token
    })

    hocuspocusProvider.on('connect', () => {
      setIsConnected(true)
    })

    hocuspocusProvider.on('disconnect', () => {
      setIsConnected(false)
    })

    hocuspocusProvider.on('sync', (isSynced: boolean) => {
      // 文档同步完成
      if (isSynced) {
        console.log('文档已同步')
      }
    })

    hocuspocusProvider.on('error', (error: any) => {
      // 处理错误
      console.error('协作错误:', error)
    })

    setProvider(hocuspocusProvider)

    const yText = doc.getText('shared-text')
    const updateSharedText = () => {
      setSharedText(yText.toString())
    }
    yText.observe(updateSharedText)
    updateSharedText() // 初始化

    return () => {
      yText.unobserve(updateSharedText)
      hocuspocusProvider.destroy()
    }
  }, [doc])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (provider && isConnected) {
      const yText = doc.getText('shared-text')
      yText.delete(0, yText.length)
      yText.insert(0, e.target.value)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm">
          {isConnected ? '已连接' : '未连接'}
        </span>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          共享文本编辑器
        </label>
        <textarea
          value={sharedText}
          onChange={handleTextChange}
          placeholder="在这里输入文本，它将与其他用户实时同步..."
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          disabled={!isConnected}
        />
      </div>
      
      {!isConnected && (
        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md">
          ⚠️ 需要启动 Hocuspocus 服务器才能使用协作功能。
          <br />
          运行: <code className="bg-orange-100 px-1 rounded">npx @hocuspocus/server --port 1234</code>
        </div>
      )}
    </div>
  )
}

export default HocuspocusDemo
