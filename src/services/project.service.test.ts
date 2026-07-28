import { describe, expect, it, vi } from "vitest";
import { api } from "../lib/axios";
import { projectService } from "./project.service";

vi.mock("../lib/axios", () => ({
    api: {
        get: vi.fn(),
    },
}));

describe("projectService", () => {
    it("fetches sidebar projects with open task counts from the sidebar endpoint", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, name: "Alpha", openTaskCount: 2 },
                    { id: 2, name: "Beta", openTaskCount: 0 },
                ],
            },
        });

        const projects = await projectService.getSidebarProjects();

        expect(api.get).toHaveBeenCalledWith("/projects/sidebar");
        expect(projects).toEqual([
            { id: 1, name: "Alpha", openTaskCount: 2 },
            { id: 2, name: "Beta", openTaskCount: 0 },
        ]);
    });
});
