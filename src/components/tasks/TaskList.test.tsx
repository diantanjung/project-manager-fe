import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TaskList } from "./TaskList";
import type { Task } from "../../types/task";

const makeTask = (
    id: number,
    overrides: Partial<Task> = {},
): Task => ({
    id,
    title: `Task ${id}`,
    description: null,
    status: "todo",
    priority: "medium",
    projectId: 1,
    creatorId: 1,
    assigneeId: 10 + id,
    assigneeName: `Assignee ${id}`,
    dueDate: null,
    position: id,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
});

const renderTaskList = (overrides: Partial<ComponentProps<typeof TaskList>> = {}) => {
    const props: ComponentProps<typeof TaskList> = {
        tasks: [makeTask(1), makeTask(2)],
        onTaskClick: vi.fn(),
        isLoading: false,
        searchValue: "",
        onSearchChange: vi.fn(),
        statusFilter: "",
        onStatusFilterChange: vi.fn(),
        priorityFilter: "",
        onPriorityFilterChange: vi.fn(),
        page: 1,
        totalPages: 2,
        totalItems: 12,
        pageSize: 10,
        pageSizeOptions: [10, 25, 50],
        onPageChange: vi.fn(),
        onPageSizeChange: vi.fn(),
        ...overrides,
    };

    render(<TaskList {...props} />);

    return props;
};

describe("TaskList", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders the current task page and pagination metadata from props", () => {
        renderTaskList({
            tasks: [makeTask(11), makeTask(12)],
            page: 2,
            totalPages: 2,
            totalItems: 12,
        });

        expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
        expect(screen.getByText("Task 11")).toBeInTheDocument();
        expect(screen.getByText("Task 12")).toBeInTheDocument();
        expect(screen.getByText("Showing 11-12 of 12 tasks")).toBeInTheDocument();
        expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });

    it("emits search, status, priority, page size, and page changes", () => {
        const props = renderTaskList();

        fireEvent.change(screen.getByRole("searchbox", { name: "Search tasks" }), {
            target: { value: "api" },
        });
        fireEvent.change(screen.getByLabelText("Filter by status"), {
            target: { value: "done" },
        });
        fireEvent.change(screen.getByLabelText("Filter by priority"), {
            target: { value: "urgent" },
        });
        fireEvent.change(screen.getByLabelText("Items per page"), {
            target: { value: "25" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Next page" }));

        expect(props.onSearchChange).toHaveBeenCalledWith("api");
        expect(props.onStatusFilterChange).toHaveBeenCalledWith("done");
        expect(props.onPriorityFilterChange).toHaveBeenCalledWith("urgent");
        expect(props.onPageSizeChange).toHaveBeenCalledWith(25);
        expect(props.onPageChange).toHaveBeenCalledWith(2);
    });

    it("keeps row click behavior", () => {
        const onTaskClick = vi.fn();
        const selectedTask = makeTask(2, { title: "Selected task" });

        renderTaskList({
            tasks: [makeTask(1), selectedTask],
            onTaskClick,
        });
        fireEvent.click(screen.getByText("Selected task"));

        expect(onTaskClick).toHaveBeenCalledWith(selectedTask);
    });

    it("shows a filtered empty state when filters are active", () => {
        renderTaskList({
            tasks: [],
            searchValue: "missing",
            totalItems: 0,
            totalPages: 1,
        });

        expect(screen.getByText("No tasks match your filters")).toBeInTheDocument();
        expect(screen.getByText("Showing 0-0 of 0 tasks")).toBeInTheDocument();
    });

    it("keeps controls visible while loading the table body", () => {
        renderTaskList({
            isLoading: true,
            searchValue: "release",
        });

        expect(screen.getByRole("searchbox", { name: "Search tasks" })).toHaveValue("release");
        expect(screen.getByLabelText("Filter by status")).toBeInTheDocument();
        expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
        expect(screen.getByText("Showing 1-2 of 12 tasks")).toBeInTheDocument();
    });
});
