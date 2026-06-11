import express, { type Request, type Response } from 'express'
import { trashData } from '../data/trashData.js'
import { scanHistoryStore, type ScanHistoryItem } from '../store.js'

const router = express.Router()

const keywordMap: Record<string, string> = {
  'bottle': '矿泉水瓶',
  'plastic-bottle': '矿泉水瓶',
  'water-bottle': '矿泉水瓶',
  'can': '易拉罐',
  'paper': '报纸',
  'newspaper': '报纸',
  'book': '书本',
  'box': '纸箱',
  'glass': '玻璃瓶',
  'battery': '干电池',
  'medicine': '过期感冒药',
  'food': '剩菜剩饭',
  'vegetable': '菜叶',
  'fruit': '果皮',
  'cloth': '旧衣服',
  'clothes': '旧衣服',
  'plastic': '塑料盆',
  'metal': '金属厨具',
  'cup': '塑料杯',
  'plate': '玻璃器皿',
  'bag': '纸袋',
  'shoe': '旧鞋子',
  'hat': '旧帽子',
  'sock': '旧袜子',
  'towel': '旧毛巾',
  'sheet': '旧床单',
  'curtain': '旧窗帘',
  'pillow': '旧抱枕',
  'carpet': '旧地毯',
  'apron': '旧围裙',
  'sleeve': '旧袖套',
  'bag-cloth': '旧帆布袋',
  'notebook': '笔记本',
  'envelope': '信封',
  'card': '名片',
  'calendar': '日历',
  'magazine': '画册',
  'tissue': '卫生纸芯',
  'receipt': '快递面单',
  'draft': '草稿纸',
  'leaflet': '宣传单',
  'ticket': '票据',
  'desk-calendar': '台历',
  'storage': '塑料收纳盒',
  'hanger': '塑料衣架',
  'funnel': '塑料漏斗',
  'brush': '塑料刷子',
  'comb': '塑料梳子',
  'soap-box': '塑料肥皂盒',
  'tooth-cup': '塑料牙杯',
  'basket': '塑料菜篮',
  'bucket': '塑料水桶',
  'basin': '塑料洗脸盆',
  'seasoning-jar': '玻璃调料罐',
  'teacup': '玻璃茶杯',
  'fruit-plate': '玻璃果盘',
  'lampshade': '玻璃灯罩',
  'pot-lid': '玻璃锅盖',
  'cutting-board': '玻璃菜板',
  'spice-bottle': '玻璃调味瓶',
  'diffuser': '玻璃香薰瓶',
  'candle-holder': '玻璃蜡烛台',
  'jar': '玻璃密封罐',
  'thermos': '不锈钢保温杯',
  'cutlery': '不锈钢餐具',
  'ladder': '铝合金梯子',
  'hotpot': '铜制火锅',
  'rack': '铁质晾衣架',
  'knife': '不锈钢菜刀',
  'spatula': '不锈钢锅铲',
  'soup-spoon': '不锈钢汤勺',
  'pressure-cooker': '铝制高压锅',
  'lunch-box': '不锈钢饭盒',
  'jeans': '旧牛仔裤',
  'sweater': '旧毛衣',
  'scarf': '旧围巾',
  'gloves': '旧手套',
  'pillowcase': '旧枕套',
  'dish-waste': '剩菜剩饭',
  'vegetable-leaf': '菜叶',
  'fruit-peel': '果皮',
  'egg-shell': '蛋壳',
  'fish-bone': '鱼骨',
  'tea-leaf': '茶叶渣',
  'coffee-grounds': '咖啡渣',
  'sugar-cane': '甘蔗渣',
  'rice': '剩饭',
  'noodle': '面条',
  'bone-small': '小骨头',
  'shrimp-shell': '虾壳',
  'crab-shell': '蟹壳',
  'vegetable-root': '菜根',
  'flower': '花卉绿植',
  'traditional-medicine': '中药渣',
  'napkin': '餐巾纸',
  'toilet-paper': '卫生纸',
  'disposable-diaper': '尿不湿',
  'cigarette': '烟蒂',
  'ceramic': '破损陶瓷',
  'bone-big': '大骨头',
  'coconut-shell': '椰子壳',
  'durian-shell': '榴莲壳',
  'pencil': '铅笔',
  'ballpoint-pen': '圆珠笔',
  'eraser': '橡皮擦',
  'tape': '透明胶带',
  'stapler': '订书机',
  'glue': '胶水',
  'sponge': '海绵',
  'rag': '抹布',
  'feather': '羽毛',
  'hair': '毛发',
  'dust': '尘土',
  'ashtray': '烟灰缸',
  'lighter': '打火机',
  'candle': '蜡烛',
  'match': '火柴',
  'band-aid': '创可贴',
  'mask': '口罩',
  'gloves-medical': '医用手套',
  'button-cell': '纽扣电池',
  'rechargeable': '充电电池',
  'lithium': '锂电池',
  'phone-battery': '手机电池',
  'ebike-battery': '电动车电池',
  'cold-medicine': '过期感冒药',
  'antibiotic': '过期消炎药',
  'fever-medicine': '过期退烧药',
  'painkiller': '过期止痛药',
  'ointment': '过期药膏',
  'pill': '过期药片',
  'capsule': '过期胶囊',
  'medicine-bottle': '过期药瓶',
  'syringe': '注射器',
  'mercury-thermometer': '水银温度计',
  'blood-pressure-monitor': '血压计',
  'paint': '废油漆',
  'paint-thinner': '稀料',
  'pesticide': '废杀虫剂',
  'disinfectant': '消毒剂',
  'rat-poison': '灭鼠药',
  'insecticide': '杀虫药',
  'x-ray': 'X光片',
  'photo-film': '感光胶片',
  'fluorescent-lamp': '荧光灯管',
  'led-lamp': 'LED灯泡',
  'thermometer': '体温计',
  'blood-glucose-meter': '血糖仪',
}

router.post('/recognize', (req: Request, res: Response): void => {
  const { fileName } = req.body

  if (!fileName) {
    res.status(400).json({
      success: false,
      error: '缺少文件名参数',
    })
    return
  }

  const lowerFileName = fileName.toLowerCase()
  let matchedItem = null
  let confidence = 0

  for (const [keyword, itemName] of Object.entries(keywordMap)) {
    if (lowerFileName.includes(keyword)) {
      const item = trashData.find((t) => t.name === itemName)
      if (item) {
        matchedItem = item
        confidence = Math.floor(Math.random() * 20) + 80
        break
      }
    }
  }

  const historyItem: ScanHistoryItem = {
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    imageFileName: fileName,
    result: matchedItem
      ? {
          itemId: matchedItem.id,
          itemName: matchedItem.name,
          category: matchedItem.category,
          categoryName: matchedItem.categoryName,
          confidence,
        }
      : null,
    timestamp: new Date().toISOString(),
  }

  scanHistoryStore.unshift(historyItem)

  res.json({
    success: true,
    data: {
      recognized: !!matchedItem,
      result: matchedItem
        ? {
            ...matchedItem,
            confidence,
          }
        : null,
      historyId: historyItem.id,
    },
  })
})

router.get('/history', (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: scanHistoryStore.slice(0, 50),
  })
})

export default router
