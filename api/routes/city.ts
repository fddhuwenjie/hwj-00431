import { Router, type Request, type Response } from 'express'
import { initialData } from '../data/initialData.js'
import { cityCategoryMap, cityNameMap, chineseToKey } from '../store.js'

const router = Router()

router.get('/rules', (req: Request, res: Response): void => {
  res.json({ success: true, data: initialData.cityRules })
})

router.get('/rules/:city', (req: Request, res: Response): void => {
  const { city } = req.params
  const chineseName = cityNameMap[city]

  if (!chineseName) {
    res.json({ success: false, error: '不支持的城市' })
    return
  }

  const rules = initialData.cityRules.find(r => r.cityName === chineseName)

  if (!rules) {
    res.json({ success: false, error: '未找到该城市的分类规则' })
    return
  }

  res.json({ success: true, data: rules })
})

router.get('/translate', (req: Request, res: Response): void => {
  const city = req.query.city as string
  const category = req.query.category as string

  if (!city || !category) {
    res.json({ success: false, error: '缺少城市或分类参数' })
    return
  }

  const categoryMap = cityCategoryMap[city]
  if (!categoryMap) {
    res.json({ success: false, error: '不支持的城市' })
    return
  }

  const standardKey = chineseToKey[category] || category
  const translated = categoryMap[standardKey]

  if (!translated) {
    res.json({ success: false, error: '无法识别的分类' })
    return
  }

  res.json({
    success: true,
    data: {
      original: category,
      standardKey,
      translated,
      city: cityNameMap[city] || city
    }
  })
})

export default router
