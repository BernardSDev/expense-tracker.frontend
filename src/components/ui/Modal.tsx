"use client";

import type { ReactNode } from "react";

type ModalProps = {
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
};

function Modal({
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="w-full max-w-lg border border-border bg-surface shadow-xl">
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2
                            id="modal-title"
                            className="text-lg font-semibold text-text-primary"
                        >
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-sm text-text-secondary">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-xl leading-none text-text-secondary transition-colors hover:text-text-primary"
                    >
                        ×
                    </button>
                </div>

                <div className="px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;