import { cn } from '@/lib/utils'
import { CATEGORY_CONFIG, getCategoryLabel } from '@/lib/constants'
import type { Category } from '@/lib/api'
import { useStore } from '@/stores/useStore'

interface CategoryBadgeProps {
  category: Category
  className?: string
  showIcon?: boolean
  cityOverride?: string
}

export default function CategoryBadge({ category, className, showIcon = false, cityOverride }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category]
  const currentCity = useStore((s) => s.currentCity)
  const city = cityOverride ?? currentCity
  const label = getCategoryLabel(category, city)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      {label}
    </span>
  )
}
