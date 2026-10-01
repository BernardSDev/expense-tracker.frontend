export default function FinalCTA() {
    return (
        <section className="bg-dark text-white">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
                <div className="flex flex-col gap-10 border-t border-white/15 pt-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                            Take control
                        </p>

                        <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                            Start understanding
                            <br />
                            <span className="text-accent">your money.</span>
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                            A simpler way to track every expense and stay in control.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <a
                            href="/register"
                            className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-semibold text-dark transition-colors hover:bg-accent-hover"
                        >
                            Start tracking
                            <span aria-hidden="true">→</span>
                        </a>

                        <a
                            href="/login"
                            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}