import { Router, type Request, type Response } from 'express'
import { feedbacksStore } from '../store.js'

const router = Router()

router.post('/', (req: Request, res: Response): void => {
  const { userId, type, title, description, trashItemId } = req.body

  if (!userId || !type || !title || !description) {
    res.json({ success: false, error: '缺少必要参数' })
    return
  }

  const feedback = {
    id: `feedback-${Date.now()}`,
    userId,
    type,
    title,
    description,
    trashItemId: trashItemId || null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    resolvedAt: null as string | null
  }

  feedbacksStore.push(feedback)

  res.json({ success: true, data: feedback })
})

router.get('/all', (req: Request, res: Response): void => {
  res.json({ success: true, data: feedbacksStore })
})

router.put('/:id/resolve', (req: Request, res: Response): void => {
  const { id } = req.params
  const feedback = feedbacksStore.find(f => f.id === id)

  if (!feedback) {
    res.json({ success: false, error: '未找到该反馈' })
    return
  }

  feedback.status = 'resolved'
  feedback.resolvedAt = new Date().toISOString()

  res.json({ success: true, data: feedback })
})

export default router
