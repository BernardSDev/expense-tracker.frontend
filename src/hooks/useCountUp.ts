"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

/**
 * Animates a number from its previous value to `value`.
 * Starts from 0 on first render, then rolls between values when it changes.
 */
export function useCountUp(value: number, duration = 700) {
    const [display, setDisplay] = useState(0);
    const currentRef = useRef(0);

    useEffect(() => {
        const from = currentRef.current;
        let frame = 0;

        if (prefersReducedMotion() || from === value) {
            frame = requestAnimationFrame(() => {
                currentRef.current = value;
                setDisplay(value);
            });

            return () => cancelAnimationFrame(frame);
        }

        const start = performance.now();

        function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const next = from + (value - from) * eased;

            currentRef.current = next;
            setDisplay(next);

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        }

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [value, duration]);

    return display;
}
