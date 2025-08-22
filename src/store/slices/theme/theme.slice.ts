import type { StateCreator } from 'zustand'

export interface ThemeSlice {
  mode: 'light' | 'dark' | 'system'
  preferredMode: 'light' | 'dark'
  setMode: (mode?: 'light' | 'dark' | 'system') => void
  setPreferredMode: (mode: 'light' | 'dark') => void
}

const initialState = {
  mode: 'light' as const,
  preferredMode: 'light' as const,
}

export const themeSlice: StateCreator<ThemeSlice> = (set, get) => ({
  ...initialState,
  setMode: (mode) => {
    const currentMode = get().mode
    const nextMode = mode ?? (currentMode === 'light' ? 'dark' : currentMode === 'dark' ? 'system' : 'light')
    
    // 简化的模式设置，不依赖cookie
    const preferredMode = nextMode === 'system' ? 'light' : nextMode as 'light' | 'dark'
    
    set({ mode: nextMode, preferredMode })
  },
  setPreferredMode: (preferredMode) => {
    if (get().mode !== 'system') return
    set({ preferredMode })
  },
})
