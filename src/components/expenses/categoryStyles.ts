export type CategoryStyles = {
    /** Soft fill for icon tiles and pills */
    background: string;
    /** Text and icon colour on the soft fill */
    color: string;
    /** Solid colour for bars and legend dots on light surfaces */
    bar: string;
    /** Solid colour for bars and legend dots on the dark summary card */
    barOnDark: string;
    /** Small dot inside a category pill */
    dot: string;
};

/*
 * Eight validated colours (see globals.css), assigned in a fixed order.
 * A category keeps its colour everywhere because the slot comes from its id,
 * not from its rank, so a filter or a new expense never repaints it.
 * Class names are written out in full so Tailwind can find them.
 */
const CATEGORY_SLOTS: CategoryStyles[] = [
    {
        background: "bg-category-1-soft",
        color: "text-category-1-strong",
        bar: "bg-category-1",
        barOnDark: "bg-category-1-on-dark",
        dot: "bg-category-1",
    },
    {
        background: "bg-category-2-soft",
        color: "text-category-2-strong",
        bar: "bg-category-2",
        barOnDark: "bg-category-2-on-dark",
        dot: "bg-category-2",
    },
    {
        background: "bg-category-3-soft",
        color: "text-category-3-strong",
        bar: "bg-category-3",
        barOnDark: "bg-category-3-on-dark",
        dot: "bg-category-3",
    },
    {
        background: "bg-category-4-soft",
        color: "text-category-4-strong",
        bar: "bg-category-4",
        barOnDark: "bg-category-4-on-dark",
        dot: "bg-category-4",
    },
    {
        background: "bg-category-5-soft",
        color: "text-category-5-strong",
        bar: "bg-category-5",
        barOnDark: "bg-category-5-on-dark",
        dot: "bg-category-5",
    },
    {
        background: "bg-category-6-soft",
        color: "text-category-6-strong",
        bar: "bg-category-6",
        barOnDark: "bg-category-6-on-dark",
        dot: "bg-category-6",
    },
    {
        background: "bg-category-7-soft",
        color: "text-category-7-strong",
        bar: "bg-category-7",
        barOnDark: "bg-category-7-on-dark",
        dot: "bg-category-7",
    },
    {
        background: "bg-category-8-soft",
        color: "text-category-8-strong",
        bar: "bg-category-8",
        barOnDark: "bg-category-8-on-dark",
        dot: "bg-category-8",
    },
];

const NEUTRAL: CategoryStyles = {
    background: "bg-surface-muted",
    color: "text-text-primary",
    bar: "bg-border-strong",
    barOnDark: "bg-text-muted",
    dot: "bg-text-secondary",
};

function hashName(name: string) {
    let hash = 0;

    for (const character of name) {
        hash = (hash * 31 + character.charCodeAt(0)) | 0;
    }

    return Math.abs(hash);
}

/**
 * Pass the category id whenever you have it. The name is only a fallback
 * for places that don't know the id.
 */
export function getCategoryStyles(
    categoryName: string | null,
    categoryId?: number | null
): CategoryStyles {
    if (categoryId !== null && categoryId !== undefined) {
        return CATEGORY_SLOTS[(Math.max(categoryId, 1) - 1) % CATEGORY_SLOTS.length];
    }

    if (!categoryName) {
        return NEUTRAL;
    }

    return CATEGORY_SLOTS[hashName(categoryName) % CATEGORY_SLOTS.length];
}
