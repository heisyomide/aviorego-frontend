"use client";

import Link from "next/link";

const services = [
  {
    id: "food",
    number: "01",
    label: "Food Marketplace",
    title: "Discover Local Food You’ll Love.",
    description:
      "Discover local food vendors and order your favourite meals with ease. From everyday meals to special treats, AviorèGo connects you with great food around you.",
    image: "/images/food.jpeg",
    features: [
      "Discover local food vendors",
      "Browse menus with ease",
      "Order your favourite meals",
    ],
    button: "Explore Food",
  },
  {
    id: "delivery",
    number: "02",
    label: "Local Delivery",
    title: "Send and Receive With Ease.",
    description:
      "Send and receive items within your city quickly and safely. AviorèGo makes local delivery simple with reliable riders and convenient tracking.",
    image: "/images/bike.jpeg",
    features: [
      "Fast local deliveries",
      "Reliable delivery partners",
      "Track your delivery",
    ],
    button: "Book a Delivery",
  },
  {
    id: "events",
    number: "03",
    label: "Event Logistics & Mobility",
    title: "Seamless Transport for Your Events.",
    description:
      "Move people and coordinate transportation for events, groups, and special occasions with a dependable mobility solution.",
    image: "/images/solo2.jpeg",
    features: [
      "Event transportation",
      "Group mobility solutions",
      "Reliable event coordination",
    ],
    button: "Plan Your Event",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-[#10231c]">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <section className="px-5 pb-7 pt-10 sm:px-8 sm:pt-14 md:px-10 lg:px-12 lg:pb-10 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#168453] sm:text-[10px]">
            Our Services
          </p>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="max-w-xl text-[30px] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-[38px] md:text-[46px]">
                More Than Just
                <br />
                <span className="text-[#11945d]">Delivery.</span>
              </h1>

              <p className="mt-3 max-w-md text-[10px] leading-[1.65] text-[#68756e] sm:text-[12px]">
                From your favourite meals to everyday deliveries and event
                mobility, AviorèGo brings the services you need together in one
                convenient platform.
              </p>
            </div>

            {/* Mobile swipe hint */}
            <p className="text-[8px] font-medium text-[#168453] md:hidden">
              Swipe left to explore our services →
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================== */}

      {/* ================= MOBILE ================= */}
      <section
        className="
          flex
          w-full
          snap-x
          snap-mandatory
          overflow-x-auto
          overscroll-x-contain
          scroll-smooth
          scrollbar-none
          md:hidden
        "
      >
        {services.map((service) => (
          <article
            key={service.id}
            className="
              w-full
              min-w-full
              shrink-0
              snap-center
              px-5
              pb-10
            "
          >
            <div className="mx-auto max-w-md overflow-hidden rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
              
              {/* IMAGE */}
              <div className="relative h-[245px] w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.label}
                  className="h-full w-full object-cover"
                />

                {/* number */}
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[9px] font-extrabold text-[#11945d] shadow-sm">
                  {service.number}
                </div>
              </div>

              {/* CONTENT */}
              <div className="px-5 pb-6 pt-5">
                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#168453]">
                  {service.label}
                </p>

                <h2 className="mt-2 text-[25px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#10231c]">
                  {service.title}
                </h2>

                <p className="mt-3 text-[10px] leading-[1.65] text-[#68756e]">
                  {service.description}
                </p>

                {/* FEATURES */}
                <div className="mt-5 space-y-3">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7f6ee] text-[#11945d]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-3 w-3"
                        >
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      </div>

                      <p className="text-[9px] font-medium text-[#31443b]">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="https://app.aviorego.com.ng"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#11945d] px-5 py-3 text-[9px] font-bold text-white transition hover:bg-[#0d7f4e]"
                >
                  {service.button}
                  <span>→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ================= DESKTOP ================= */}
      <section className="hidden px-5 pb-16 sm:px-8 md:block md:px-10 lg:px-12 lg:pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-5 lg:gap-6">
          {services.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-[18px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              {/* IMAGE */}
              <div className="relative h-[205px] w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.label}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />

                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[9px] font-extrabold text-[#11945d]">
                  {service.number}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 lg:p-6">
                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#168453]">
                  {service.label}
                </p>

                <h2 className="mt-2 min-h-[48px] text-[19px] font-extrabold leading-[1.1] tracking-[-0.025em] text-[#10231c]">
                  {service.title}
                </h2>

                <p className="mt-3 min-h-[72px] text-[9px] leading-[1.6] text-[#68756e]">
                  {service.description}
                </p>

                <div className="mt-5 space-y-2.5">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e7f6ee] text-[#11945d]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-2.5 w-2.5"
                        >
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      </div>

                      <p className="text-[8px] font-medium text-[#31443b]">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="https://app.aviorego.com.ng"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#11945d] px-4 py-2.5 text-[8px] font-bold text-white transition hover:bg-[#0d7f4e]"
                >
                  {service.button}
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}