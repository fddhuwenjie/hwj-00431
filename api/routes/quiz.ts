import { Router, type Request, type Response } from 'express'
import { trashData } from '../data/trashData.js'
import { initialData } from '../data/initialData.js'
import {
  quizScoresStore,
  userWrongBook,
  wrongAnswersStore,
  cityCategoryMap,
  categoryKeyToName,
  chineseToKey
} from '../store.js'

const router = Router()

const categories = ['recyclable', 'hazardous', 'kitchen', 'other'] as const

router.get('/random', (req: Request, res: Response): void => {
  const count = Math.min(50, Math.max(1, parseInt(req.query.count as string) || 10))
  const city = req.query.city as string

  const shuffled = [...trashData].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, count)

  const categoryMap = city && cityCategoryMap[city] ? cityCategoryMap[city] : cityCategoryMap.beijing

  const questions = selected.map(item => {
    const options = categories.map(cat => ({
      value: cat,
      label: categoryMap[cat]
    }))

    return {
      trashItemId: item.id,
      question: item.name,
      options,
      correctCategory: item.category
    }
  })

  res.json({ success: true, data: questions })
})

router.post('/answer', (req: Request, res: Response): void => {
  const { trashItemId, selectedCategory, userId } = req.body

  if (!trashItemId || !selectedCategory || !userId) {
    res.json({ success: false, error: '缺少必要参数' })
    return
  }

  const item = trashData.find(i => i.id === trashItemId)
  if (!item) {
    res.json({ success: false, error: '未找到该物品' })
    return
  }

  const resolvedCategory = chineseToKey[selectedCategory] || selectedCategory
  const correct = resolvedCategory === item.category
  const score = correct ? 10 : 0

  quizScoresStore.push({
    id: `score-${Date.now()}`,
    userId,
    score,
    totalQuestions: 1,
    correctAnswers: correct ? 1 : 0,
    duration: 0,
    completedAt: new Date().toISOString(),
    city: ''
  })

  if (!correct) {
    const wrongCategoryChinese = categoryKeyToName[resolvedCategory] || selectedCategory

    const existingWrong = wrongAnswersStore.find(w => w.trashItemId === trashItemId)
    if (existingWrong) {
      existingWrong.wrongCount += 1
    } else {
      wrongAnswersStore.push({
        id: `wrong-${Date.now()}`,
        trashItemId,
        trashItemName: item.name,
        correctCategory: item.categoryName,
        wrongCategory: wrongCategoryChinese,
        wrongCount: 1
      })
    }

    if (!userWrongBook.has(userId)) {
      userWrongBook.set(userId, [])
    }
    userWrongBook.get(userId)!.push({
      trashItemId,
      trashItemName: item.name,
      correctCategory: item.categoryName,
      wrongCategory: wrongCategoryChinese,
      timestamp: new Date().toISOString()
    })
  }

  res.json({
    success: true,
    data: {
      correct,
      correctCategory: item.categoryName,
      explanation: item.correctExplanation || item.disposalMethod,
      score
    }
  })
})

router.get('/leaderboard', (req: Request, res: Response): void => {
  const type = (req.query.type as string) || 'total'

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const scoresToUse = type === 'weekly'
    ? quizScoresStore.filter(s => new Date(s.completedAt) >= weekAgo)
    : quizScoresStore

  const userScoreTotals: Map<string, { totalScore: number; totalCorrect: number; totalQuestions: number }> = new Map()

  scoresToUse.forEach(score => {
    const existing = userScoreTotals.get(score.userId)
    if (existing) {
      existing.totalScore += score.score
      existing.totalCorrect += score.correctAnswers
      existing.totalQuestions += score.totalQuestions
    } else {
      userScoreTotals.set(score.userId, {
        totalScore: score.score,
        totalCorrect: score.correctAnswers,
        totalQuestions: score.totalQuestions
      })
    }
  })

  const leaderboard = [...userScoreTotals.entries()]
    .map(([userId, data]) => {
      const user = initialData.users.find(u => u.id === userId)
      return {
        userId,
        username: user?.username || '未知用户',
        avatar: user?.avatar || '',
        totalScore: data.totalScore,
        totalCorrect: data.totalCorrect,
        totalQuestions: data.totalQuestions,
        correctRate: data.totalQuestions > 0 ? data.totalCorrect / data.totalQuestions : 0
      }
    })
    .sort((a, b) => b.totalScore - a.totalScore)

  res.json({ success: true, data: leaderboard })
})

router.get('/wrong-book/:userId', (req: Request, res: Response): void => {
  const { userId } = req.params
  const wrongBook = userWrongBook.get(userId) || []
  res.json({ success: true, data: wrongBook })
})

router.post('/wrong-book/:userId/clear', (req: Request, res: Response): void => {
  const { userId } = req.params
  const { trashItemId } = req.body

  const wrongBook = userWrongBook.get(userId)
  if (!wrongBook || wrongBook.length === 0) {
    res.json({ success: false, error: '未找到错题记录' })
    return
  }

  if (!trashItemId) {
    userWrongBook.set(userId, [])
    res.json({ success: true, data: { message: '已清空所有错题' } })
    return
  }

  const index = wrongBook.findIndex(w => w.trashItemId === trashItemId)
  if (index === -1) {
    res.json({ success: false, error: '未找到该错题' })
    return
  }

  wrongBook.splice(index, 1)
  res.json({ success: true, data: { message: '已清除该错题' } })
})

export default router
