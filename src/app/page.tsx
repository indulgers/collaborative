'use client'

import { useState, useEffect, useRef } from 'react'
import TaskManager from '@components/TaskManger'
import StatsPanel from '@components/StatsPanel'

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    running: 0,
    avgTime: 0
  })
  
  const [iframeReady, setIframeReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // 监听来自iframe的消息
    const handleMessage = (event: MessageEvent) => {
      // 修复origin检查 - 允许来自同一域的iframe
      if (event.origin !== window.location.origin && 
          !event.origin.includes('localhost:3000')) {
        console.log('Blocked message from:', event.origin)
        return
      }

      // 过滤掉浏览器扩展消息
      if (event.data?.contentScriptName || event.data?.type === 'wxt:content-script-started') {
        return
      }

      console.log('✅ Received message from iframe:', event.data)
      
      const { type, taskId, progress, result, error } = event.data

      switch (type) {
        case 'IFRAME_READY':
          console.log('🎯 iframe is ready!')
          setIframeReady(true)
          break
          
        case 'TASK_PROGRESS':
          console.log(`📊 Task ${taskId} progress: ${progress}%`)
          // 更新任务进度
          updateTaskProgress(taskId, progress)
          break
          
        case 'TASK_COMPLETE':
          console.log(`✅ Task ${taskId} completed:`, result)
          // 更新任务完成状态
          updateTaskComplete(taskId, result)
          break
          
        case 'TASK_ERROR':
          console.log(`❌ Task ${taskId} error:`, error)
          updateTaskError(taskId, error)
          break
          
        default:
          console.log('🤔 Unknown message type:', type)
      }
    }

    // 处理iframe加载
    const handleIframeLoad = () => {
      console.log('📡 iframe loaded, sending init signal...')
      // 发送初始化消息
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'INIT'
        }, '*')
      }, 100)
    }

    const updateTaskProgress = (taskId: string, progress: number) => {
      // 通知TaskManager更新进度
      window.dispatchEvent(new CustomEvent('taskProgress', {
        detail: { taskId, progress }
      }))
    }

    const updateTaskComplete = (taskId: string, result: any) => {
      // 更新统计
      setStats(prev => ({
        ...prev,
        completed: prev.completed + 1,
        running: Math.max(0, prev.running - 1)
      }))

      window.dispatchEvent(new CustomEvent('taskComplete', {
        detail: { taskId, result }
      }))
    }

    const updateTaskError = (taskId: string, error: string) => {
      setStats(prev => ({
        ...prev,
        running: Math.max(0, prev.running - 1)
      }))

      window.dispatchEvent(new CustomEvent('taskError', {
        detail: { taskId, error }
      }))
    }

    // 添加事件监听器
    window.addEventListener('message', handleMessage)
    
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad)
      }
    }
  }, [])

  const handleTaskStart = (taskId: string, type: string, data: any) => {
    if (!iframeReady) {
      console.warn('⚠️ iframe not ready yet!')
      alert('iframe还未准备好，请稍候再试')
      return false
    }

    console.log(`🚀 Starting task ${taskId} of type ${type}`, data)
    
    // 发送任务到iframe
    iframeRef.current?.contentWindow?.postMessage({
      type: 'START_TASK',
      taskId,
      taskType: type,
      data
    }, '*')

    // 更新统计
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      running: prev.running + 1
    }))

    return true
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🚀 iframe后台任务处理器
            </h1>
            <div className={`w-3 h-3 rounded-full ${iframeReady ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className={`text-sm ${iframeReady ? 'text-green-600' : 'text-red-600'}`}>
              {iframeReady ? '已就绪' : '加载中...'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-8">
            使用iframe隔离执行计算密集型任务，保持主线程流畅
          </p>
          
          <TaskManager 
            iframeReady={iframeReady}
            onTaskStart={handleTaskStart}
          />
          <StatsPanel stats={stats} />
        </div>
      </div>
      
      {/* iframe工作环境 */}
      <iframe 
        ref={iframeRef}
        src="/worker-frame"
        className="hidden"
        sandbox="allow-scripts allow-same-origin allow-modals"
        title="Background Task Worker"
      />
    </main>
  )
}