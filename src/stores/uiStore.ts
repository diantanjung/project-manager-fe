import { create } from 'zustand';
import type { ReactNode } from 'react';

interface HeaderState {
    title: string;
    description: string;
    rightContent?: ReactNode;
}

interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    header: HeaderState | null;
    setHeader: (header: HeaderState) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    header: null,
    setHeader: (header) => set({ header }),
}));
