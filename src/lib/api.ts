export type Category = 'recyclable' | 'hazardous' | 'kitchen' | 'other'

export interface TrashItem {
  id: string
  name: string
  category: Category
  categoryName: string
  subCategory: string
  disposalMethod: string
  precautions: string
  isCommonMisclassification: boolean
  correctExplanation: string
  synonyms: string[]
}

export interface SearchResult {
  items: TrashItem[]
  total: number
  page: number
  limit: number
}

export interface CategoryGroup {
  subCategory: string
  items: TrashItem[]
}

export interface CategoryBrowseResult {
  category: string
  categoryName: string
  subCategories: CategoryGroup[]
  total: number
  cityRules?: string[]
}

export interface QuizQuestion {
  id: string
  name: string
  category: Category
  categoryName: string
  subCategory: string
  disposalMethod: string
  precautions: string
  isCommonMisclassification: boolean
  correctExplanation: string
  synonyms: string[]
}

export interface QuizAnswerPayload {
  trashItemId: string
  selectedCategory: string
  userId: string
}

export interface LeaderboardEntry {
  userId: string
  username: string
  score: number
  correctRate: number
  streak: number
}

export interface WrongBookItem {
  id: string
  trashItemId: string
  trashItemName: string
  correctCategory: string
  wrongCategory: string
  wrongCount: number
}

export interface Tip {
  id: string
  title: string
  content: string
  image: string
}

export interface GuideStep {
  step: number
  action: string
  category: string
}

export interface Guide {
  id: string
  title: string
  steps: GuideStep[]
  image: string
}

export interface Contribution {
  id: string
  userId: string
  itemName: string
  category: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  points: number
  createdAt: string
  reviewNote: string
  username?: string
  subCategory?: string
}

export interface Feedback {
  id: string
  userId: string
  type: string
  title: string
  description: string
  trashItemId: string | null
  status: 'pending' | 'processing' | 'resolved'
  createdAt: string
  resolvedAt: string | null
}

export interface HotSearch {
  id: string
  keyword: string
  searchCount: number
  trend: 'up' | 'down' | 'stable'
  updatedAt: string
}

export interface CityRule {
  id: string
  cityName: string
  categories: string[]
  specialRules: string[]
}

export interface AdminStats {
  totalItems: number
  totalSearches: number
  totalQuizzes: number
  totalUsers: number
  categoryDistribution: { category: string; categoryName: string; count: number }[]
  quizAccuracy?: number
}

export interface UserActivity {
  date: string
  searches: number
  quizzes: number
  contributions: number
}

export interface ScanResult {
  recognized: boolean
  result: (TrashItem & { confidence: number }) | null
  historyId: string
}

export interface ScanHistoryItem {
  id: string
  imageFileName: string
  result: {
    itemId: string
    itemName: string
    category: string
    categoryName: string
    confidence: number
  } | null
  timestamp: string
}

export interface ChallengeQuestion {
  id: string
  name: string
  category: string
  categoryName: string
  options: string[]
  correctOption: number
}

export interface DailyChallenge {
  date: string
  questions: ChallengeQuestion[]
  totalQuestions: number
  timeLimit: number
}

export interface ChallengeSubmitResult {
  score: number
  correctCount: number
  totalQuestions: number
  timeUsed: number
  correctRate: number
  rank: number
  totalPlayers: number
  beatPercent: number
}

export interface ChallengeLeaderboardEntry {
  id: string
  userId: string
  username: string
  date: string
  score: number
  correctCount: number
  totalQuestions: number
  timeUsed: number
  correctRate: number
  rank: number
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error || '请求失败')
  return json.data as T
}

