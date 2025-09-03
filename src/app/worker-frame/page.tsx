'use client'

import { useEffect } from 'react'

export default function WorkerFrame() {
  useEffect(() => {
    console.log('🔧 Worker frame initializing...')
    
    // 存储当前运行的任务
    const runningTasks = new Map<string, boolean>()

    // 质数计算任务
    const handlePrimeTask = async (taskId: string, data: { max: number }) => {
      console.log(`🔢 Starting prime calculation up to ${data.max}`)
      const startTime = Date.now()
      const primes: number[] = []
      
      for (let i = 2; i <= data.max; i++) {
        if (!runningTasks.get(taskId)) break // 检查任务是否被取消
        
        let isPrime = true
        for (let j = 2; j <= Math.sqrt(i); j++) {
          if (i % j === 0) {
            isPrime = false
            break
          }
        }
        if (isPrime) primes.push(i)
        
        // 发送进度更新 - 每处理一定数量的数字后更新
        if (i % Math.max(1, Math.ceil(data.max / 100)) === 0) {
          const progress = Math.floor((i / data.max) * 100)
          window.parent.postMessage({
            type: 'TASK_PROGRESS',
            taskId,
            progress
          }, '*')
        }
      }
      
      if (runningTasks.get(taskId)) {
        const result = {
          count: primes.length,
          primes: primes.slice(0, 100), // 只返回前100个
          time: Date.now() - startTime
        }
        
        window.parent.postMessage({
          type: 'TASK_COMPLETE',
          taskId,
          result
        }, '*')
      }
    }

    // 排序任务
    const handleSortTask = async (taskId: string, data: { size: number }) => {
      console.log(`📊 Starting sort of ${data.size} elements`)
      const startTime = Date.now()
      
      // 生成随机数组
      const arr: number[] = []
      for (let i = 0; i < data.size; i++) {
        if (!runningTasks.get(taskId)) break
        arr.push(Math.floor(Math.random() * 1000000))
        
        // 生成进度占30%
        if (i % Math.max(1, Math.ceil(data.size / 50)) === 0) {
          window.parent.postMessage({
            type: 'TASK_PROGRESS',
            taskId,
            progress: Math.floor((i / data.size) * 30)
          }, '*')
        }
      }
      
      if (!runningTasks.get(taskId)) return
      
      window.parent.postMessage({
        type: 'TASK_PROGRESS',
        taskId,
        progress: 30
      }, '*')
      
      // 排序进度从30%到100%
      let sortProgress = 30
      const updateProgress = () => {
        sortProgress += Math.random() * 10
        if (sortProgress > 95) sortProgress = 95
        window.parent.postMessage({
          type: 'TASK_PROGRESS',
          taskId,
          progress: Math.floor(sortProgress)
        }, '*')
      }
      
      // 使用定时器模拟排序进度
      const progressInterval = setInterval(() => {
        if (!runningTasks.get(taskId) || sortProgress >= 95) {
          clearInterval(progressInterval)
          return
        }
        updateProgress()
      }, 100)
      
      // 实际排序
      const sortedArray = [...arr].sort((a, b) => a - b)
      clearInterval(progressInterval)
      
      if (runningTasks.get(taskId)) {
        const result = {
          length: sortedArray.length,
          sample: sortedArray.slice(0, 10), // 前10个元素作为样本
          time: Date.now() - startTime
        }
        
        window.parent.postMessage({
          type: 'TASK_COMPLETE',
          taskId,
          result
        }, '*')
      }
    }

    // 文本分析任务
    const handleTextTask = async (taskId: string, data: { text: string }) => {
      console.log(`📝 Starting text analysis`)
      const startTime = Date.now()
      const text = data.text
      
      // 模拟处理步骤
      const steps = [
        { name: '分析字符...', progress: 25 },
        { name: '统计单词...', progress: 50 },
        { name: '计算行数...', progress: 75 },
        { name: '完成分析...', progress: 100 }
      ]
      
      for (const step of steps) {
        if (!runningTasks.get(taskId)) break
        
        window.parent.postMessage({
          type: 'TASK_PROGRESS',
          taskId,
          progress: step.progress
        }, '*')
        
        // 模拟处理时间
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      if (runningTasks.get(taskId)) {
        const chars = text.length
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
        const lines = text.split('\n').length
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
        
        const result = {
          chars,
          words,
          lines,
          sentences,
          paragraphs,
          time: Date.now() - startTime
        }
        
        window.parent.postMessage({
          type: 'TASK_COMPLETE',
          taskId,
          result
        }, '*')
      }
    }

    // 斐波那契任务
    const handleFibonacciTask = async (taskId: string, data: { n: number }) => {
      console.log(`🔄 Starting fibonacci calculation for n=${data.n}`)
      const startTime = Date.now()
      const sequence: number[] = [0, 1]
      
      for (let i = 2; i <= data.n; i++) {
        if (!runningTasks.get(taskId)) break
        
        sequence[i] = sequence[i - 1] + sequence[i - 2]
        
        // 发送进度更新
        const progress = Math.floor((i / data.n) * 100)
        if (i % Math.max(1, Math.floor(data.n / 20)) === 0 || progress >= 100) {
          window.parent.postMessage({
            type: 'TASK_PROGRESS',
            taskId,
            progress
          }, '*')
        }
      }
      
      if (runningTasks.get(taskId)) {
        const result = {
          n: data.n,
          value: sequence[data.n],
          sequence: sequence.slice(0, 20), // 前20项
          time: Date.now() - startTime
        }
        
        window.parent.postMessage({
          type: 'TASK_COMPLETE',
          taskId,
          result
        }, '*')
      }
    }

    // 处理来自父窗口的消息
    const handleMessage = async (event: MessageEvent) => {
      // 只处理来自同域的消息
      if (event.origin !== window.location.origin && 
          !event.origin.includes('localhost:3000')) {
        return
      }

      // 过滤掉浏览器扩展消息
      if (event.data?.contentScriptName || event.data?.type === 'wxt:content-script-started') {
        return
      }

      console.log('🔧 Worker received message:', event.data)
      const { type, taskId, taskType, data } = event.data

      switch (type) {
        case 'INIT':
          console.log('🎯 Worker frame initialized and ready!')
          window.parent.postMessage({
            type: 'IFRAME_READY'
          }, '*')
          break

        case 'START_TASK':
          if (runningTasks.has(taskId)) {
            console.log(`⚠️ Task ${taskId} already running`)
            return
          }
          
          runningTasks.set(taskId, true)
          console.log(`🚀 Starting task ${taskId} of type ${taskType}`, data)
          
          try {
            switch (taskType) {
              case 'PRIME_TASK':
                await handlePrimeTask(taskId, data)
                break
              case 'SORT_TASK':
                await handleSortTask(taskId, data)
                break
              case 'TEXT_TASK':
                await handleTextTask(taskId, data)
                break
              case 'FIBONACCI_TASK':
                await handleFibonacciTask(taskId, data)
                break
              default:
                throw new Error(`Unknown task type: ${taskType}`)
            }
          } catch (error) {
            console.error(`💥 Task ${taskId} error:`, error)
            if (runningTasks.get(taskId)) {
              window.parent.postMessage({
                type: 'TASK_ERROR',
                taskId,
                error: error instanceof Error ? error.message : '未知错误'
              }, '*')
            }
          } finally {
            runningTasks.delete(taskId)
          }
          break

        case 'CANCEL_TASK':
          console.log(`🛑 Cancelling task ${taskId}`)
          runningTasks.set(taskId, false)
          setTimeout(() => runningTasks.delete(taskId), 100)
          break
      }
    }

    window.addEventListener('message', handleMessage)
    
    // 发送准备就绪信号
    console.log('📡 Sending ready signal to parent')
    window.parent.postMessage({
      type: 'IFRAME_READY'
    }, '*')

    return () => {
      console.log('🔧 Worker frame cleanup')
      window.removeEventListener('message', handleMessage)
      // 取消所有运行中的任务
      runningTasks.clear()
    }
  }, [])

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-green-600">🔧 Worker Frame - Ready!</h1>
      <p className="text-gray-600 mb-2">这个框架用于处理后台任务</p>
      <p className="text-sm text-green-600 mb-4">✅ 状态: 已准备好接收任务</p>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">🎯 支持的任务类型:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 🔢 质数计算 (PRIME_TASK)</li>
          <li>• 📊 数组排序 (SORT_TASK)</li>
          <li>• 📝 文本分析 (TEXT_TASK)</li>
          <li>• 🔄 斐波那契数列 (FIBONACCI_TASK)</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          📡 通信就绪 - 等待主页面发送任务...
        </p>
      </div>
    </div>
  )
}