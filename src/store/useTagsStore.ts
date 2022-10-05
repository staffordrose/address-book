import create from "zustand"
import { ContactTag } from "@/common/types"
import { getAllContactTags } from "@/lib/supabase"

type State = {
  tags: ContactTag[]
  isLoading: boolean
  error: Error | null
  fetchTags: () => void
  clearTags: () => void
}

const useTagsStore = create<State>((set) => ({
  tags: [],
  isLoading: false,
  error: null,
  fetchTags: async () => {
    set({ isLoading: true })

    try {
      const tags = await getAllContactTags()
      set({ tags })
    } catch (error: any) {
      set({ error })
    } finally {
      set({ isLoading: false })
    }
  },
  clearTags: () => set({ tags: [] }),
}))

export default useTagsStore
