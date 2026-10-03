"use client";

import Link from "next/link";

const ambassadors = [
  {
    name: "Kehinde Samuel",
    role: "Event Enthusiast",
    description:
      "Discovering the best local food spots in our city.",
    image: "/images/kay.jpeg",
  },

    {
    name: "Firepemi Tolulope",
    role: "Food Lover",
    description:
      "Making events smoother and easier.",
    image: "/images/fire.jpeg",
  },
  {
    name: "Adelusi Adedamola",
    role: "Community Advocate",
    description:
      "Supporting local businesses and growth.",
    image: "/images/damola.jpeg",
  },

  {
    name: "Oke Adejolaoluwa",
    role: "AviorèGo Growth Partner",
    description:
      "Showing you the best of our city.",
    image: "/images/jola.jpeg",
  },
];

export default function AmbassadorsSection() {
  return (
    <section
      id="ambassadors"
      className="overflow-hidden bg-[#003d2c] px-4 py-14 sm:px-6 md:px-10 lg:px-12 lg:py-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-8">

          {/* LEFT CONTENT */}
          <div className="shrink-0 lg:w-[28%]">
            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#53c995] sm:text-[10px]">
              Our Brand Ambassadors
            </p>

            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-[32px]">
              Real People.
              <br />
              Real Stories.
            </h2>

            <p className="mt-4 max-w-[330px] text-[11px] leading-[1.55] text-white/70 sm:text-xs">
              Our brand ambassadors are the voice of AviorèGo sharing their
              experiences, spreading the word and showing you how easy it is
              to use the platform.
            </p>

            <Link
              href="/ambassadors"
              className="mt-5 inline-flex items-center gap-3 rounded-xl bg-[#0e9b61] px-4 py-3 text-[10px] font-bold text-white transition hover:bg-[#0b8553] sm:text-xs"
            >
              Meet Our Ambassadors
              <span className="text-sm">→</span>
            </Link>
          </div>

          {/* MOBILE CAROUSEL */}
          <div className="lg:hidden">
            <div
              className="
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                pb-3
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {ambassadors.map((ambassador) => (
                <article
                  key={ambassador.name}
                  className="
                    w-[82vw]
                    shrink-0
                    snap-center
                    overflow-hidden
                    rounded-2xl
                    bg-[#07553f]
                    sm:w-[65vw]
                  "
                >
                  <div className="h-[270px] w-full overflow-hidden">
                    <img
                      src={ambassador.image}
                      alt={ambassador.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-[9px] font-medium text-[#65d3a4]">
                      {ambassador.role}
                    </p>

                    <h3 className="mt-1 text-base font-bold text-white">
                      {ambassador.name}
                    </h3>

                    <p className="mt-1.5 text-[10px] leading-[1.5] text-white/65">
                      {ambassador.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile dots */}
            <div className="mt-3 flex justify-center gap-1.5">
              {ambassadors.map((ambassador, index) => (
                <span
                  key={ambassador.name}
                  className={`h-1.5 rounded-full ${
                    index === 0
                      ? "w-5 bg-[#4ac993]"
                      : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP CARDS */}
          <div className="hidden min-w-0 flex-1 lg:block">
            <div className="flex items-center gap-3">
              <div className="grid min-w-0 flex-1 grid-cols-4 gap-3">
                {ambassadors.map((ambassador) => (
                  <article key={ambassador.name} className="min-w-0">
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={ambassador.image}
                        alt={ambassador.name}
                        className="aspect-[0.92] w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>

                    <p className="mt-2 text-[8px] font-medium text-[#61d3a3]">
                      {ambassador.role}
                    </p>

                    <h3 className="mt-0.5 text-[11px] font-bold text-white">
                      {ambassador.name}
                    </h3>

                    <p className="mt-1 text-[8px] leading-[1.4] text-white/55">
                      {ambassador.description}
                    </p>
                  </article>
                ))}
              </div>

              {/* Desktop arrows */}
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label="Previous ambassadors"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-xs text-white transition hover:bg-white/10"
                >
                  ←
                </button>

                <button
                  type="button"
                  aria-label="Next ambassadors"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-xs text-white transition hover:bg-white/10"
                >
                  →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}