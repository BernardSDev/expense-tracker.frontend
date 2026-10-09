import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="bg-background px-6 pb-20 lg:px-8 lg:pb-28">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-dark px-6 py-16 text-center text-text-on-dark sm:px-12 sm:py-20">
                <div
                    aria-hidden="true"
                    className="absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
                />

                <div className="relative mx-auto max-w-2xl">
                    <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.05]">
                        Start knowing where
                        <br className="hidden sm:block" />{" "}
                        <span className="text-accent">every cedi goes.</span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-text-on-dark/70 sm:text-lg">
                        Create your account and add your first expense in under a minute.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/register"
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-6 text-[15px] font-semibold text-text-primary transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-accent-hover active:translate-y-0 active:scale-[0.98] sm:w-auto"
                        >
                            Create your account
                            <span aria-hidden="true">→</span>
                        </Link>

                        <Link
                            href="/login"
                            className="inline-flex h-12 w-full items-center justify-center rounded-[10px] border border-text-on-dark/15 px-6 text-[15px] font-semibold text-text-on-dark transition-colors hover:bg-dark-surface sm:w-auto"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
