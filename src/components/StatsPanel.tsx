interface StatsPanelProps {
  stats: {
    total: number
    completed: number
    running: number
    avgTime: number
  }
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 任务统计</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">总任务</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">已完成</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{stats.running}</div>
          <div className="text-sm text-gray-600">运行中</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{stats.avgTime}ms</div>
          <div className="text-sm text-gray-600">平均时间</div>
        </div>
      </div>
    </div>
  )
}