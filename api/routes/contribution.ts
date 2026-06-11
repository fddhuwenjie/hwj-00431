import { Router, type Request, type Response } from 'express'
import { trashData } from '../data/trashData.js'
import { initialData } from '../data/initialData.js'
import { contributionsStore, chineseToKey } from '../store.js'

const router = Router()

router.post('/', (req: Request, res: Response): void => {
  const { userId, itemName, category, description, subCategory } = req.body

  if (!userId || !itemName || !category || !description) {
    res.json({ success: false, error: '缺少必要参数' })
    return
  }

  const contribution = {
    id: `contrib-${Date.now()}`,
    userId,
    itemName,
    category,
    description,
    subCategory: subCategory || '',
    status: 'pending',
    points: 0,
    createdAt: new Date().toISOString(),
    reviewNote: ''
  }

  contributionsStore.push(contribution)

  res.json({ success: true, data: contribution })
})

router.get('/pending', (req: Request, res: Response): void => {
  const pending = contributionsStore.filter(c => c.status === 'pending')
  res.json({ success: true, data: pending })
})

router.get('/all', (req: Request, res: Response): void => {
  res.json({ success: true, data: contributionsStore })
})

router.put('/:id/approve', (req: Request, res: Response): void => {
  const { id } = req.params
  const contribution = contributionsStore.find(c => c.id === id)

  if (!contribution) {
    res.json({ success: false, error: '未找到该贡献' })
    return
  }

  if (contribution.status !== 'pending') {
    res.json({ success: false, error: '该贡献已处理' })
    return
  }

  contribution.status = 'approved'
  contribution.points = 50
  contribution.reviewNote = '审核通过'

  const categoryKey = chineseToKey[contribution.category] || 'other'
  const subCat = (contribution as Record<string, unknown>).subCategory as string || '其他'
  const prefix: Record<string, string> = {
    recyclable: 'r',
    hazardous: 'h',
    kitchen: 'k',
    other: 'o'
  }
  const newId = `${prefix[categoryKey] || 'o'}${String(trashData.length + 1).padStart(3, '0')}`

  trashData.push({
    id: newId,
    name: contribution.itemName,
    category: categoryKey as 'recyclable' | 'hazardous' | 'kitchen' | 'other',
    categoryName: contribution.category as '可回收物' | '有害垃圾' | '厨余垃圾' | '其他垃圾',
    subCategory: subCat,
    disposalMethod: contribution.description,
    precautions: '',
    isCommonMisclassification: false,
    correctExplanation: '',
    synonyms: []
  })

  res.json({ success: true, data: contribution })
})

router.put('/:id/reject', (req: Request, res: Response): void => {
  const { id } = req.params
  const { reviewNote } = req.body
  const contribution = contributionsStore.find(c => c.id === id)

  if (!contribution) {
    res.json({ success: false, error: '未找到该贡献' })
    return
  }

  if (contribution.status !== 'pending') {
    res.json({ success: false, error: '该贡献已处理' })
    return
  }

  contribution.status = 'rejected'
  contribution.reviewNote = reviewNote || '审核未通过'

  res.json({ success: true, data: contribution })
})

router.get('/leaderboard', (req: Request, res: Response): void => {
  const userContribMap: Map<string, { count: number; points: number; approvedCount: number }> = new Map()

  contributionsStore.forEach(c => {
    const existing = userContribMap.get(c.userId)
    if (existing) {
      existing.count += 1
      existing.points += c.points
      if (c.status === 'approved') existing.approvedCount += 1
    } else {
      userContribMap.set(c.userId, {
        count: 1,
        points: c.points,
        approvedCount: c.status === 'approved' ? 1 : 0
      })
    }
  })

  const leaderboard = [...userContribMap.entries()]
    .map(([userId, data]) => {
      const user = initialData.users.find(u => u.id === userId)
      return {
        userId,
        username: user?.username || '未知用户',
        avatar: user?.avatar || '',
        ...data
      }
    })
    .sort((a, b) => b.points - a.points)

  res.json({ success: true, data: leaderboard })
})

export default router
