import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface GroceryItem {
  id: string
  name: string
  aisle: string
  quantity?: string
  quantity_unit?: string
  checked: boolean
}

interface GroceryState {
  items: Record<string, GroceryItem[]>  // Organized by aisle
  messages: { role: string; content: string }[]
  darkMode: boolean
  addItems: (aisle: string, newItems: GroceryItem[]) => void
  updateItem: (aisle: string, itemId: string, checked: boolean) => void
  removeItem: (aisle: string, itemId: string) => void
  addMessage: (role: string, content: string) => void
  clearMessages: () => void
  toggleDarkMode: () => void
  setItems: (items: Record<string, GroceryItem[]>) => void
}

export const useGroceryStore = create<GroceryState>()(
  devtools(
    persist(
      (set) => ({
        items: {},
        messages: [],
        darkMode: true,

        addItems: (aisle, newItems) =>
          set((state) => ({
            items: {
              ...state.items,
              [aisle]: [...(state.items[aisle] || []), ...newItems],
            },
          })),

        updateItem: (aisle, itemId, checked) =>
          set((state) => ({
            items: {
              ...state.items,
              [aisle]: state.items[aisle].map((item) =>
                item.id === itemId ? { ...item, checked } : item
              ),
            },
          })),

        removeItem: (aisle, itemId) =>
          set((state) => {
            const updatedAisleItems = state.items[aisle].filter(
              (item) => item.id !== itemId
            )
            
            // If the aisle is now empty, remove it
            const updatedItems = { ...state.items }
            if (updatedAisleItems.length === 0) {
              delete updatedItems[aisle]
            } else {
              updatedItems[aisle] = updatedAisleItems
            }
            
            return { items: updatedItems }
          }),

        addMessage: (role, content) =>
          set((state) => ({
            messages: [...state.messages, { role, content }],
          })),

        clearMessages: () => set({ messages: [] }),

        toggleDarkMode: () =>
          set((state) => ({ darkMode: !state.darkMode })),

        setItems: (items) => set({ items }),
      }),
      {
        name: 'grocery-store',
        partialize: (state) => ({
          items: state.items,
          darkMode: state.darkMode,
        }),
      }
    )
  )
)
