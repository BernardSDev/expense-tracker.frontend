"use client";

import { useEffect, useState } from "react";

/**
 * Returns ids that appeared after the list first loaded, for a short while,
 * so the UI can highlight newly added items. Items present on first load,
 * or reappearing after a filter, are never treated as new.
 */
export function useNewIds(ids: number[], ready: boolean, duration = 1700) {
    const [seen, setSeen] = useState<Set<number> | null>(null);
    const [previousKey, setPreviousKey] = useState("");
    const [fresh, setFresh] = useState<number[]>([]);

    const key = ids.join(",");

    if (seen === null) {
        if (ready) {
            setSeen(new Set(ids));
            setPreviousKey(key);
        }
    } else if (key !== previousKey) {
        setPreviousKey(key);

        const added = ids.filter((id) => !seen.has(id));

        if (added.length > 0) {
            setSeen(new Set([...seen, ...added]));
            setFresh((current) => [...current, ...added]);
        }
    }

    useEffect(() => {
        if (fresh.length === 0) {
            return;
        }

        const timeout = setTimeout(() => setFresh([]), duration);

        return () => clearTimeout(timeout);
    }, [fresh, duration]);

    return fresh;
}
