import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
    afterEach(() => {
        cleanup();
    });

    it("does not render when closed", () => {
        render(
            <Modal isOpen={false} onClose={vi.fn()} title="Create Item">
                <div>Modal content</div>
            </Modal>
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders title and content when open", () => {
        render(
            <Modal isOpen onClose={vi.fn()} title="Create Item">
                <div>Modal content</div>
            </Modal>
        );

        expect(screen.getByRole("dialog", { name: "Create Item" })).toBeInTheDocument();
        expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("closes when the X button is clicked", () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen onClose={onClose} title="Create Item">
                <div>Modal content</div>
            </Modal>
        );

        fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes when the backdrop is clicked", () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen onClose={onClose} title="Create Item">
                <div>Modal content</div>
            </Modal>
        );

        fireEvent.click(screen.getByTestId("modal-backdrop"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("keeps the modal open when content is clicked", () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen onClose={onClose} title="Create Item">
                <button type="button">Inside action</button>
            </Modal>
        );

        fireEvent.click(screen.getByRole("button", { name: "Inside action" }));

        expect(onClose).not.toHaveBeenCalled();
    });
});
