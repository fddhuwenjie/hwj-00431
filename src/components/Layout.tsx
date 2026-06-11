import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  Search, Layers, Brain, Lightbulb, Users, BarChart3,
  Sun, Moon, Menu, X, MapPin, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/stores/useStore'
import { CITY_LABELS, CATEGORY_CONFIG } from '@/lib/constants'
import type { Category } from '@/lib/api'

const NAV_ITEMS = [
  { to: '/search', label: '搜索查询', icon: Search, category: 'recyclable' as Category },
  { to: '/browse', label: '分类浏览', icon: Layers, category: 'recyclable' as Category },
  { to: '/quiz', label: '学习测验', icon: Brain, category: 'kitchen' as Category },
  { to: '/tips', label: 'AI建议', icon: Lightbulb, category: 'hazardous' as Category },
  { to: '/community', label: '社区贡献', icon: Users, category: 'other' as Category },
  { to: '/admin', label: '统计面板', icon: BarChart3, category: 'other' as Category },
]

export default function Layout() {
  const { currentCity, setCity, theme, toggleTheme, sidebarOpen, setSidebarOpen } = useStore()
  const location = useLocation()
  const [cityDropdown, setCityDropdown] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, setSidebarOpen])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const activeNav = NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))
  const activeBorderColor = activeNav ? CATEGORY_CONFIG[activeNav.category].borderColor : 'border-blue-500'

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 dark:bg-gray-800 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-700">
          <RecycleIcon className="h-7 w-7 text-blue-600" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">垃圾分类</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const borderColor = CATEGORY_CONFIG[item.category].borderColor
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? `${borderColor} border-l-4 bg-blue-50 text-gray-900 dark:bg-gray-700 dark:text-white`
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
                  )
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="text-xs text-gray-400">v1.0.0 · 垃圾分类查询与学习</div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-700"
            >
              <Menu size={20} />
            </button>
            <div className="hidden text-sm text-gray-500 lg:block dark:text-gray-400">
              {activeNav?.label ?? '垃圾分类查询与学习系统'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setCityDropdown(!cityDropdown)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <MapPin size={14} />
                <span>{CITY_LABELS[currentCity]}</span>
                <ChevronDown size={14} className={cn('transition-transform', cityDropdown && 'rotate-180')} />
              </button>
              {cityDropdown && (
                <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                  {Object.entries(CITY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setCity(key as typeof currentCity); setCityDropdown(false) }}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm transition-colors',
                        currentCity === key
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-700">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">明</div>
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">环保达人小明</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function RecycleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 12.013 3a1.784 1.784 0 0 1 1.575.887l3.085 5.337" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  )
}
