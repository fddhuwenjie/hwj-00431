import { Router, type Request, type Response } from 'express'
import { trashData, type TrashItem } from '../data/trashData.js'
import { initialData } from '../data/initialData.js'
import { searchLogMap, cityCategoryMap, cityNameMap } from '../store.js'

const router = Router()

router.get('/search', (req: Request, res: Response): void => {
  const q = (req.query.q as string || '').trim().toLowerCase()
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20))

  if (!q) {
    res.json({ success: false, error: '搜索关键词不能为空' })
    return
  }

  const results = trashData.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.synonyms.some(s => s.toLowerCase().includes(q))
  )

  const start = (page - 1) * limit
  const paginatedResults = results.slice(start, start + limit)

  res.json({
    success: true,
    data: {
      items: paginatedResults,
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit)
    }
  })
})

router.get('/category/:category', (req: Request, res: Response): void => {
  const { category } = req.params
  const city = req.query.city as string

  const validCategories: string[] = ['recyclable', 'hazardous', 'kitchen', 'other']
  if (!validCategories.includes(category)) {
    res.json({ success: false, error: '无效的分类' })
    return
  }

  const items = trashData.filter(item => item.category === category)

  const grouped: Record<string, TrashItem[]> = {}
  items.forEach(item => {
    if (!grouped[item.subCategory]) {
      grouped[item.subCategory] = []
    }
    grouped[item.subCategory].push(item)
  })

  const categoryName = city && cityCategoryMap[city]
    ? cityCategoryMap[city][category]
    : items[0]?.categoryName

  let cityRules: string[] | undefined
  if (city && cityNameMap[city]) {
    const rule = initialData.cityRules.find(r => r.cityName === cityNameMap[city])
    if (rule) cityRules = rule.specialRules
  }

  res.json({
    success: true,
    data: {
      category,
      categoryName,
      subCategories: Object.entries(grouped).map(([subCategory, subItems]) => ({
        subCategory,
        items: subItems
      })),
      total: items.length,
      cityRules
    }
  })
})

router.get('/subcategories/:category', (req: Request, res: Response): void => {
  const { category } = req.params
  const validCategories: string[] = ['recyclable', 'hazardous', 'kitchen', 'other']
  if (!validCategories.includes(category)) {
    res.json({ success: false, error: '无效的分类' })
    return
  }

  const items = trashData.filter(item => item.category === category)
  const subCategories = [...new Set(items.map(item => item.subCategory))]

  res.json({
    success: true,
    data: {
      category,
      subCategories
    }
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const item = trashData.find(i => i.id === id)

  if (!item) {
    res.json({ success: false, error: '未找到该物品' })
    return
  }

  res.json({ success: true, data: item })
})

router.post('/search/log', (req: Request, res: Response): void => {
  const { keyword } = req.body
  if (!keyword) {
    res.json({ success: false, error: '关键词不能为空' })
    return
  }

  const current = searchLogMap.get(keyword) || 0
  searchLogMap.set(keyword, current + 1)

  res.json({ success: true, data: { keyword, searchCount: current + 1 } })
})

export default router
