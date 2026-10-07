"use client";

import type { ReactNode } from "react";

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
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="w-full max-w-xl border border-border bg-surface shadow-2xl">
                <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-5 sm:px-7">
                    <div className="min-w-0">
                        <h2
                            id="modal-title"
                            className="text-lg font-semibold tracking-tight text-text-primary"
                        >
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-xl leading-none text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                    >
                        ×
                    </button>
                </div>

                <div className="px-6 py-6 sm:px-7 sm:py-7">
                    {children}
                </div>
            </div>
        </div>
    );
}