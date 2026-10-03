"use client";

const benefits = [
  {
    title: "Safe & Secure",
    description: "Verified vendors, riders and drivers.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Fast & Reliable",
    description: "Quick service, real-time tracking.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M13.2 2 5 13h5.7L9.8 22 19 10.3h-5.8L13.2 2Z" />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description: "We are always here to help.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 13h2v5H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2Z" />
        <path d="M20 13h-2v5h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z" />
        <path d="M18 18c-.8 1.3-2 2-4 2" />
      </svg>
    ),
  },
  {
    title: "Local Focus",
    description: "Supporting local businesses and communities.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
    ),
  },
];

export default function WhyChooseSection() {
  return (
    <section
      className="
        bg-[#eef8f2]
        px-5
        py-10
        sm:px-8
        md:px-10
        lg:px-14
        lg:py-8
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-6xl
          flex-col
          gap-7
          lg:flex-row
          lg:items-center
          lg:gap-12
        "
      >
        {/* Intro */}
        <div className="lg:w-[28%] lg:shrink-0">
          <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#168453] sm:text-[9px]">
            Why Choose AviorèGo
          </p>

          <h2
            className="
              mt-1
              text-[21px]
              font-extrabold
              leading-none
              tracking-[-0.03em]
              text-[#10231c]
              sm:text-2xl
              lg:text-[22px]
            "
          >
            Built for You
          </h2>

          <p
            className="
              mt-2
              max-w-[300px]
              text-[9px]
              leading-[1.45]
              text-[#65736c]
              sm:text-[10px]
            "
          >
            We make everyday movement and access to local businesses simple,
            safe and stress-free.
          </p>
        </div>

        {/* Benefits */}
        <div
          className="
            grid
            grid-cols-2
            gap-x-5
            gap-y-6
            lg:flex
            lg:flex-1
            lg:items-center
            lg:justify-between
            lg:gap-5
          "
        >
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="
                flex
                items-start
                gap-2.5
                lg:max-w-[145px]
                lg:flex-col
                lg:gap-2
              "
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-[#168453]
                  lg:h-8
                  lg:w-8
                "
              >
                {benefit.icon}
              </div>

              {/* Text */}
              <div>
                <h3
                  className="
                    text-[9px]
                    font-extrabold
                    leading-tight
                    text-[#183128]
                    sm:text-[10px]
                    lg:text-[9px]
                  "
                >
                  {benefit.title}
                </h3>

                <p
                  className="
                    mt-1
                    max-w-[125px]
                    text-[8px]
                    leading-[1.4]
                    text-[#65736c]
                    sm:text-[9px]
                    lg:text-[8px]
                  "
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}