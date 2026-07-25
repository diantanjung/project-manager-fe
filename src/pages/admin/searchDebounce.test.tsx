import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Teams } from "./Teams";
import { Users } from "./Users";

const userSetParams = vi.fn();
const teamSetParams = vi.fn();

vi.mock("../../stores/userStore", () => ({
    useUserStore: () => ({
        users: [],
        isLoading: false,
        error: null,
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10,
        filters: {},
        setParams: userSetParams,
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
        setError: vi.fn(),
    }),
}));

vi.mock("../../stores/teamStore", () => ({
    useTeamStore: () => ({
        teams: [],
        isLoading: false,
        error: null,
        page: 1,
        totalPages: 1,
        filters: {},
        setParams: teamSetParams,
        createTeam: vi.fn(),
        updateTeam: vi.fn(),
        deleteTeam: vi.fn(),
        setError: vi.fn(),
    }),
}));

vi.mock("../../components/users/UserList", () => ({
    UserList: () => <div data-testid="user-list" />,
}));

vi.mock("../../components/users/UserDialog", () => ({
    UserDialog: () => null,
}));

vi.mock("../../components/teams/TeamList", () => ({
    TeamList: () => <div data-testid="team-list" />,
}));

vi.mock("../../components/teams/TeamDialog", () => ({
    TeamDialog: () => null,
}));

vi.mock("../../components/teams/TeamMembersDialog", () => ({
    TeamMembersDialog: () => null,
}));

function renderRoute(element: React.ReactElement) {
    return render(
        <MemoryRouter initialEntries={["/admin"]}>
            <Routes>
                <Route path="/admin" element={element} />
            </Routes>
        </MemoryRouter>
    );
}

describe("admin search debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        userSetParams.mockClear();
        teamSetParams.mockClear();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("waits until user search typing stops before syncing params", async () => {
        renderRoute(<Users />);

        expect(userSetParams).toHaveBeenCalledTimes(1);

        const searchInput = screen.getByPlaceholderText("Search users...");
        fireEvent.change(searchInput, { target: { value: "a" } });
        fireEvent.change(searchInput, { target: { value: "al" } });
        fireEvent.change(searchInput, { target: { value: "ali" } });

        act(() => {
            vi.advanceTimersByTime(499);
        });

        expect(userSetParams).toHaveBeenCalledTimes(1);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(userSetParams).toHaveBeenCalledTimes(2);
        expect(userSetParams).toHaveBeenLastCalledWith({
            page: 1,
            limit: 10,
            filters: {
                search: "ali",
                role: undefined,
                sortBy: undefined,
                order: undefined,
            },
        });
    });

    it("waits until team search typing stops before syncing params", async () => {
        renderRoute(<Teams />);

        expect(teamSetParams).toHaveBeenCalledTimes(1);

        const searchInput = screen.getByPlaceholderText("Search teams...");
        fireEvent.change(searchInput, { target: { value: "p" } });
        fireEvent.change(searchInput, { target: { value: "pl" } });
        fireEvent.change(searchInput, { target: { value: "pla" } });

        act(() => {
            vi.advanceTimersByTime(499);
        });

        expect(teamSetParams).toHaveBeenCalledTimes(1);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(teamSetParams).toHaveBeenCalledTimes(2);
        expect(teamSetParams).toHaveBeenLastCalledWith({
            page: 1,
            filters: {
                search: "pla",
                sortBy: undefined,
                order: undefined,
            },
        });
    });
});
