import CategoryManager from "@/components/categories/CategoryManager";

export default function CategoriesTestPage() {
    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-2 text-3xl font-semibold">
                    Category Manager Test
                </h1>

                <p className="mb-8 text-sm text-text-secondary">
                    Temporary page for testing category CRUD.
                </p>

                <div className="rounded-2xl border border-border bg-surface p-6">
                    <CategoryManager />
                </div>
            </div>
        </main>
    );
}