import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'
import { api, type TrashItem, type HotSearch, type Tip } from '@/lib/api'
import { useStore } from '@/stores/useStore'
import CategoryBadge from '@/components/CategoryBadge'
import ItemDetail from '@/components/ItemDetail'
import { cn } from '@/lib/utils'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TrashItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hotSearches, setHotSearches] = useState<HotSearch[]>([])
  const [dailyTip, setDailyTip] = useState<Tip | null>(null)
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { addSearchHistory, searchHistory } = useStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    api.getHotSearches().then(setHotSearches).catch(() => {})
    api.getDailyTip().then(setDailyTip).catch(() => {})
  }, [])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const data = await api.search(q)
      setResults(data.items ?? data as any)
      addSearchHistory(q.trim())
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [addSearchHistory])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  const handleHotClick = (keyword: string) => {
    setQuery(keyword)
  }

  const isEmpty = !query.trim() && results.length === 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索垃圾分类，如：电池、外卖盒、旧衣服..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-12 text-base shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {!isEmpty && query.trim() && searchHistory.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">搜索历史</span>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 8).map((k) => (
              <button
                key={k}
                onClick={() => setQuery(k)}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {isEmpty && (
        <div className="space-y-6">
          {dailyTip && (
            <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={20} />
                <span className="font-semibold">每日小贴士</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{dailyTip.title}</h3>
              <p className="text-sm text-blue-100">{dailyTip.content}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <TrendingUp size={16} className="text-orange-500" />
              <span>热门搜索</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotSearches.slice(0, 12).map((h, i) => (
                <button
                  key={h.id}
                  onClick={() => handleHotClick(h.keyword)}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                    i < 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                  )}>
                    {i + 1}
                  </span>
                  {h.keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">未找到相关物品，换个关键词试试？</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">找到 {results.length} 个结果</span>
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <CategoryBadge category={item.category} />
                    {item.isCommonMisclassification && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <AlertTriangle size={12} />
                        易错
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-gray-700 dark:text-gray-300">{item.subCategory}</span> · {item.disposalMethod}
                  </p>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <p className="text-sm"><span className="font-medium text-gray-500 dark:text-gray-400">注意事项：</span>{item.precautions}</p>
                  {item.correctExplanation && (
                    <p className="text-sm text-amber-700 dark:text-amber-400"><span className="font-medium">正确解释：</span>{item.correctExplanation}</p>
                  )}
                  {item.synonyms.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">又称：</span>
                      {item.synonyms.map((s, i) => (
                        <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedItem && <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}
