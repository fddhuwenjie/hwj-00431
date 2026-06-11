import express, { type Request, type Response } from 'express'
import { trashData, type TrashItem } from '../data/trashData.js'
import { challengeScoresStore, type ChallengeScore } from '../store.js'

const router = express.Router()

const CATEGORIES = ['recyclable', 'hazardous', 'kitchen', 'other']
const CATEGORY_NAMES: Record<string, string> = {
  recyclable: '可回收物',
  hazardous: '有害垃圾',
  kitchen: '厨余垃圾',
  other: '其他垃圾',
}

function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

function getTodaySeed(): number {
  const today = new Date()
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
}

function shuffleArray<T>(array: T[], random: () => number): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function getTodayDateString(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function generateDailyQuestions(count: number) {
  const seed = getTodaySeed()
  const random = seededRandom(seed)

  const shuffledItems = shuffleArray([...trashData], random)
  const selectedItems = shuffledItems.slice(0, count)

  return selectedItems.map((item, index) => {
    const itemRandom = seededRandom(seed + index)
    const otherCategories = CATEGORIES.filter((c) => c !== item.category)
    const shuffledOthers = shuffleArray(otherCategories, itemRandom)
    const wrongOptions = shuffledOthers.slice(0, 3)

    const allOptions = shuffleArray([item.category, ...wrongOptions], itemRandom)
    const correctOption = allOptions.indexOf(item.category)

    return {
      id: `q-${index}`,
      name: item.name,
      category: item.category,
      categoryName: item.categoryName,
      options: allOptions.map((c) => CATEGORY_NAMES[c]),
      correctOption,
    }
  })
}

router.get('/daily', (req: Request, res: Response): void => {
  const questions = generateDailyQuestions(20)
  res.json({
    success: true,
    data: {
      date: getTodayDateString(),
      questions,
      totalQuestions: questions.length,
      timeLimit: 60,
    },
  })
})

router.post('/submit', (req: Request, res: Response): void => {
  const { userId, username, score, correctCount, totalQuestions, timeUsed, correctRate } = req.body

  if (!userId || !username || score === undefined || correctCount === undefined || totalQuestions === undefined || timeUsed === undefined || correctRate === undefined) {
    res.status(400).json({
      success: false,
      error: '缺少必要参数',
    })
    return
  }

  const today = getTodayDateString()

  const existingIndex = challengeScoresStore.findIndex(
    (s) => s.userId === userId && s.date === today
  )

  const newScore: ChallengeScore = {
    id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    date: today,
    score,
    correctCount,
    totalQuestions,
    timeUsed,
    correctRate,
  }

  if (existingIndex >= 0) {
    const existing = challengeScoresStore[existingIndex]
    if (score > existing.score) {
      challengeScoresStore[existingIndex] = newScore
    }
  } else {
    challengeScoresStore.push(newScore)
  }

  const todayScores = challengeScoresStore
    .filter((s) => s.date === today)
    .sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed)

  const rank = todayScores.findIndex((s) => s.userId === userId) + 1
  const totalPlayers = todayScores.length
  const beatPercent = totalPlayers > 1 ? Math.round(((totalPlayers - rank) / (totalPlayers - 1)) * 100) : 100

  res.json({
    success: true,
    data: {
      score,
      correctCount,
      totalQuestions,
      timeUsed,
      correctRate,
      rank,
      totalPlayers,
      beatPercent,
    },
  })
})

router.get('/leaderboard', (req: Request, res: Response): void => {
  const date = req.query.date as string || getTodayDateString()

  const todayScores = challengeScoresStore
    .filter((s) => s.date === date)
    .sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed)
    .slice(0, 50)
    .map((s, index) => ({
      ...s,
      rank: index + 1,
    }))

  res.json({
    success: true,
    data: {
      date,
      leaderboard: todayScores,
    },
  })
})

export default router
