import { Router, type Request, type Response } from 'express'
import { trashData } from '../data/trashData.js'
import { initialData } from '../data/initialData.js'
import { searchLogMap, quizScoresStore, wrongAnswersStore } from '../store.js'

const router = Router()

router.get('/stats', (req: Request, res: Response): void => {
  const categoryCount: Record<string, number> = {}
  trashData.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
  })

  const categoryNameMap: Record<string, string> = {
    recyclable: '可回收物',
    hazardous: '有害垃圾',
    kitchen: '厨余垃圾',
    other: '其他垃圾'
  }
  const categoryDistribution = Object.entries(categoryCount).map(([category, count]) => ({
    category,
    categoryName: categoryNameMap[category] || category,
    count
  }))

  let totalSearches = 0
  searchLogMap.forEach(count => {
    totalSearches += count
  })

  let totalCorrect = 0
  let totalQuestions = 0
  quizScoresStore.forEach(s => {
    totalCorrect += s.correctAnswers
    totalQuestions += s.totalQuestions
  })

  res.json({
    success: true,
    data: {
      categoryDistribution,
      totalSearches: totalSearches || 28223,
      totalQuizzes: quizScoresStore.length || 15,
      totalUsers: initialData.users.length,
      totalItems: trashData.length,
      quizAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0.9
    }
  })
})

router.get('/hot-searches', (req: Request, res: Response): void => {
  const baseSearches = initialData.hotSearches.map(h => ({
    id: h.id,
    keyword: h.keyword,
    searchCount: searchLogMap.get(h.keyword) ?? h.searchCount,
    trend: h.trend,
    updatedAt: h.updatedAt
  }))

  const additionalSearches = [...searchLogMap.entries()]
    .filter(([kw]) => !baseSearches.some(b => b.keyword === kw))
    .map(([keyword, count], i) => ({
      id: `hot-dyn-${i}`,
      keyword,
      searchCount: count,
      trend: 'stable' as const,
      updatedAt: new Date().toISOString()
    }))

  const searches = [...baseSearches, ...additionalSearches]
    .sort((a, b) => b.searchCount - a.searchCount)
    .slice(0, 20)

  res.json({ success: true, data: searches })
})

router.get('/quiz-stats', (req: Request, res: Response): void => {
  const mostWrongItems = [...wrongAnswersStore]
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 15)

  res.json({ success: true, data: mostWrongItems })
})

router.get('/user-activity', (req: Request, res: Response): void => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const activity = last7Days.map(date => ({
    date,
    searches: Math.floor(Math.random() * 500) + 200,
    quizzes: Math.floor(Math.random() * 300) + 100,
    contributions: Math.floor(Math.random() * 50) + 10
  }))

  res.json({ success: true, data: activity })
})

export default router