export const api = {
  search: (q: string, page = 1, limit = 20) =>
    request<SearchResult>(`/api/trash/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),

  getByCategory: async (category: string, city?: string) => {
    const result = await request<CategoryBrowseResult>(`/api/trash/category/${category}${city ? `?city=${city}` : ''}`)
    return Array.isArray(result.subCategories) ? result.subCategories : []
  },

  getItem: (id: string) =>
    request<TrashItem>(`/api/trash/${id}`),

  getSubcategories: (category: string) =>
    request<string[]>(`/api/trash/subcategories/${category}`),

  getQuizQuestions: (count = 10, city?: string) =>
    request<QuizQuestion[]>(`/api/quiz/random?count=${count}${city ? `&city=${city}` : ''}`),

  submitAnswer: (payload: QuizAnswerPayload) =>
    request<any>('/api/quiz/answer', { method: 'POST', body: JSON.stringify(payload) }),

  getLeaderboard: (type: 'weekly' | 'total' = 'total') =>
    request<LeaderboardEntry[]>(`/api/quiz/leaderboard?type=${type}`),

  getWrongBook: (userId: string) =>
    request<WrongBookItem[]>(`/api/quiz/wrong-book/${userId}`),

  clearWrongBook: (userId: string) =>
    request<any>(`/api/quiz/wrong-book/${userId}/clear`, { method: 'POST' }),

  getDailyTip: () =>
    request<Tip>('/api/tips/daily'),

  getAllTips: () =>
    request<Tip[]>('/api/tips/all'),

  getGuides: () =>
    request<Guide[]>('/api/tips/guides'),

  getGuide: (id: string) =>
    request<Guide>(`/api/tips/guides/${id}`),

  submitContribution: (payload: { userId: string; itemName: string; category: string; description: string; subCategory: string }) =>
    request<any>('/api/contribution', { method: 'POST', body: JSON.stringify(payload) }),

  getAllContributions: () =>
    request<Contribution[]>('/api/contribution/all'),

  getPendingContributions: () =>
    request<Contribution[]>('/api/contribution/pending'),

  approveContribution: (id: string) =>
    request<any>(`/api/contribution/${id}/approve`, { method: 'PUT' }),

  rejectContribution: (id: string, reviewNote: string) =>
    request<any>(`/api/contribution/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reviewNote }) }),

  getContributionLeaderboard: () =>
    request<LeaderboardEntry[]>('/api/contribution/leaderboard'),

  submitFeedback: (payload: { userId: string; type: string; title: string; description: string; trashItemId?: string }) =>
    request<any>('/api/feedback', { method: 'POST', body: JSON.stringify(payload) }),

  getAllFeedback: () =>
    request<Feedback[]>('/api/feedback/all'),

  resolveFeedback: (id: string) =>
    request<any>(`/api/feedback/${id}/resolve`, { method: 'PUT' }),

  getAdminStats: () =>
    request<AdminStats>('/api/admin/stats'),

  getHotSearches: () =>
    request<HotSearch[]>('/api/admin/hot-searches'),

  getQuizStats: () =>
    request<WrongBookItem[]>('/api/admin/quiz-stats'),

  getUserActivity: () =>
    request<UserActivity[]>('/api/admin/user-activity'),

  getCityRules: () =>
    request<CityRule[]>('/api/city/rules'),

  getCityRule: (city: string) =>
    request<CityRule>(`/api/city/rules/${city}`),

  getCategoryTranslate: (city?: string, category?: string) =>
    request<any>(`/api/city/translate?city=${city || ''}&category=${category || ''}`),

  scanRecognize: (fileName: string) =>
    request<ScanResult>('/api/scan/recognize', { method: 'POST', body: JSON.stringify({ fileName }) }),

  getScanHistory: () =>
    request<ScanHistoryItem[]>('/api/scan/history'),

  getDailyChallenge: () =>
    request<DailyChallenge>('/api/challenge/daily'),

  submitChallenge: (payload: { userId: string; username: string; score: number; correctCount: number; totalQuestions: number; timeUsed: number; correctRate: number }) =>
    request<ChallengeSubmitResult>('/api/challenge/submit', { method: 'POST', body: JSON.stringify(payload) }),

  getChallengeLeaderboard: (date?: string) =>
    request<{ date: string; leaderboard: ChallengeLeaderboardEntry[] }>(`/api/challenge/leaderboard${date ? `?date=${date}` : ''}`),

  getItemsByIds: (ids: string[]) =>
    request<TrashItem[]>(`/api/trash/batch?ids=${ids.join(',')}`),
}
