import { useState, useEffect } from 'react'
import { Recycle, AlertTriangle, Apple, Trash2, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'
import { api, type Category, type CategoryGroup, type TrashItem } from '@/lib/api'
import { CATEGORY_CONFIG, getCategoryLabel } from '@/lib/constants'
import { useStore } from '@/stores/useStore'
import CategoryBadge from '@/components/CategoryBadge'
import ItemDetail from '@/components/ItemDetail'
import { cn } from '@/lib/utils'

const CATEGORIES: { key: Category; Icon: React.ElementType }[] = [
  { key: 'recyclable', Icon: Recycle },
  { key: 'hazardous', Icon: AlertTriangle },
  { key: 'kitchen', Icon: Apple },
  { key: 'other', Icon: Trash2 },
]

export default function BrowsePage() {
  const { currentCity } = useStore()
  const [activeCategory, setActiveCategory] = useState<Category>('recyclable')
  const [groups, setGroups] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedSub, setExpandedSub] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null)

  useEffect(() => {
    setLoading(true)
    api.getByCategory(activeCategory, currentCity)
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false))
  }, [activeCategory, currentCity])

  const config = CATEGORY_CONFIG[activeCategory]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map(({ key, Icon }) => {
          const cfg = CATEGORY_CONFIG[key]
          const isActive = activeCategory === key
          return (
            <button
              key={key}
              onClick={() => { setActiveCategory(key); setExpandedSub(null) }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
                isActive
                  ? `${cfg.borderColor} ${cfg.bgColor} shadow-md`
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              )}
            >
              <Icon size={28} className={cn(isActive ? cfg.color : 'text-gray-400 dark:text-gray-500')} />
              <span className={cn('text-sm font-semibold', isActive ? cfg.color : 'text-gray-600 dark:text-gray-400')}>
                {getCategoryLabel(key, currentCity)}
              </span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const isExpanded = expandedSub === group.subCategory
            return (
              <div key={group.subCategory} className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <button
                  onClick={() => setExpandedSub(isExpanded ? null : group.subCategory)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                    <span className="font-semibold text-gray-900 dark:text-white">{group.subCategory}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {group.items.length} 项
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="flex cursor-pointer items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 dark:text-white">{item.name}</span>
                            {item.isCommonMisclassification && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <AlertCircle size={10} />
                                易错
                              </span>
                            )}
                          </div>
                          <CategoryBadge category={item.category} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {groups.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">暂无数据</div>
          )}
        </div>
      )}

      {selectedItem && <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}
