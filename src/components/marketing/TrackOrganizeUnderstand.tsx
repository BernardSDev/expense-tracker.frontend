export default function TrackOrganizeUnderstand() {
    const features = [
        {
            number: "01",
            title: "Track everything",
            description:
                "Keep your daily expenses organized without unnecessary complexity.",
        },
        {
            number: "02",
            title: "Know where it goes",
            description:
                "Categories give you a clearer picture of your spending.",
        },
        {
            number: "03",
            title: "Make better decisions",
            description:
                "Turn your spending history into information you can actually use.",
        },
    ];

    return (
        <section className="bg-background">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
                <div className="border-t border-border">
                    {features.map((feature) => (
                        <div
                            key={feature.number}
                            className="grid gap-6 border-b border-border py-10 md:grid-cols-[100px_1fr_1.2fr] md:items-start md:py-14"
                        >
              <span className="text-sm font-medium text-text-muted">
                {feature.number}
              </span>

                            <h3 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
                                {feature.title}
                            </h3>

                            <p className="max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}