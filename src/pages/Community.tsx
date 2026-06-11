import { useState, useEffect } from 'react'
import { Plus, ClipboardList, Trophy, Send, Check, X as XIcon } from 'lucide-react'
import { api, type Category, type Contribution, type LeaderboardEntry } from '@/lib/api'
import { CATEGORY_CONFIG, getCategoryLabel } from '@/lib/constants'
import { useStore } from '@/stores/useStore'
import CategoryBadge from '@/components/CategoryBadge'
import { cn } from '@/lib/utils'

type Tab = 'submit' | 'review' | 'leaderboard'

export default function CommunityPage() {
  const { currentUser, currentCity } = useStore()
  const [tab, setTab] = useState<Tab>('submit')
  const [form, setForm] = useState({ itemName: '', category: 'recyclable' as Category, subCategory: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [pendingList, setPendingList] = useState<Contribution[]>([])
  const [allContributions, setAllContributions] = useState<Contribution[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({})

  useEffect(() => {
    if (tab === 'review') {
      api.getPendingContributions().then(setPendingList).catch(() => {})
      api.getAllContributions().then(setAllContributions).catch(() => {})
    }
    if (tab === 'leaderboard') {
      api.getContributionLeaderboard().then(setLeaderboard).catch(() => {})
    }
  }, [tab])

  const handleSubmit = async () => {
    if (!form.itemName.trim() || !form.description.trim()) return
    setSubmitting(true)
    try {
      await api.submitContribution({
        userId: currentUser?.id ?? 'user-001',
        itemName: form.itemName,
        category: form.category,
        description: form.description,
        subCategory: form.subCategory,
      })
      setSubmitted(true)
      setForm({ itemName: '', category: 'recyclable', subCategory: '', description: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch { }
    finally { setSubmitting(false) }
  }

  const handleApprove = async (id: string) => {
    try {
      await api.approveContribution(id)
      setPendingList((l) => l.filter((c) => c.id !== id))
    } catch { }
  }

  const handleReject = async (id: string) => {
    try {
      await api.rejectContribution(id, rejectNote[id] || '不符合要求')
      setPendingList((l) => l.filter((c) => c.id !== id))
    } catch { }
  }

  const statusMap: Record<string, { label: string; cls: string }> = {
    pending: { label: '待审核', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    approved: { label: '已通过', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    rejected: { label: '已拒绝', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {([
          { key: 'submit' as Tab, label: '提交物品', icon: Plus },
          { key: 'review' as Tab, label: '审核列表', icon: ClipboardList },
          { key: 'leaderboard' as Tab, label: '贡献排行', icon: Trophy },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all',
              tab === key
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'submit' && (
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-green-600">
              <Check size={32} className="mb-2" />
              <p className="font-semibold">提交成功！</p>
              <p className="text-sm text-gray-500">等待审核通过后即可在系统中查看</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">物品名称</label>
                <input
                  type="text"
                  value={form.itemName}
                  onChange={(e) => setForm((f) => ({ ...f, itemName: e.target.value }))}
                  placeholder="如：隐形眼镜、自热火锅盒..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">分类</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    {(['recyclable', 'hazardous', 'kitchen', 'other'] as Category[]).map((cat) => (
                      <option key={cat} value={cat}>{getCategoryLabel(cat, currentCity)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">子分类</label>
                  <input
                    type="text"
                    value={form.subCategory}
                    onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
                    placeholder="如：塑料、纸张..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="请描述该物品的分类说明和投放方式..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.itemName.trim() || !form.description.trim()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
                {submitting ? '提交中...' : '提交贡献'}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'review' && (
        <div className="space-y-4">
          {pendingList.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">待审核 ({pendingList.length})</h3>
              <div className="space-y-3">
                {pendingList.map((item) => (
                  <div key={item.id} className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 dark:border-yellow-800 dark:bg-yellow-900/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.itemName}</h4>
                        <span className="text-sm text-gray-500">{item.category}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(item.id)} className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 transition-colors">
                          <Check size={16} />
                        </button>
                        <button onClick={() => handleReject(item.id)} className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 transition-colors">
                          <XIcon size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    <input
                      type="text"
                      placeholder="拒绝原因（可选）"
                      value={rejectNote[item.id] || ''}
                      onChange={(e) => setRejectNote((r) => ({ ...r, [item.id]: e.target.value }))}
                      className="mt-2 w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">所有贡献</h3>
            <div className="space-y-2">
              {allContributions.map((item) => {
                const st = statusMap[item.status] ?? statusMap.pending
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{item.itemName}</span>
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', st.cls)}>{st.label}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    {item.points > 0 && (
                      <span className="text-sm font-bold text-blue-600">+{item.points}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="rounded-2xl bg-white shadow-sm dark:bg-gray-800 overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">暂无排行数据</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {leaderboard.map((entry, i) => (
                <div key={entry.userId} className="flex items-center gap-4 px-5 py-4">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                    i === 0 ? 'bg-yellow-100 text-yellow-700' :
                    i === 1 ? 'bg-gray-200 text-gray-600' :
                    i === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-white">{entry.username}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{entry.score}</div>
                    <div className="text-xs text-gray-500">贡献积分</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
