import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UserList } from "./UserList";
import type { User } from "../../types/auth";

const users: User[] = [
    {
        id: 1,
        name: "Dian",
        email: "dian@example.com",
        role: "admin",
    },
];

describe("UserList", () => {
    afterEach(() => {
        cleanup();
    });

    it("uses shared table controls and pagination callbacks", () => {
        const onSearchChange = vi.fn();
        const onRoleChange = vi.fn();
        const onPageSizeChange = vi.fn();
        const onPageChange = vi.fn();

        render(
            <UserList
                users={users}
                isLoading={false}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
                onSort={vi.fn()}
                searchValue=""
                onSearchChange={onSearchChange}
                filters={[
                    {
                        label: "Role",
                        ariaLabel: "Filter by role",
                        value: "",
                        onChange: onRoleChange,
                        options: [
                            { label: "All Roles", value: "" },
                            { label: "Admin", value: "admin" },
                        ],
                    },
                ]}
                page={1}
                totalPages={2}
                totalItems={11}
                pageSize={10}
                pageSizeOptions={[10, 25]}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />,
        );

        fireEvent.change(screen.getByRole("searchbox", { name: "Search users" }), {
            target: { value: "dia" },
        });
        fireEvent.change(screen.getByLabelText("Filter by role"), {
            target: { value: "admin" },
        });
        fireEvent.change(screen.getByLabelText("Items per page"), {
            target: { value: "25" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Next page" }));

        expect(screen.getByText("Dian")).toBeInTheDocument();
        expect(screen.getByText("Showing 1-1 of 11 users")).toBeInTheDocument();
        expect(onSearchChange).toHaveBeenCalledWith("dia");
        expect(onRoleChange).toHaveBeenCalledWith("admin");
        expect(onPageSizeChange).toHaveBeenCalledWith(25);
        expect(onPageChange).toHaveBeenCalledWith(2);
    });
});
