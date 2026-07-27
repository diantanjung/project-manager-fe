import { describe, expect, it, vi } from "vitest";
import { api } from "../lib/axios";
import { attachmentService } from "./attachment.service";

vi.mock("../lib/axios", () => ({
    api: {
        defaults: {
            baseURL: "http://localhost:8000/api/v1",
        },
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("attachmentService", () => {
    it("lists attachments from the task-scoped endpoint", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 9,
                        original_name: "brief.pdf",
                        downloadUrl: "http://localhost:8000/api/v1/attachments/9/download?expires=1&signature=abc",
                        mime_type: "application/pdf",
                        size: 2048,
                        task_id: 12,
                        uploader_id: 3,
                        created_at: "2026-01-01T00:00:00.000Z",
                        updated_at: "2026-01-01T00:00:00.000Z",
                    },
                ],
            },
        });

        const attachments = await attachmentService.getAttachments(12);

        expect(api.get).toHaveBeenCalledWith("/tasks/12/attachments");
        expect(attachments[0]).toMatchObject({
            id: 9,
            fileName: "brief.pdf",
            mimeType: "application/pdf",
            fileSize: 2048,
            taskId: 12,
            uploaderId: 3,
            downloadUrl: "http://localhost:8000/api/v1/attachments/9/download?expires=1&signature=abc",
        });
    });

    it("uploads a file to the task-scoped attachment endpoint", async () => {
        vi.mocked(api.post).mockResolvedValueOnce({
            data: {
                data: {
                    id: 10,
                    originalName: "notes.txt",
                    mimeType: "text/plain",
                    size: 14,
                    taskId: 12,
                    uploaderId: 3,
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                },
            },
        });

        const file = new File(["release notes"], "notes.txt", { type: "text/plain" });
        const attachment = await attachmentService.uploadAttachment(12, file);

        expect(api.post).toHaveBeenCalledWith(
            "/tasks/12/attachments",
            expect.any(FormData),
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        const formData = vi.mocked(api.post).mock.calls[0][1] as FormData;
        expect(formData.get("file")).toBe(file);
        expect(attachment).toMatchObject({
            id: 10,
            fileName: "notes.txt",
            mimeType: "text/plain",
            fileSize: 14,
            taskId: 12,
        });
    });

    it("builds an absolute backend download URL", () => {
        expect(attachmentService.getAttachmentDownloadUrl(10)).toBe(
            "http://localhost:8000/api/v1/attachments/10/download",
        );
    });

    it("builds an absolute backend view URL from a relative file URL", () => {
        expect(attachmentService.getAttachmentViewUrl({
            id: 10,
            fileUrl: "project/attachments/2/file.png",
        })).toBe("http://localhost:8000/project/attachments/2/file.png");
    });

    it("keeps an absolute attachment file URL unchanged", () => {
        expect(attachmentService.getAttachmentViewUrl({
            id: 10,
            fileUrl: "https://cdn.example.com/file.png",
        })).toBe("https://cdn.example.com/file.png");
    });

    it("downloads an attachment as a blob", async () => {
        const blob = new Blob(["attachment"], { type: "text/plain" });
        vi.mocked(api.get).mockResolvedValueOnce({ data: blob });

        const response = await attachmentService.downloadAttachment({ id: 10 });

        expect(api.get).toHaveBeenCalledWith("/attachments/10/download", {
            responseType: "blob",
        });
        expect(response).toBe(blob);
    });

    it("downloads an attachment from its signed download URL when present", async () => {
        const blob = new Blob(["attachment"], { type: "text/plain" });
        vi.mocked(api.get).mockResolvedValueOnce({ data: blob });

        const response = await attachmentService.downloadAttachment({
            id: 10,
            downloadUrl: "http://localhost:8000/api/v1/attachments/10/download?expires=1&signature=abc",
        });

        expect(api.get).toHaveBeenCalledWith(
            "http://localhost:8000/api/v1/attachments/10/download?expires=1&signature=abc",
            {
                responseType: "blob",
            },
        );
        expect(response).toBe(blob);
    });
});
