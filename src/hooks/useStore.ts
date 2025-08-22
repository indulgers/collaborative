import { useStore as useZustandStore } from '../store'

// 简化的store hook
export const useStore = () => {
  return useZustandStore()
}

export default useStore
