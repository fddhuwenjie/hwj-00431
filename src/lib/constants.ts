import type { Category } from '@/lib/api'

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; bgColor: string; borderColor: string; icon: string }> = {
  recyclable: { label: '可回收物', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-500', icon: 'Recycle' },
  hazardous: { label: '有害垃圾', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-500', icon: 'AlertTriangle' },
  kitchen: { label: '厨余垃圾', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-500', icon: 'Apple' },
  other: { label: '其他垃圾', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-500', icon: 'Trash2' },
}

export const CITY_CATEGORY_MAP: Record<string, Record<Category, string>> = {
  beijing: { recyclable: '可回收物', hazardous: '有害垃圾', kitchen: '厨余垃圾', other: '其他垃圾' },
  shanghai: { recyclable: '可回收物', hazardous: '有害垃圾', kitchen: '湿垃圾', other: '干垃圾' },
  guangzhou: { recyclable: '可回收物', hazardous: '有害垃圾', kitchen: '餐厨垃圾', other: '其他垃圾' },
}

export const CITY_LABELS: Record<string, string> = {
  beijing: '北京',
  shanghai: '上海',
  guangzhou: '广州',
}

export function getCategoryLabel(category: Category, city: string = 'beijing'): string {
  return CITY_CATEGORY_MAP[city]?.[category] ?? CATEGORY_CONFIG[category].label
}
