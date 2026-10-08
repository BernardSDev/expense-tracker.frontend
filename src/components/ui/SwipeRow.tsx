"use client";

import {
    useRef,
    useState,
    type PointerEvent,
    type ReactNode,
    type MouseEvent,
} from "react";

const ACTION_WIDTH = 76;
const OVERSHOOT = 24;
const LOCK_DISTANCE = 8;

export type SwipeAction = {
    label: string;
    icon: ReactNode;
    tone: "neutral" | "danger";
    onClick: () => void;
};

type SwipeRowProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    actions: SwipeAction[];
    /** Classes for the list item itself (animations, rounding) */
    className?: string;
    /** Classes for the sliding content (layout, padding) */
    contentClassName?: string;
    children: ReactNode;
};

type DragStart = {
    x: number;
    y: number;
    base: number;
    axis: "x" | "y" | null;
};

/**
 * A list row that slides left on touch to reveal actions.
 * Vertical scrolling is untouched: the swipe only starts once the
 * finger is clearly moving sideways. Mouse users keep the normal row.
 */
export default function SwipeRow({
                                     isOpen,
                                     onOpenChange,
                                     actions,
                                     className = "",
                                     contentClassName = "",
                                     children,
                                 }: SwipeRowProps) {
    const width = actions.length * ACTION_WIDTH;

    const [dragX, setDragX] = useState<number | null>(null);
    const startRef = useRef<DragStart | null>(null);
    const didSwipeRef = useRef(false);

    const offset = dragX ?? (isOpen ? -width : 0);

    function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType === "mouse") {
            return;
        }

        didSwipeRef.current = false;
        startRef.current = {
            x: event.clientX,
            y: event.clientY,
            base: isOpen ? -width : 0,
            axis: null,
        };
    }

    function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
        const start = startRef.current;

        if (!start) {
            return;
        }

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;

        if (!start.axis) {
            if (Math.abs(dx) < LOCK_DISTANCE && Math.abs(dy) < LOCK_DISTANCE) {
                return;
            }

            start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";

            if (start.axis === "x") {
                event.currentTarget.setPointerCapture(event.pointerId);
            }
        }

        if (start.axis !== "x") {
            return;
        }

        didSwipeRef.current = true;
        setDragX(Math.min(0, Math.max(-width - OVERSHOOT, start.base + dx)));
    }

    function handlePointerEnd() {
        const start = startRef.current;
        startRef.current = null;

        if (!start || start.axis !== "x") {
            return;
        }

        const finalX = dragX ?? start.base;
        setDragX(null);
        onOpenChange(finalX < -width / 2);
    }

    function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
        // A swipe shouldn't also count as a tap, and tapping an open row closes it
        if (didSwipeRef.current) {
            didSwipeRef.current = false;
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (isOpen) {
            event.preventDefault();
            event.stopPropagation();
            onOpenChange(false);
        }
    }

    return (
        <li
            data-swipe-open={isOpen || undefined}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="absolute inset-y-0 right-0 flex"
                style={{ width }}
                aria-hidden={!isOpen}
            >
                {actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        tabIndex={isOpen ? 0 : -1}
                        onClick={() => {
                            onOpenChange(false);
                            action.onClick();
                        }}
                        className={`flex h-full flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
                            action.tone === "danger"
                                ? "bg-negative text-white active:bg-negative/90"
                                : "bg-surface-muted text-text-primary active:bg-border"
                        }`}
                    >
                        {action.icon}
                        {action.label}
                    </button>
                ))}
            </div>

            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                onClickCapture={handleClickCapture}
                className={`relative touch-pan-y bg-surface ${contentClassName}`}
                style={{
                    transform: `translateX(${offset}px)`,
                    transition:
                        dragX === null
                            ? "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)"
                            : "none",
                }}
            >
                {children}
            </div>
        </li>
    );
}
