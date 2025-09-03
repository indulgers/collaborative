'use client'

import { useState, useEffect } from 'react'

interface TaskCardProps {
  title: string
  description: string
  taskType: string
  taskStatus?: any
  disabled?: boolean
  onStart: (data: any) => void
  onCancel: () => void
}

export default function TaskCard({ 
  title, 
  description, 
  taskType, 
  taskStatus, 
  disabled = false,
  onStart, 
  onCancel 
}: TaskCardProps) {
  const [inputValue, setInputValue] = useState('')

  // 设置默认值
  useEffect(() => {
    if (!inputValue) {
      setInputValue(getDefaultValue())
    }
  }, [taskType])

  const handleStart = () => {
    if (disabled || !inputValue.trim()) {
      console.warn('Cannot start task - disabled or empty input')
      return
    }
    
    console.log(`🎯 Starting ${taskType} task with input: ${inputValue}`)
    
    let data: any
    switch (taskType) {
      case 'prime':
        data = { max: parseInt(inputValue) || 1000 }
        break
      case 'sort':
        data = { size: parseInt(inputValue) || 10000 }
        break
      case 'text':
        data = { text: inputValue }
        break
      case 'fibonacci':
        data = { n: parseInt(inputValue) || 10 }
        break
      default:
        data = { value: inputValue }
    }
    
    console.log(`📤 Sending task data:`, data)
    onStart(data)
  }

  const getPlaceholder = () => {
    switch (taskType) {
      case 'prime':
        return '输入最大数值 (如: 10000)'
      case 'sort':
        return '输入数组大小 (如: 100000)'
      case 'text':
        return '输入要分析的文本'
      case 'fibonacci':
        return '输入数列项数 (如: 40)'
      default:
        return '输入参数'
    }
  }

  const getDefaultValue = () => {
    switch (taskType) {
      case 'prime':
        return '10000'
      case 'sort':
        return '100000'
      case 'text':
        return '这是一个使用iframe处理后台任务的示例项目，可以分析文本的各种统计信息。'
      case 'fibonacci':
        return '40'
      default:
        return ''
    }
  }

  const formatResult = (result: any) => {
    if (!result) return null

    switch (taskType) {
      case 'prime':
        return (
          <div>
            <p><strong>找到质数:</strong> {result.count} 个</p>
            <p><strong>计算时间:</strong> {result.time}ms</p>
            {result.primes?.length > 0 && (
              <p><strong>前10个:</strong> {result.primes.slice(0, 10).join(', ')}...</p>
            )}
          </div>
        )
      case 'sort':
        return (
          <div>
            <p><strong>排序完成:</strong> {result.length} 个元素</p>
            <p><strong>计算时间:</strong> {result.time}ms</p>
            {result.sample && (
              <p><strong>前10个:</strong> [{result.sample.join(', ')}...]</p>
            )}
          </div>
        )
      case 'text':
        return (
          <div>
            <p><strong>字符数:</strong> {result.chars}</p>
            <p><strong>单词数:</strong> {result.words}</p>
            <p><strong>行数:</strong> {result.lines}</p>
            {result.sentences && <p><strong>句子数:</strong> {result.sentences}</p>}
            {result.paragraphs && <p><strong>段落数:</strong> {result.paragraphs}</p>}
            <p><strong>计算时间:</strong> {result.time}ms</p>
          </div>
        )
      case 'fibonacci':
        return (
          <div>
            <p><strong>第{result.n}项:</strong> {result.value}</p>
            <p><strong>计算时间:</strong> {result.time}ms</p>
            {result.sequence && (
              <p><strong>前20项:</strong> [{result.sequence.join(', ')}...]</p>
            )}
          </div>
        )
      default:
        return <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
    }
  }

  const isRunning = taskStatus?.status === 'running'
  const isCompleted = taskStatus?.status === 'completed'
  const hasError = taskStatus?.status === 'error'
  const isCancelled = taskStatus?.status === 'cancelled'
  const progress = taskStatus?.progress || 0

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border transition-all duration-300 ${
      disabled ? 'opacity-60' : 'hover:shadow-xl hover:-translate-y-1'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          isRunning ? 'bg-blue-400 animate-pulse' : 
          isCompleted ? 'bg-green-400' :
          hasError ? 'bg-red-400' :
          isCancelled ? 'bg-yellow-400' :
          'bg-gray-300'
        }`} title={
          isRunning ? '运行中' : 
          isCompleted ? '已完成' :
          hasError ? '错误' :
          isCancelled ? '已取消' :
          '待机'
        }></div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getPlaceholder()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={disabled || isRunning}
          />
          <button
            onClick={handleStart}
            disabled={disabled || isRunning || !inputValue.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all duration-200 min-w-[80px]"
          >
            {isRunning ? '处理中...' : '开始'}
          </button>
          {isRunning && (
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              取消
            </button>
          )}
        </div>

        {/* 进度条 */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>处理进度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
          </div>
        )}

        {/* 结果显示 */}
        {isCompleted && taskStatus.result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-800 font-medium">✅ 任务完成</span>
            </div>
            <div className="text-green-700 text-sm">
              {formatResult(taskStatus.result)}
            </div>
          </div>
        )}

        {/* 错误显示 */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-red-800 font-medium">❌ 任务失败</span>
            </div>
            <div className="text-red-700 text-sm">
              {taskStatus.error || '未知错误'}
            </div>
          </div>
        )}

        {/* 取消状态 */}
        {isCancelled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-800 font-medium">⏹️ 任务已取消</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}