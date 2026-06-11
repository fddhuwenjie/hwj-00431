import { initialData } from './data/initialData.js'

export const searchLogMap: Map<string, number> = new Map(
  initialData.hotSearches.map(h => [h.keyword, h.searchCount])
)

export const contributionsStore = [...initialData.contributions]
export const feedbacksStore = [...initialData.feedbacks]
export const wrongAnswersStore = [...initialData.wrongAnswers]
export const quizScoresStore = [...initialData.quizScores]

export const userWrongBook: Map<string, Array<{
  trashItemId: string
  trashItemName: string
  correctCategory: string
  wrongCategory: string
  timestamp: string
}>> = new Map()

export const cityCategoryMap: Record<string, Record<string, string>> = {
  beijing: { recyclable: '可回收物', hazardous: '有害垃圾', kitchen: '厨余垃圾', other: '其他垃圾' },
  shanghai: { recyclable: '可回收物', hazardous: '有害垃圾', kitchen: '湿垃圾', other: '干垃圾' },
  guangzhou: { recyclable: '可回收物', hazardous: '有害垃圾', kitchen: '餐厨垃圾', other: '其他垃圾' }
}

export const cityNameMap: Record<string, string> = {
  beijing: '北京',
  shanghai: '上海',
  guangzhou: '广州'
}

export const categoryKeyToName: Record<string, string> = {
  recyclable: '可回收物',
  hazardous: '有害垃圾',
  kitchen: '厨余垃圾',
  other: '其他垃圾'
}

export const chineseToKey: Record<string, string> = {
  '可回收物': 'recyclable',
  '有害垃圾': 'hazardous',
  '厨余垃圾': 'kitchen',
  '其他垃圾': 'other',
  '湿垃圾': 'kitchen',
  '干垃圾': 'other',
  '餐厨垃圾': 'kitchen'
}
