import { useState, useEffect, useCallback } from 'react'
import { Brain, Trophy, BookOpen, Play, CheckCircle, XCircle, RotateCcw, Trash2, ArrowRight } from 'lucide-react'
import { api, type Category, type QuizQuestion, type LeaderboardEntry, type WrongBookItem } from '@/lib/api'
import { CATEGORY_CONFIG, getCategoryLabel } from '@/lib/constants'
import { useStore } from '@/stores/useStore'
import CategoryBadge from '@/components/CategoryBadge'
import { cn } from '@/lib/utils'

type Tab = 'quiz' | 'leaderboard' | 'wrong'

const CHOICE_CATEGORIES: Category[] = ['recyclable', 'hazardous', 'kitchen', 'other']

export default function QuizPage() {
  const { currentUser, currentCity, quizState, updateQuizState, resetQuiz, addToWrongBook, wrongBook, removeFromWrongBook } = useStore()
  const [tab, setTab] = useState<Tab>('quiz')
  const [leaderboardType, setLeaderboardType] = useState<'weekly' | 'total'>('total')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [wrongBookData, setWrongBookData] = useState<WrongBookItem[]>([])
  const [answerState, setAnswerState] = useState<{ selected: Category; correct: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  const currentQuestion = quizState.currentQuestions[quizState.currentIndex]

  const startQuiz = useCallback(async () => {
    setLoading(true)
    resetQuiz()
    try {
      const questions = await api.getQuizQuestions(10, currentCity)
      updateQuizState({ currentQuestions: questions, currentIndex: 0 })
    } catch { }
    finally { setLoading(false) }
  }, [currentCity, resetQuiz, updateQuizState])

  useEffect(() => {
    if (tab === 'leaderboard') {
      api.getLeaderboard(leaderboardType).then(setLeaderboard).catch(() => {})
    }
    if (tab === 'wrong' && currentUser) {
      api.getWrongBook(currentUser.id).then(setWrongBookData).catch(() => {})
    }
  }, [tab, leaderboardType, currentUser])

  const handleAnswer = async (selected: Category) => {
    if (!currentQuestion || answerState) return
    const correct = selected === currentQuestion.category
    setAnswerState({ selected, correct })

    const newTotal = quizState.totalAnswered + 1
    const newCorrect = quizState.correctCount + (correct ? 1 : 0)
    const newStreak = correct ? quizState.streak + 1 : 0
    const newScore = quizState.score + (correct ? 10 : 0)

    updateQuizState({
      totalAnswered: newTotal,
      correctCount: newCorrect,
      streak: newStreak,
      score: newScore,
    })

    if (currentUser) {
      try {
        await api.submitAnswer({
          trashItemId: currentQuestion.id,
          selectedCategory: selected,
          userId: currentUser.id,
        })
      } catch { }
    }

    if (!correct) {
      addToWrongBook({
        id: `wrong-${currentQuestion.id}`,
        trashItemId: currentQuestion.id,
        trashItemName: currentQuestion.name,
        correctCategory: currentQuestion.categoryName,
        wrongCategory: CATEGORY_CONFIG[selected].label,
        wrongCount: 1,
      })
    }

    setTimeout(() => {
      if (quizState.currentIndex < quizState.currentQuestions.length - 1) {
        updateQuizState({ currentIndex: quizState.currentIndex + 1 })
      }
      setAnswerState(null)
    }, 2000)
  }

  const accuracy = quizState.totalAnswered > 0
    ? Math.round((quizState.correctCount / quizState.totalAnswered) * 100)
    : 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {([
          { key: 'quiz' as Tab, label: '开始测验', icon: Brain },
          { key: 'leaderboard' as Tab, label: '排行榜', icon: Trophy },
          { key: 'wrong' as Tab, label: '错题本', icon: BookOpen },
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

      {tab === 'quiz' && (
        <div className="space-y-6">
          {!currentQuestion ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm dark:bg-gray-800">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Brain size={40} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">垃圾分类测验</h2>
              <p className="mb-6 text-center text-gray-500 dark:text-gray-400">测试你的垃圾分类知识，看看你能答对多少！</p>
              <button
                onClick={startQuiz}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Play size={18} />
                {loading ? '加载中...' : '开始测验'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                  <div className="text-2xl font-bold text-blue-600">{quizState.score}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">得分</div>
                </div>
                <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                  <div className="text-2xl font-bold text-green-600">{quizState.streak}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">连对</div>
                </div>
                <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                  <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">正确率</div>
                </div>
              </div>

              <div className="flex gap-1">
                {quizState.currentQuestions.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      i < quizState.currentIndex ? 'bg-green-500' :
                      i === quizState.currentIndex ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                ))}
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                <div className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  第 {quizState.currentIndex + 1} / {quizState.currentQuestions.length} 题
                </div>
                <h3 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
                  「{currentQuestion.name}」
                </h3>
                <p className="mb-6 text-center text-gray-500 dark:text-gray-400">属于哪一类垃圾？</p>

                <div className="grid grid-cols-2 gap-3">
                  {CHOICE_CATEGORIES.map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat]
                    const isSelected = answerState?.selected === cat
                    const isCorrect = cat === currentQuestion.category
                    let btnClass = cn(
                      'flex items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-semibold transition-all duration-300',
                      cfg.bgColor, cfg.color, cfg.borderColor,
                      'hover:shadow-md'
                    )
                    if (answerState) {
                      if (isCorrect) {
                        btnClass = 'flex items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-green-100 py-4 text-base font-semibold text-green-700'
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'flex items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-red-100 py-4 text-base font-semibold text-red-700'
                      } else {
                        btnClass = 'flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50 py-4 text-base font-semibold text-gray-400'
                      }
                    }
                    return (
                      <button
                        key={cat}
                        onClick={() => handleAnswer(cat)}
                        disabled={!!answerState}
                        className={btnClass}
                      >
                        {answerState && isCorrect && <CheckCircle size={20} />}
                        {answerState && isSelected && !isCorrect && <XCircle size={20} />}
                        {getCategoryLabel(cat, currentCity)}
                      </button>
                    )
                  })}
                </div>

                {answerState && (
                  <div className={cn(
                    'mt-6 rounded-xl p-4 animate-in',
                    answerState.correct ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      {answerState.correct ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <XCircle size={18} className="text-red-600" />
                      )}
                      <span className={cn('font-semibold', answerState.correct ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400')}>
                        {answerState.correct ? '回答正确！' : '回答错误'}
                      </span>
                    </div>
                    {!answerState.correct && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        正确答案：<span className="font-medium">{getCategoryLabel(currentQuestion.category, currentCity)}</span>
                        {currentQuestion.correctExplanation && ` — ${currentQuestion.correctExplanation}`}
                      </p>
                    )}
                    {currentQuestion.disposalMethod && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        投放方式：{currentQuestion.disposalMethod}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLeaderboardType('weekly')}
              className={cn(
                'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                leaderboardType === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              )}
            >
              本周
            </button>
            <button
              onClick={() => setLeaderboardType('total')}
              className={cn(
                'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                leaderboardType === 'total' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              )}
            >
              总榜
            </button>
          </div>

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
                      <div className="text-xs text-gray-500">{Math.round(entry.correctRate * 100)}% 正确</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'wrong' && (
        <div className="space-y-3">
          {wrongBookData.length === 0 && wrongBook.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 dark:bg-gray-800">
              <BookOpen size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">暂无错题，继续加油！</p>
            </div>
          ) : (
            [...wrongBookData, ...wrongBook.filter(wb => !wrongBookData.some(wd => wd.trashItemId === wb.trashItemId))].map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{item.trashItemName}</div>
                  <div className="mt-1 flex gap-2 text-sm">
                    <span className="text-red-500">你选了：{item.wrongCategory}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600">正确：{item.correctCategory}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWrongBook(item.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
