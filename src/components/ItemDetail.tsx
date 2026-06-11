import { useEffect } from 'react'
import { X, AlertTriangle, Recycle, Apple, Trash2 } from 'lucide-react'
import type { Category, TrashItem } from '@/lib/api'
import { CATEGORY_CONFIG, getCategoryLabel } from '@/lib/constants'
import { useStore } from '@/stores/useStore'
import CategoryBadge from './CategoryBadge'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<Category, React.ElementType> = {
  recyclable: Recycle,
  hazardous: AlertTriangle,
  kitchen: Apple,
  other: Trash2,
}

interface ItemDetailProps {
  item: TrashItem
  onClose: () => void
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
  const currentCity = useStore((s) => s.currentCity)
  const config = CATEGORY_CONFIG[item.category]
  const Icon = ICON_MAP[item.category]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 transition-opacity" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', config.bgColor)}>
            <Icon size={24} className={config.color} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h2>
            <CategoryBadge category={item.category} />
          </div>
        </div>

        {item.isCommonMisclassification && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertTriangle size={16} />
            <span className="font-medium">⚠️ 易错分类</span>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <span className="font-medium text-gray-500 dark:text-gray-400">城市分类名称：</span>
            <span className="ml-2 text-gray-900 dark:text-white">{getCategoryLabel(item.category, currentCity)}</span>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <span className="font-medium text-gray-500 dark:text-gray-400">子分类：</span>
            <span className="ml-2 text-gray-900 dark:text-white">{item.subCategory}</span>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <span className="font-medium text-gray-500 dark:text-gray-400">投放方式：</span>
            <span className="ml-2 text-gray-900 dark:text-white">{item.disposalMethod}</span>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <span className="font-medium text-gray-500 dark:text-gray-400">注意事项：</span>
            <span className="ml-2 text-gray-900 dark:text-white">{item.precautions}</span>
          </div>

          {item.correctExplanation && (
            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <span className="font-medium text-amber-700 dark:text-amber-400">正确解释：</span>
              <span className="ml-2 text-amber-800 dark:text-amber-300">{item.correctExplanation}</span>
            </div>
          )}

          {item.synonyms.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <span className="font-medium text-gray-500 dark:text-gray-400">同义词：</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {item.synonyms.map((s, i) => (
                  <span key={i} className="rounded bg-white px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
