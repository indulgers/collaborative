import { create } from 'zustand'
import { themeSlice, ThemeSlice } from './slices/theme/theme.slice'

export type StoreState = ThemeSlice

export const useStore = create<StoreState>()((...args) => ({
  ...themeSlice(...args),
}))
