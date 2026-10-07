export type CategoryStyles = {
    /** Soft fill for icon tiles and pills */
    background: string;
    /** Icon and dot colour on the soft fill */
    color: string;
    /** Solid colour for bars and legend dots on light surfaces */
    bar: string;
    /** Solid colour for bars and legend dots on the dark summary card */
    barOnDark: string;
};

export function getCategoryStyles(categoryName: string | null): CategoryStyles {
    if (categoryName === "Groceries") {
        return {
            background: "bg-category-1-soft",
            color: "text-category-1-strong",
            bar: "bg-category-1",
            barOnDark: "bg-accent",
        };
    }

    if (categoryName === "Vacation") {
        return {
            background: "bg-category-2-soft",
            color: "text-category-2-strong",
            bar: "bg-category-2",
            barOnDark: "bg-category-2-on-dark",
        };
    }

    return {
        background: "bg-surface-muted",
        color: "text-text-primary",
        bar: "bg-border-strong",
        barOnDark: "bg-text-muted",
    };
}
