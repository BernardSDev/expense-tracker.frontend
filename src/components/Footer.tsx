export default function Footer() {
    return (
        <footer className="bg-dark text-text-on-dark">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="flex flex-col gap-8 border-t border-text-on-dark/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                            <span
                                aria-hidden="true"
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-text-primary"
                            >
                                ₵
                            </span>
                            Trackk
                        </p>
                        <p className="mt-1 text-sm text-text-on-dark/60">
                            Take control of your money.
                        </p>
                    </div>

                    <nav className="flex items-center gap-6 text-sm text-text-on-dark/70">
                        <a
                            href="/expenses"
                            className="transition-colors hover:text-text-on-dark"
                        >
                            Dashboard
                        </a>

                        <a
                            href="/login"
                            className="transition-colors hover:text-text-on-dark"
                        >
                            Sign in
                        </a>

                        <a
                            href="/register"
                            className="transition-colors hover:text-text-on-dark"
                        >
                            Register
                        </a>
                    </nav>
                </div>

                <div className="mt-8 flex flex-col gap-2 text-xs text-text-on-dark/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Trackk. All rights reserved.</p>

                    <p>Built with simplicity in mind.</p>
                </div>
            </div>
        </footer>
    );
}