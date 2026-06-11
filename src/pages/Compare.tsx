import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Share2, ArrowLeft, CheckCircle, XCircle, AlertTriangle, Copy, Check, Trash2 } from 'lucide-react'
import { api, type TrashItem } from '@/lib/api'
import { useStore } from '@/stores/useStore'
import CategoryBadge from '@/components/CategoryBadge'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function ComparePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { compareItems, setCompareItems, removeFromCompare, clearCompare } = useStore()
  const [items, setItems] = useState<TrashItem[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const loadItems = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return
    setLoading(true)
    try {
      const data = await api.getItemsByIds(ids)
      setItems(Array.isArray(data) ? data : (data as any).data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const idsParam = searchParams.get('ids')
    if (idsParam) {
      const ids = idsParam.split(',')
      loadItems(ids)
    } else if (compareItems.length > 0) {
      const ids = compareItems.map((item) => item.id)
      setSearchParams({ ids: ids.join(',') }, { replace: true })
      loadItems(ids)
    } else {
      navigate('/search')
    }
  }, [searchParams, compareItems, setSearchParams, loadItems, navigate])

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('复制链接失败，请手动复制')
    }
  }, [])

  const handleRemove = useCallback((id: string) => {
    removeFromCompare(id)
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)
    if (newItems.length > 0) {
      const ids = newItems.map((item) => item.id)
      setSearchParams({ ids: ids.join(',') }, { replace: true })
    } else {
      navigate('/search')
    }
  }, [items, removeFromCompare, setSearchParams, navigate])

  const isAllSameCategory = items.length > 0 && items.every((item) => item.category === items[0].category)

  const compareFields = [
    { key: 'categoryName', label: '分类' },
    { key: 'subCategory', label: '子分类' },
    { key: 'disposalMethod', label: '处理方式' },
    { key: 'precautions', label: '注意事项' },
    { key: 'isCommonMisclassification', label: '是否易错' },
    { key: 'synonyms', label: '同义词' },
  ]

  const isFieldSame = (key: string) => {
    if (items.length < 2) return true
    const firstValue = items[0][key as keyof TrashItem]
    return items.every((item) => {
      const value = item[key as keyof TrashItem]
      if (Array.isArray(firstValue) && Array.isArray(value)) {
        return JSON.stringify(firstValue.sort()) === JSON.stringify(value.sort())
      }
      return firstValue === value
    })
  }

  const renderValue = (item: TrashItem, key: string) => {
    const value = item[key as keyof TrashItem]
    if (key === 'categoryName') {
      return <CategoryBadge category={item.category} showLabel />
    }
    if (key === 'isCommonMisclassification') {
      return value ? (
        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={16} />
          是
        </span>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">否</span>
      )
    }
    if (key === 'synonyms' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.length > 0 ? value.map((s, i) => (
            <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {s}
            </span>
          )) : <span className="text-gray-400">-</span>}
        </div>
      )
    }
    return <span>{value as string || '-'}</span>
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          返回搜索
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? '已复制' : '分享对比'}
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">物品对比</h2>
        <p className="text-gray-500 dark:text-gray-400">
          共 {items.length} 个物品 · {isAllSameCategory ? '全部属于同一分类' : '包含不同分类'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">没有可对比的物品</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-gray-800">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="sticky left-0 z-10 bg-gray-50 p-4 text-left text-sm font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-400 w-32">
                  属性
                </th>
                {items.map((item) => (
                  <th key={item.id} className="p-4 text-left min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {compareFields.map((field) => {
                const same = isFieldSame(field.key)
                return (
                  <tr key={field.key}>
                    <td className="sticky left-0 z-10 bg-gray-50 p-4 text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      {field.label}
                    </td>
                    {items.map((item) => (
                      <td
                        key={item.id}
                        className={cn(
                          'p-4 transition-colors',
                          same
                            ? 'bg-green-50/50 dark:bg-green-900/10'
                            : 'bg-red-50/50 dark:bg-red-900/10'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {same && items.length > 1 && (
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          )}
                          {!same && items.length > 1 && (
                            <XCircle size={16} className="text-red-500 flex-shrink-0" />
                          )}
                          {renderValue(item, field.key)}
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/30" />
            <span className="text-sm text-gray-600 dark:text-gray-300">相同</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-100 dark:bg-red-900/30" />
            <span className="text-sm text-gray-600 dark:text-gray-300">不同</span>
          </div>
        </div>
      )}
    </div>
  )
}
