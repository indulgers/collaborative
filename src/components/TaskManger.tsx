'use client'

import { useState, useEffect } from 'react'
import TaskCard from './TaskCard'

interface TaskManagerProps {
  iframeReady: boolean
  onTaskStart: (taskId: string, type: string, data: any) => boolean
}

export default function TaskManager({ iframeReady, onTaskStart }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Map<string, any>>(new Map())

  useEffect(() => {
    // 监听任务更新事件
    const handleTaskProgress = (event: CustomEvent) => {
      const { taskId, progress } = event.detail
      console.log(`📈 Task ${taskId} progress: ${progress}%`)
      setTasks(prev => {
        const newTasks = new Map(prev)
        const task = newTasks.get(taskId)
        if (task) {
          task.progress = progress
          newTasks.set(taskId, task)
        }
        return newTasks
      })
    }

    const handleTaskComplete = (event: CustomEvent) => {
      const { taskId, result } = event.detail
      console.log(`🎉 Task ${taskId} completed!`, result)
      setTasks(prev => {
        const newTasks = new Map(prev)
        const task = newTasks.get(taskId)
        if (task) {
          task.status = 'completed'
          task.progress = 100
          task.result = result
          task.endTime = Date.now()
          newTasks.set(taskId, task)
        }
        return newTasks
      })
    }

    const handleTaskError = (event: CustomEvent) => {
      const { taskId, error } = event.detail
      console.log(`💥 Task ${taskId} failed:`, error)
      setTasks(prev => {
        const newTasks = new Map(prev)
        const task = newTasks.get(taskId)
        if (task) {
          task.status = 'error'
          task.error = error
          newTasks.set(taskId, task)
        }
        return newTasks
      })
    }

    window.addEventListener('taskProgress', handleTaskProgress as EventListener)
    window.addEventListener('taskComplete', handleTaskComplete as EventListener)
    window.addEventListener('taskError', handleTaskError as EventListener)

    return () => {
      window.removeEventListener('taskProgress', handleTaskProgress as EventListener)
      window.removeEventListener('taskComplete', handleTaskComplete as EventListener)
      window.removeEventListener('taskError', handleTaskError as EventListener)
    }
  }, [])

  const startTask = (taskId: string, type: string, data: any) => {
    console.log(`🎬 Attempting to start task: ${taskId}`)
    
    if (!iframeReady) {
      console.warn('⚠️ Cannot start task - iframe not ready')
      alert('iframe还未准备好，请稍候再试')
      return
    }

    // 检查是否已有同名任务在运行
    const existingTask = tasks.get(taskId)
    if (existingTask?.status === 'running') {
      console.warn(`⚠️ Task ${taskId} is already running`)
      alert(`任务 ${taskId} 正在运行中`)
      return
    }
    
    const newTask = {
      id: taskId,
      type,
      status: 'running',
      progress: 0,
      startTime: Date.now()
    }
    
    console.log(`✨ Creating new task:`, newTask)
    setTasks(prev => new Map(prev).set(taskId, newTask))
    
    // 调用父组件方法发送任务
    const success = onTaskStart(taskId, type, data)
    if (!success) {
      console.error(`❌ Failed to start task ${taskId}`)
      setTasks(prev => {
        const newTasks = new Map(prev)
        newTasks.delete(taskId)
        return newTasks
      })
    } else {
      console.log(`🚀 Task ${taskId} started successfully`)
    }
  }

  const cancelTask = (taskId: string) => {
    console.log(`🛑 Cancelling task: ${taskId}`)
    setTasks(prev => {
      const newTasks = new Map(prev)
      const task = newTasks.get(taskId)
      if (task) {
        task.status = 'cancelled'
        newTasks.set(taskId, task)
      }
      return newTasks
    })
  }

  const getTaskStatus = (taskId: string) => {
    return tasks.get(taskId)
  }

  return (
    <div className="space-y-6">
      <TaskCard
        title="🔢 质数计算器"
        description="计算指定范围内的所有质数"
        taskType="prime"
        taskStatus={getTaskStatus('prime')}
        disabled={!iframeReady}
        onStart={(data) => startTask('prime', 'PRIME_TASK', data)}
        onCancel={() => cancelTask('prime')}
      />
      
      <TaskCard
        title="📊 大数据排序"
        description="生成大型随机数组并进行排序"
        taskType="sort"
        taskStatus={getTaskStatus('sort')}
        disabled={!iframeReady}
        onStart={(data) => startTask('sort', 'SORT_TASK', data)}
        onCancel={() => cancelTask('sort')}
      />
      
      <TaskCard
        title="📝 文本分析器"
        description="分析文本内容，统计各种指标"
        taskType="text"
        taskStatus={getTaskStatus('text')}
        disabled={!iframeReady}
        onStart={(data) => startTask('text', 'TEXT_TASK', data)}
        onCancel={() => cancelTask('text')}
      />
      
      <TaskCard
        title="🔄 斐波那契数列"
        description="计算斐波那契数列的第N项"
        taskType="fibonacci"
        taskStatus={getTaskStatus('fibonacci')}
        disabled={!iframeReady}
        onStart={(data) => startTask('fibonacci', 'FIBONACCI_TASK', data)}
        onCancel={() => cancelTask('fibonacci')}
      />
    </div>
  )
}