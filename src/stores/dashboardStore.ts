import { create } from "zustand";
import { dashboardService, type DashboardSummary } from "../services/dashboard.service";
import { getApiErrorMessage } from "../utils/apiError";

interface DashboardState {
    summary: DashboardSummary | null;
    lastFetchedAt: number | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    fetchDashboard: () => Promise<void>;
    reset: () => void;
}

let inFlightRequest: Promise<void> | null = null;

export const useDashboardStore = create<DashboardState>((set, get) => ({
    summary: null,
    lastFetchedAt: null,
    isLoading: false,
    isRefreshing: false,
    error: null,

    fetchDashboard: async () => {
        if (inFlightRequest) return inFlightRequest;

        const hasCachedSummary = get().summary !== null;
        set({
            isLoading: !hasCachedSummary,
            isRefreshing: hasCachedSummary,
            error: null,
        });

        inFlightRequest = dashboardService.getDashboard()
            .then((summary) => {
                set({
                    summary,
                    lastFetchedAt: Date.now(),
                    isLoading: false,
                    isRefreshing: false,
                    error: null,
                });
            })
            .catch((err: unknown) => {
                set({
                    isLoading: false,
                    isRefreshing: false,
                    error: getApiErrorMessage(err, "Dashboard belum bisa memuat data."),
                });
            })
            .finally(() => {
                inFlightRequest = null;
            });

        return inFlightRequest;
    },

    reset: () => {
        inFlightRequest = null;
        set({
            summary: null,
            lastFetchedAt: null,
            isLoading: false,
            isRefreshing: false,
            error: null,
        });
    },
}));
