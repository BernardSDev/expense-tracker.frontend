"use client";

import { useCountUp } from "@/hooks/useCountUp";

type AnimatedNumberProps = {
    value: number;
    format?: (value: number) => string;
    duration?: number;
};

const defaultFormat = (value: number) => String(Math.round(value));

/**
 * Shows a number that counts up to its value. Screen readers get the
 * final value straight away instead of every step.
 */
export default function AnimatedNumber({
                                           value,
                                           format = defaultFormat,
                                           duration,
                                       }: AnimatedNumberProps) {
    const display = useCountUp(value, duration);

    return (
        <>
            <span aria-hidden="true">{format(display)}</span>
            <span className="sr-only">{format(value)}</span>
        </>
    );
}
