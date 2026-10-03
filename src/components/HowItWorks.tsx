"use client";

const steps = [
  {
    number: "1",
    title: "Install the App",
    description: "Click the button above or visit app.aviorego.com.ng",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M10 5h4" />
        <path d="M10.5 18.5h3" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Create an Account",
    description: "Sign up in seconds and set up your profile.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21c.6-4 3-6 7-6s6.4 2 7 6" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Browse & Order",
    description: "Explore food, delivery or event services.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 1.9-1.4L21 8H6" />
      </svg>
    ),
  },
  {
    number: "4",
    title: "Track & Enjoy",
    description: "Follow your order or booking in real time.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-white px-5 py-14 sm:px-8 md:px-10 lg:px-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-9 lg:flex-row lg:items-center lg:gap-12">

          {/* INTRO */}
          <div className="shrink-0 lg:w-[28%]">
            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#168453] sm:text-[10px]">
              How It Works
            </p>

            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#10231c] sm:text-4xl lg:text-[32px]">
              Getting Started
              <br />
              Is Easy
            </h2>

            <p className="mt-3 max-w-[320px] text-[11px] leading-[1.55] text-[#68756f] sm:text-xs">
              In just a few simple steps, you can start ordering, sending or
              booking with AviorèGo.
            </p>

            <a
              href="https://app.aviorego.com.ng"
              className="mt-5 inline-flex items-center gap-3 rounded-xl bg-[#11945d] px-4 py-3 text-[10px] font-bold text-white transition hover:bg-[#0d7f50] sm:text-xs"
            >
              Install App Now
              <span className="text-sm">→</span>
            </a>
          </div>

          {/* MOBILE STEPS */}
          <div className="lg:hidden">
            <div className="relative space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative flex items-start gap-4"
                >
                  {/* Connecting line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-[18px] top-10 h-[calc(100%+1.5rem)] w-px bg-[#d8ebe2]" />
                  )}

                  {/* Icon */}
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#bfe3d2] bg-[#f0faf5] text-[#168453]">
                    {step.icon}
                  </div>

                  {/* Text */}
                  <div className="pt-0.5">
                    <p className="text-[8px] font-semibold uppercase tracking-wide text-[#168453]">
                      Step {step.number}
                    </p>

                    <h3 className="mt-0.5 text-[12px] font-extrabold text-[#172920]">
                      {step.title}
                    </h3>

                    <p className="mt-1 max-w-[270px] text-[9px] leading-[1.45] text-[#718078]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP STEPS */}
          <div className="hidden min-w-0 flex-1 lg:block">
            <div className="flex items-start">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex min-w-0 flex-1 items-start"
                >
                  <div className="min-w-0 flex-1">
                    {/* Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7e8d8] bg-[#f1faf5] text-[#168453]">
                      {step.icon}
                    </div>

                    {/* Step number */}
                    <p className="mt-3 text-[8px] font-bold text-[#168453]">
                      {step.number}
                    </p>

                    <h3 className="mt-0.5 text-[10px] font-extrabold text-[#172920]">
                      {step.title}
                    </h3>

                    <p className="mt-1 max-w-[120px] text-[8px] leading-[1.45] text-[#718078]">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index !== steps.length - 1 && (
                    <div className="px-2 pt-4 text-[#168453]">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}