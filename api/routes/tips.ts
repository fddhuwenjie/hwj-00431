import { Router, type Request, type Response } from 'express'
import { tipsData } from '../data/tipsData.js'

const router = Router()

router.get('/daily', (req: Request, res: Response): void => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % tipsData.tips.length
  const tip = tipsData.tips[index]

  res.json({ success: true, data: tip })
})

router.get('/all', (req: Request, res: Response): void => {
  res.json({ success: true, data: tipsData.tips })
})

router.get('/guides', (req: Request, res: Response): void => {
  res.json({ success: true, data: tipsData.guides })
})

router.get('/guides/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const guide = tipsData.guides.find(g => g.id === id)

  if (!guide) {
    res.json({ success: false, error: '未找到该指南' })
    return
  }

  res.json({ success: true, data: guide })
})

export default router
