export default function FinalCTA() {
    return (
        <section className="bg-dark text-text-on-dark">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
                <div className="flex flex-col gap-10 border-t border-white/15 pt-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-on-dark/60">
                            Take control
                        </p>

                        <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                            Start understanding
                            <br />
                            <span className="text-accent">your money.</span>
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-7 text-text-on-dark/70 sm:text-lg">
                            A simpler way to track every expense and stay in control.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <a
                            href="/register"
                            className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-accent px-6 text-[15px] font-semibold text-text-primary transition-[background-color,transform] duration-150 hover:bg-accent-hover active:scale-[0.98]"
                        >
                            Start tracking
                            <span aria-hidden="true">→</span>
                        </a>

                        <a
                            href="/login"
                            className="text-sm font-medium text-text-on-dark/70 transition-colors hover:text-text-on-dark"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}