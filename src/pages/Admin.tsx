import { useState, useEffect } from 'react'
import { BarChart3, Package, Search, Brain, Users, TrendingUp, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { api, type AdminStats, type HotSearch, type WrongBookItem, type UserActivity, type CityRule } from '@/lib/api'
import { CATEGORY_CONFIG, CITY_LABELS } from '@/lib/constants'
import { useStore } from '@/stores/useStore'
import { cn } from '@/lib/utils'

export default function AdminPage() {
  const { currentCity, setCity } = useStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [hotSearches, setHotSearches] = useState<HotSearch[]>([])
  const [quizStats, setQuizStats] = useState<WrongBookItem[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [cityRules, setCityRules] = useState<CityRule[]>([])
  const [expandedCity, setExpandedCity] = useState<string | null>('北京')

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(() => {})
    api.getHotSearches().then(setHotSearches).catch(() => {})
    api.getQuizStats().then(setQuizStats).catch(() => {})
    api.getUserActivity().then(setUserActivity).catch(() => {})
    api.getCityRules().then(setCityRules).catch(() => {})
  }, [])

  const statCards = stats ? [
    { label: '总物品数', value: stats.totalItems, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: '总搜索次数', value: stats.totalSearches, icon: Search, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: '总测验次数', value: stats.totalQuizzes, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: '总用户数', value: stats.totalUsers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ] : []

  const maxSearchCount = Math.max(...hotSearches.map((h) => h.searchCount), 1)
  const maxWrongCount = Math.max(...quizStats.map((q) => q.wrongCount), 1)
  const maxActivity = Math.max(...userActivity.map((a) => a.searches + a.quizzes + a.contributions), 1)

  const catColors: Record<string, string> = {
    recyclable: 'bg-blue-500',
    hazardous: 'bg-red-500',
    kitchen: 'bg-green-500',
    other: 'bg-gray-500',
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bg)}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value?.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.categoryDistribution && (
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">分类分布</h3>
          <div className="space-y-3">
            {stats.categoryDistribution.map((item) => {
              const maxVal = Math.max(...stats.categoryDistribution.map((d) => d.count), 1)
              const catKey = Object.keys(CATEGORY_CONFIG).find(
                (k) => CATEGORY_CONFIG[k as keyof typeof CATEGORY_CONFIG].label === item.category
              )
              return (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
                  <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-6 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', catKey ? catColors[catKey] : 'bg-blue-500')}
                      style={{ width: `${(item.count / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">{item.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-orange-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">热门搜索 TOP 20</h3>
        </div>
        <div className="space-y-2">
          {hotSearches.map((item, i) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className={cn(
                'flex h-6 w-6 items-center justify-center rounded text-xs font-bold',
                i < 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {i + 1}
              </span>
              <span className="w-24 text-sm text-gray-700 dark:text-gray-300 truncate">{item.keyword}</span>
              <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700"
                  style={{ width: `${(item.searchCount / maxSearchCount) * 100}%` }}
                />
              </div>
              <span className="w-16 text-right text-sm text-gray-500 dark:text-gray-400">{item.searchCount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">最易答错 TOP 15</h3>
        <div className="space-y-2">
          {quizStats.slice(0, 15).map((item, i) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className={cn(
                'flex h-6 w-6 items-center justify-center rounded text-xs font-bold',
                i < 3 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {i + 1}
              </span>
              <span className="w-20 text-sm text-gray-700 dark:text-gray-300">{item.trashItemName}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {item.wrongCategory} → <span className="text-green-600">{item.correctCategory}</span>
              </span>
              <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-700"
                  style={{ width: `${(item.wrongCount / maxWrongCount) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-gray-500">{item.wrongCount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">用户活跃度</h3>
        <div className="space-y-2">
          {userActivity.map((item) => {
            const total = item.searches + item.quizzes + item.contributions
            return (
              <div key={item.date} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600 dark:text-gray-400">{item.date}</span>
                <div className="flex flex-1 gap-0.5 rounded-full bg-gray-100 dark:bg-gray-700 h-5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(item.searches / maxActivity) * 100}%` }}
                    title={`搜索: ${item.searches}`}
                  />
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(item.quizzes / maxActivity) * 100}%` }}
                    title={`测验: ${item.quizzes}`}
                  />
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${(item.contributions / maxActivity) * 100}%` }}
                    title={`贡献: ${item.contributions}`}
                  />
                </div>
                <span className="w-10 text-right text-sm text-gray-500">{total}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> 搜索</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> 测验</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> 贡献</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">城市规则</h3>
        </div>
        <div className="space-y-3">
          {cityRules.map((rule) => {
            const isExpanded = expandedCity === rule.cityName
            return (
              <div key={rule.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setExpandedCity(isExpanded ? null : rule.cityName)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <span className="font-medium text-gray-900 dark:text-white">{rule.cityName}</span>
                    <div className="flex gap-1">
                      {rule.categories.map((cat) => (
                        <span key={cat} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">{cat}</span>
                      ))}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
                    <ul className="space-y-2">
                      {rule.specialRules.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
