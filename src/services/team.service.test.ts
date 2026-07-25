import { describe, expect, it, vi } from "vitest";
import { api } from "../lib/axios";
import { teamService } from "./team.service";

vi.mock("../lib/axios", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe("teamService", () => {
    it("maps Laravel user resources into team members", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 25,
                        name: "Jane Member",
                        email: "jane@example.com",
                        membership: {
                            role: "admin",
                            joinedAt: "2026-07-24T10:00:00.000000Z",
                        },
                    },
                ],
            },
        });

        const members = await teamService.getTeamMembers(10);

        expect(api.get).toHaveBeenCalledWith("/teams/10/members");
        expect(members).toEqual([
            {
                id: 25,
                userId: 25,
                userName: "Jane Member",
                userEmail: "jane@example.com",
                role: "admin",
                joinedAt: "2026-07-24T10:00:00.000000Z",
            },
        ]);
    });

    it("sends user_id when adding a team member", async () => {
        vi.mocked(api.post).mockResolvedValueOnce({ data: { ok: true } });

        await teamService.addTeamMember(10, 25);

        expect(api.post).toHaveBeenCalledWith("/teams/10/members", {
            user_id: 25,
            role: "member",
        });
    });
});
