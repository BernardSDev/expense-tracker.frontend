import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-7 text-[13px] text-text-secondary sm:flex-row sm:items-center sm:justify-between">
                <p>© 2026 Sika</p>

                <nav
                    aria-label="Footer"
                    className="flex gap-6"
                >
                    <Link href="/login" className="transition-colors hover:text-text-primary">
                        Sign in
                    </Link>
                    <Link href="/register" className="transition-colors hover:text-text-primary">
                        Create account
                    </Link>
                </nav>

                <p>Made in Ghana</p>
            </div>
        </footer>
    );
}
