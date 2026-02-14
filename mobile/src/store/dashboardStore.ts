import { create } from 'zustand';

export interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  cashFlow: number;
  forecast: number;
}

export interface DashboardState {
  financial: FinancialData | null;
  isLoading: boolean;
  error: string | null;
  setFinancial: (data: FinancialData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  syncTimestamp: number | null;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  financial: null,
  isLoading: false,
  error: null,
  syncTimestamp: null,
  setFinancial: (data) => set({ 
    financial: data,
    error: null,
    syncTimestamp: Date.now()
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ 
    financial: null, 
    isLoading: false, 
    error: null,
    syncTimestamp: null
  }),
}));

export interface AgentState {
  activeAgent: string | null;
  messages: Array<{ role: 'user' | 'agent'; text: string }>;
  setActiveAgent: (agent: string | null) => void;
  addMessage: (role: 'user' | 'agent', text: string) => void;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activeAgent: null,
  messages: [],
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  addMessage: (role, text) =>
    set((state) => ({
      messages: [...state.messages, { role, text }],
    })),
  clearMessages: () => set({ messages: [] }),
}));
