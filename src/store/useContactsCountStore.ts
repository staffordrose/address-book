import create from "zustand"
import { getContactsCount } from "@/lib/supabase"

type State = {
  count: number
  isLoading: boolean
  error: Error | null
  fetchCount: () => void
  resetCount: () => void
}

const useContactsCountStore = create<State>((set) => ({
  count: 0,
  isLoading: false,
  error: null,
  fetchCount: async () => {
    set({ isLoading: true })

    try {
      const count = await getContactsCount()
      set({ count })
    } catch (error: any) {
      set({ error })
    } finally {
      set({ isLoading: false })
    }
  },
  resetCount: () => set({ count: 0 }),
}))

export default useContactsCountStore
