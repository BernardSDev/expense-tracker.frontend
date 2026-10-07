"use client";

import { useEffect, type ReactNode } from "react";

type ModalProps = {
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
};

export default function Modal({
                                  isOpen,
                                  title,
                                  description,
                                  onClose,
                                  children,
                              }: ModalProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-dark/40 backdrop-blur-[2px] sm:items-center sm:px-6 sm:py-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-lg rounded-t-[20px] border border-border bg-surface shadow-float sm:rounded-2xl">
                <div className="flex items-start justify-between gap-6 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                    <div className="min-w-0">
                        <h2
                            id="modal-title"
                            className="text-lg font-semibold tracking-[-0.01em] text-text-primary"
                        >
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-sm leading-6 text-text-secondary">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            className="h-[18px] w-[18px]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        >
                            <path d="M5 5l10 10M15 5L5 15" />
                        </svg>
                    </button>
                </div>

                <div className="border-t border-surface-muted px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pb-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
