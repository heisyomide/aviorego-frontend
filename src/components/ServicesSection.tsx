"use client";

import Link from "next/link";

const services = [
  {
    title: "Food Marketplace",
    description:
      "Discover local food vendors and order your favourite meals with ease.",
    image: "/images/food.jpeg",
    icon: "🍴",
  },
  {
    title: "Local Delivery",
    description:
      "Send and receive items within your city, quickly and safely.",
    image: "/images/bike.jpeg",
    icon: "▣",
  },
  {
    title: "Event Logistics & Mobility",
    description:
      "Transport for events, groups and special occasions.",
    image: "/images/solo2.jpeg",
    icon: "▣",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-[#f8faf9] px-4 py-14 sm:px-6 md:px-10 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-8">
          {/* LEFT — Heading */}
          <div className="shrink-0 lg:w-[30%]">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#18865d] sm:text-xs">
              Our Services
            </p>

            <h2 className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#071d17] sm:text-4xl lg:text-[38px]">
              More Than Just
              <br />
              Delivery
            </h2>

            <p className="mt-4 max-w-[350px] text-[12px] leading-[1.55] text-[#5f6965] sm:text-sm">
              AviorèGo is your all-in-one platform for food, delivery, and event
              mobility. Fast, safe and reliable.
            </p>

            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-3 rounded-xl bg-[#11945d] px-4 py-3 text-[10px] font-bold text-white transition hover:bg-[#0d7f50] sm:text-xs"
            >
              Explore All Services
              <span className="text-sm">→</span>
            </Link>
          </div>

          {/* RIGHT — THREE CARDS ON ONE LINE */}
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="overflow-hidden rounded-[13px] border border-[#e5e9e7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                {/* SMALL IMAGE */}
                <div className="h-[105px] w-full overflow-hidden sm:h-[115px] lg:h-[125px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* CARD CONTENT */}
                <div className="flex gap-2.5 px-3 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#087d52] text-xs text-white">
                    {service.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[10px] font-bold leading-tight text-[#16211d] sm:text-[11px] lg:text-xs">
                      {service.title}
                    </h3>

                    <p className="mt-1 text-[8px] leading-[1.45] text-[#7a8580] sm:text-[9px]">
                      {service.description}
                    </p>

                    <Link
                      href="/services"
                      className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-bold text-[#087d52] sm:text-[9px]"
                    >
                      Learn More
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}