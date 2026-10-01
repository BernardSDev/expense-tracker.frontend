export default function Footer() {
    return (
        <footer className="bg-dark text-white">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold">Expense Tracker</p>
                        <p className="mt-1 text-sm text-white/40">
                            Take control of your money.
                        </p>
                    </div>

                    <nav className="flex items-center gap-6 text-sm text-white/50">
                        <a
                            href="/expenses"
                            className="transition-colors hover:text-white"
                        >
                            Dashboard
                        </a>

                        <a
                            href="/login"
                            className="transition-colors hover:text-white"
                        >
                            Sign in
                        </a>

                        <a
                            href="/register"
                            className="transition-colors hover:text-white"
                        >
                            Register
                        </a>
                    </nav>
                </div>

                <div className="mt-8 flex flex-col gap-2 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Expense Tracker. All rights reserved.</p>

                    <p>Built with simplicity in mind.</p>
                </div>
            </div>
        </footer>
    );
}