import { useState, useEffect, useCallback, useRef } from 'react'
import { Trophy, Play, Clock, Target, Zap, CheckCircle, XCircle, RotateCcw, Award, Timer, TrendingUp } from 'lucide-react'
import { api, type ChallengeQuestion, type ChallengeSubmitResult, type ChallengeLeaderboardEntry } from '@/lib/api'
import { useStore } from '@/stores/useStore'
import { CATEGORY_CONFIG, getCategoryLabel } from '@/lib/constants'
import { cn } from '@/lib/utils'

type Tab = 'challenge' | 'leaderboard'

type GameState = 'idle' | 'playing' | 'finished'

export default function ChallengePage() {
  const { currentUser, currentCity } = useStore()
  const [tab, setTab] = useState<Tab>('challenge')
  const [gameState, setGameState] = useState<GameState>('idle')
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answerState, setAnswerState] = useState<{ selected: number; correct: boolean } | null>(null)
  const [result, setResult] = useState<ChallengeSubmitResult | null>(null)
  const [leaderboard, setLeaderboard] = useState<ChallengeLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const currentQuestion = questions[currentIndex]

  const loadLeaderboard = useCallback(async () => {
    try {
      const data = await api.getChallengeLeaderboard()
      setLeaderboard(data.leaderboard)
    } catch {}
  }, [])

  useEffect(() => {
    if (tab === 'leaderboard') {
      loadLeaderboard()
    }
  }, [tab, loadLeaderboard])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startGame = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getDailyChallenge()
      setQuestions(data.questions)
      setCurrentIndex(0)
      setTimeLeft(data.timeLimit)
      setScore(0)
      setCorrectCount(0)
      setAnswerState(null)
      setResult(null)
      setGameState('playing')
      startTimeRef.current = Date.now()

      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      finishGame()
    }
  }, [timeLeft, gameState])

  const finishGame = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setGameState('finished')

    const timeUsed = Math.min(60, Math.round((Date.now() - startTimeRef.current) / 1000))
    const correctRate = questions.length > 0 ? correctCount / questions.length : 0

    if (currentUser) {
      try {
        const submitResult = await api.submitChallenge({
          userId: currentUser.id,
          username: currentUser.username,
          score,
          correctCount,
          totalQuestions: questions.length,
          timeUsed,
          correctRate,
        })
        setResult(submitResult)
        loadLeaderboard()
      } catch {}
    }
  }, [currentUser, score, correctCount, questions.length, loadLeaderboard])

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (!currentQuestion || answerState) return

    const correct = selectedIndex === currentQuestion.correctOption
    setAnswerState({ selected: selectedIndex, correct })

    if (correct) {
      setScore((prev) => prev + 10)
      setCorrectCount((prev) => prev + 1)
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        finishGame()
      }
      setAnswerState(null)
    }, 800)
  }, [currentQuestion, answerState, currentIndex, questions.length, finishGame])

  const resetGame = useCallback(() => {
    setGameState('idle')
    setResult(null)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        <button
          onClick={() => setTab('challenge')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all',
            tab === 'challenge'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Zap size={16} />
          每日挑战
        </button>
        <button
          onClick={() => setTab('leaderboard')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all',
            tab === 'leaderboard'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Trophy size={16} />
          排行榜
        </button>
      </div>

      {tab === 'challenge' && (
        <div className="space-y-6">
          {gameState === 'idle' && (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm dark:bg-gray-800">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500">
                <Zap size={48} className="text-white" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">每日挑战</h2>
              <p className="mb-2 text-center text-gray-500 dark:text-gray-400">
                每天20道题，60秒限时答题
              </p>
              <p className="mb-6 text-center text-sm text-gray-400 dark:text-gray-500">
                所有用户同一套题目，看看你能击败多少人！
              </p>
              <div className="mb-8 grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center dark:from-blue-900/20 dark:to-blue-900/30">
                  <Target size={24} className="mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">20</div>
                  <div className="text-xs text-blue-600/70">道题目</div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 text-center dark:from-green-900/20 dark:to-green-900/30">
                  <Timer size={24} className="mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">60s</div>
                  <div className="text-xs text-green-600/70">限时</div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-center dark:from-purple-900/20 dark:to-purple-900/30">
                  <Trophy size={24} className="mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">每日</div>
                  <div className="text-xs text-purple-600/70">刷新</div>
                </div>
              </div>
              <button
                onClick={startGame}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-10 py-4 text-lg font-bold text-white shadow-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all transform hover:scale-105"
              >
                <Play size={24} />
                {loading ? '加载中...' : '开始挑战'}
              </button>
            </div>
          )}

          {gameState === 'playing' && currentQuestion && (
            <>
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-xl bg-white p-3 text-center shadow-sm dark:bg-gray-800">
                  <div className="text-xl font-bold text-blue-600">{score}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">得分</div>
                </div>
                <div className="rounded-xl bg-white p-3 text-center shadow-sm dark:bg-gray-800">
                  <div className="text-xl font-bold text-green-600">{correctCount}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">正确</div>
                </div>
                <div className="rounded-xl bg-white p-3 text-center shadow-sm dark:bg-gray-800">
                  <div className="text-xl font-bold text-purple-600">{currentIndex + 1}/{questions.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">进度</div>
                </div>
                <div className={cn(
                  'rounded-xl p-3 text-center shadow-sm transition-colors',
                  timeLeft <= 10 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-white dark:bg-gray-800'
                )}>
                  <div className={cn(
                    'text-xl font-bold',
                    timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-600'
                  )}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">剩余</div>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                <div className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  第 {currentIndex + 1} 题
                </div>
                <h3 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
                  「{currentQuestion.name}」
                </h3>
                <p className="mb-6 text-center text-gray-500 dark:text-gray-400">属于哪一类垃圾？</p>

                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answerState?.selected === index
                    const isCorrect = index === currentQuestion.correctOption
                    let btnClass = cn(
                      'flex items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-semibold transition-all duration-300',
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
                    } else {
                      const colors = ['blue', 'red', 'green', 'gray']
                      const color = colors[index]
                      btnClass = cn(
                        btnClass,
                        `border-${color}-500 bg-${color}-50 text-${color}-700`,
                        `dark:bg-${color}-900/20 dark:border-${color}-600 dark:text-${color}-400`
                      )
                    }
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={!!answerState}
                        className={btnClass}
                      >
                        {answerState && isCorrect && <CheckCircle size={20} />}
                        {answerState && isSelected && !isCorrect && <XCircle size={20} />}
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {gameState === 'finished' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                    <Award size={40} className="text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">挑战完成！</h3>
                  {result && (
                    <p className="mb-6 text-gray-500 dark:text-gray-400">
                      击败了 <span className="font-bold text-orange-500">{result.beatPercent}%</span> 的玩家
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                    <div className="text-3xl font-bold text-blue-600">{score}</div>
                    <div className="text-sm text-blue-600/70">总得分</div>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4 text-center dark:bg-green-900/20">
                    <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-sm text-green-600/70">正确率</div>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                    <div className="text-3xl font-bold text-purple-600">{correctCount}/{questions.length}</div>
                    <div className="text-sm text-purple-600/70">答对题数</div>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                    <div className="text-3xl font-bold text-orange-600">
                      {result ? formatTime(result.timeUsed) : '--:--'}
                    </div>
                    <div className="text-sm text-orange-600/70">用时</div>
                  </div>
                </div>

                {result && result.rank <= 3 && (
                  <div className="mb-6 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 p-4 text-center dark:from-yellow-900/20 dark:to-orange-900/20">
                    <Trophy size={32} className="mx-auto mb-2 text-yellow-500" />
                    <p className="font-bold text-yellow-700 dark:text-yellow-400">
                      恭喜！你排名第 {result.rank} 名
                    </p>
                  </div>
                )}

                {result && result.rank > 3 && (
                  <div className="mb-6 rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-700/50">
                    <TrendingUp size={32} className="mx-auto mb-2 text-gray-500" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      当前排名：第 {result.rank} / {result.totalPlayers} 名
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={resetGame}
                    className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    返回首页
                  </button>
                  <button
                    onClick={startGame}
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-medium text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-colors"
                  >
                    <RotateCcw size={18} />
                    再来一次
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white shadow-sm dark:bg-gray-800 overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" />
                今日排行榜
              </h3>
            </div>
            {leaderboard.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                暂无排行数据，快来成为第一名！
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {leaderboard.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-5 py-4">
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold',
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      entry.rank === 2 ? 'bg-gray-200 text-gray-600' :
                      entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    )}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">{entry.username}</span>
                      <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {entry.correctCount}/{entry.totalQuestions} 题正确 · {formatTime(entry.timeUsed)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{entry.score}分</div>
                      <div className="text-xs text-gray-500">{Math.round(entry.correctRate * 100)}% 正确</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
