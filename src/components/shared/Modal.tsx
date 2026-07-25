import type { ReactNode } from "react";
import { MdClose } from "react-icons/md";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    subtitle?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    maxWidthClassName?: string;
    panelClassName?: string;
    contentClassName?: string;
    showHeaderDivider?: boolean;
    "aria-label"?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    maxWidthClassName = "max-w-md",
    panelClassName = "",
    contentClassName = "p-6",
    showHeaderDivider = true,
    "aria-label": ariaLabel,
}: ModalProps) {
    if (!isOpen) return null;

    const hasHeader = Boolean(title || subtitle);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            data-testid="modal-backdrop"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel || (typeof title === "string" ? title : "Dialog")}
                className={`relative bg-white rounded-2xl w-full ${maxWidthClassName} shadow-2xl animate-in fade-in zoom-in duration-200 ${panelClassName}`}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                    <MdClose className="text-xl" aria-hidden="true" />
                </button>

                {hasHeader && (
                    <div
                        className={`p-6 pr-14 ${showHeaderDivider ? "border-b border-gray-100" : ""}`}
                    >
                        {title && (
                            <h2 className="text-xl font-bold text-text-main-light">{title}</h2>
                        )}
                        {subtitle && (
                            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                )}

                <div className={contentClassName}>{children}</div>

                {footer && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
