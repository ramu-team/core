import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderHistoryItem {
  id: string;
  type: 'menu' | 'ai';
  title: string;
  description: string;
  timestamp: number;
}

interface UserState {
  activeSessionId: string | null;
  activeMachineId: string | null;
  lastActivityAt: number | null;
  history: OrderHistoryItem[];
  
  setSession: (sessionId: string, machineId?: string | null) => void;
  updateActivity: () => void;
  clearSession: () => void;
  addHistory: (item: OrderHistoryItem) => void;
  checkTimeout: () => boolean; // Returns true if timed out
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      activeSessionId: null,
      activeMachineId: null,
      lastActivityAt: null,
      history: [],

      setSession: (sessionId, machineId) => set((state) => ({ 
        activeSessionId: sessionId,
        activeMachineId: machineId || state.activeMachineId,
        lastActivityAt: Date.now()
      })),

      updateActivity: () => {
        if (get().activeSessionId) {
          set({ lastActivityAt: Date.now() });
        }
      },

      clearSession: () => set({ activeSessionId: null, activeMachineId: null, lastActivityAt: null }),

      addHistory: (item) => set((state) => ({
        history: [item, ...state.history] // Prepend new items
      })),

      checkTimeout: () => {
        const state = get();
        if (!state.activeSessionId || !state.lastActivityAt) return false;
        
        // 5 minutes = 300,000 ms
        const isExpired = Date.now() - state.lastActivityAt > 300000;
        if (isExpired) {
          set({ activeSessionId: null, activeMachineId: null, lastActivityAt: null });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'ramu-user-storage',
    }
  )
);
