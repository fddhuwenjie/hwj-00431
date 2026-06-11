import { useState, useEffect } from 'react'
import { Lightbulb, BookOpen, HelpCircle, X, ChevronRight, Send } from 'lucide-react'
import { api, type Tip, type Guide } from '@/lib/api'
import { useStore } from '@/stores/useStore'
import { cn } from '@/lib/utils'

export default function TipsPage() {
  const { currentUser } = useStore()
  const [dailyTip, setDailyTip] = useState<Tip | null>(null)
  const [tips, setTips] = useState<Tip[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [feedbackForm, setFeedbackForm] = useState({ itemName: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    api.getDailyTip().then(setDailyTip).catch(() => {})
    api.getAllTips().then(setTips).catch(() => {})
    api.getGuides().then(setGuides).catch(() => {})
  }, [])

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.itemName.trim() || !feedbackForm.description.trim()) return
    setSubmitting(true)
    try {
      await api.submitFeedback({
        userId: currentUser?.id ?? 'user-001',
        type: 'question',
        title: feedbackForm.itemName,
        description: feedbackForm.description,
      })
      setSubmitted(true)
      setFeedbackForm({ itemName: '', description: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch { }
    finally { setSubmitting(false) }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {dailyTip && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">每日小贴士</h2>
          </div>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 shadow-lg">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 p-6 text-white sm:p-8">
                <h3 className="mb-2 text-xl font-bold">{dailyTip.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{dailyTip.content}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">拆解指南</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-36 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                <BookOpen size={48} className="text-blue-400 dark:text-blue-600" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {guide.title}
                </h3>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{guide.steps.length} 个步骤</span>
                  <ChevronRight size={12} className="ml-auto" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={20} className="text-purple-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">不确定？提交反馈</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-green-600">
              <Send size={32} className="mb-2" />
              <p className="font-semibold">提交成功！</p>
              <p className="text-sm text-gray-500">我们会尽快处理您的反馈</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">物品名称</label>
                <input
                  type="text"
                  value={feedbackForm.itemName}
                  onChange={(e) => setFeedbackForm((f) => ({ ...f, itemName: e.target.value }))}
                  placeholder="如：珍珠奶茶杯、自热火锅盒..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">描述你的疑问</label>
                <textarea
                  value={feedbackForm.description}
                  onChange={(e) => setFeedbackForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="请详细描述你不确定的分类问题..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
              <button
                onClick={handleSubmitFeedback}
                disabled={submitting || !feedbackForm.itemName.trim() || !feedbackForm.description.trim()}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
                {submitting ? '提交中...' : '提交反馈'}
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedGuide(null)}>
          <div className="fixed inset-0 bg-black/50" />
          <div
            className="relative z-10 w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">{selectedGuide.title}</h2>
            <div className="space-y-4">
              {selectedGuide.steps.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{step.action}</p>
                    <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {step.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
