import { Router, type Request, type Response } from 'express'
import { trashData } from '../data/trashData.js'
import { initialData } from '../data/initialData.js'
import { searchLogMap, quizScoresStore, wrongAnswersStore } from '../store.js'

const router = Router()

router.get('/stats', (req: Request, res: Response): void => {
  const categoryDistribution: Record<string, number> = {}
  trashData.forEach(item => {
    categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1
  })

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
      totalSearches,
      totalQuizzes: quizScoresStore.length,
      totalUsers: initialData.users.length,
      totalItems: trashData.length,
      quizAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0
    }
  })
})

router.get('/hot-searches', (req: Request, res: Response): void => {
  const searches = [...searchLogMap.entries()]
    .map(([keyword, count]) => ({ keyword, searchCount: count }))
    .sort((a, b) => b.searchCount - a.searchCount)
    .slice(0, 20)

  res.json({ success: true, data: searches })
})

router.get('/quiz-stats', (req: Request, res: Response): void => {
  let totalCorrect = 0
  let totalQuestions = 0
  quizScoresStore.forEach(s => {
    totalCorrect += s.correctAnswers
    totalQuestions += s.totalQuestions
  })

  const mostWrongItems = [...wrongAnswersStore]
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 10)

  res.json({
    success: true,
    data: {
      accuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0,
      totalCorrect,
      totalQuestions,
      mostWrongItems
    }
  })
})

router.get('/user-activity', (req: Request, res: Response): void => {
  const userActivity = initialData.users.map(user => {
    const userScores = quizScoresStore.filter(s => s.userId === user.id)
    const totalScore = userScores.reduce((sum, s) => sum + s.score, 0)
    const quizCount = userScores.length

    return {
      ...user,
      recentScore: totalScore,
      quizCount
    }
  })

  res.json({ success: true, data: userActivity })
})

export default router
