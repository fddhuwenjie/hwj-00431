import { create } from 'zustand'

type City = 'beijing' | 'shanghai' | 'guangzhou'

interface User {
  id: string
  username: string
}

interface QuizQuestion {
  id: string
  name: string
  category: 'recyclable' | 'hazardous' | 'kitchen' | 'other'
  categoryName: string
  subCategory: string
  disposalMethod: string
  precautions: string
  isCommonMisclassification: boolean
  correctExplanation: string
  synonyms: string[]
}

interface QuizState {
  score: number
  streak: number
  totalAnswered: number
  correctCount: number
  currentQuestions: QuizQuestion[]
  currentIndex: number
}

interface WrongBookItem {
  id: string
  trashItemId: string
  trashItemName: string
  correctCategory: string
  wrongCategory: string
  wrongCount: number
}

interface AppState {
  currentUser: User | null
  currentCity: City
  searchHistory: string[]
  quizState: QuizState
  wrongBook: WrongBookItem[]
  theme: 'light' | 'dark'
  sidebarOpen: boolean

  setUser: (user: User | null) => void
  setCity: (city: City) => void
  addSearchHistory: (keyword: string) => void
  updateQuizState: (partial: Partial<QuizState>) => void
  resetQuiz: () => void
  addToWrongBook: (item: WrongBookItem) => void
  removeFromWrongBook: (id: string) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

const initialQuizState: QuizState = {
  score: 0,
  streak: 0,
  totalAnswered: 0,
  correctCount: 0,
  currentQuestions: [],
  currentIndex: 0,
}

export const useStore = create<AppState>((set) => ({
  currentUser: { id: 'user-001', username: '环保达人小明' },
  currentCity: 'beijing',
  searchHistory: [],
  quizState: initialQuizState,
  wrongBook: [],
  theme: 'light',
  sidebarOpen: false,

  setUser: (user) => set({ currentUser: user }),
  setCity: (city) => set({ currentCity: city }),
  addSearchHistory: (keyword) =>
    set((state) => ({
      searchHistory: [
        keyword,
        ...state.searchHistory.filter((k) => k !== keyword),
      ].slice(0, 20),
    })),
  updateQuizState: (partial) =>
    set((state) => ({
      quizState: { ...state.quizState, ...partial },
    })),
  resetQuiz: () => set({ quizState: initialQuizState }),
  addToWrongBook: (item) =>
    set((state) => ({
      wrongBook: [
        item,
        ...state.wrongBook.filter((w) => w.trashItemId !== item.trashItemId),
      ],
    })),
  removeFromWrongBook: (id) =>
    set((state) => ({
      wrongBook: state.wrongBook.filter((w) => w.id !== id),
    })),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
