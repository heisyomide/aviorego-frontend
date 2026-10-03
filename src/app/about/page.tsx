import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Lightbulb,
  Users,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/src/components/Footer";

const values = [
  {
    icon: HeartHandshake,
    title: "Our Mission",
    description:
      "To make everyday movement, delivery, and access to local services simpler and more reliable.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description:
      "To build a smarter connected community where people, businesses, and opportunities move seamlessly.",
  },
  {
    icon: Users,
    title: "Our Team",
    description:
      "A growing team committed to solving real problems and creating better everyday experiences.",
  },
];

const storyPoints = [
  "Built around real everyday needs",
  "Connecting people, businesses, and communities",
  "Making local services easier to access",
  "Creating opportunities through technology",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#07120f]">
      {/* HERO / ABOUT INTRO */}
      <section className="relative bg-[#00412e]">
        <div className="mx-auto max-w-7xl">
          <div className="grid min-h-[720px] lg:grid-cols-2">
            {/* Image */}
            <div className="relative min-h-[380px] overflow-hidden lg:min-h-[720px]">
              <Image
                src="/images/osogbo.jpeg"
                alt="Community and city view"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Mobile fade */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#00412e] to-transparent lg:hidden" />

              {/* Desktop blend */}
              <div className="absolute inset-y-0 right-0 hidden w-40 bg-gradient-to-r from-transparent to-[#00412e] lg:block" />

              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-center px-6 pb-12 pt-2 text-white sm:px-10 lg:px-16 lg:py-20">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-emerald-400" />
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400">
                  About AviorèGo
                </p>
              </div>

              <h1 className="max-w-2xl text-[40px] font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Built for a smarter,
                <span className="block text-emerald-400">
                  connected community.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                AviorèGo is building a connected local ecosystem that makes
                everyday movement, delivery, food, and event logistics easier
                for people and businesses.
              </p>

              <div className="mt-10 space-y-7">
                {values.map((value) => {
                  const Icon = value.icon;

                  return (
                    <div
                      key={value.title}
                      className="flex gap-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#00412e]">
                        <Icon size={19} strokeWidth={2.3} />
                      </div>

                      <div>
                        <h2 className="text-sm font-bold">
                          {value.title}
                        </h2>

                        <p className="mt-1 max-w-md text-xs leading-5 text-white/60 sm:text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Branded bottom edge */}
        <div className="h-5 bg-gradient-to-r from-[#00412e] via-emerald-700 to-[#00412e]" />
      </section>

      {/* OUR STORY */}
      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* Image */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-[32px] border-l-2 border-t-2 border-emerald-500/30" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#00412e] shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/images/solo.jpeg"
                  alt="AviorèGo community"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#00412e]/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                    The AviorèGo Story
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-3 hidden h-24 w-24 rounded-br-[32px] border-b-2 border-r-2 border-emerald-500/30 sm:block" />
            </div>

            {/* Story content */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">
                Why We Exist
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-[#07120f] sm:text-5xl">
                We&apos;re building for
                <span className="text-[#008f62]"> everyone.</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                We believe local communities deserve technology that feels
                simple, useful, and genuinely connected to everyday life.
                AviorèGo brings essential services together so people and
                businesses can move, connect, and grow with less friction.
              </p>

              <div className="mt-8 space-y-4">
                {storyPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <CheckCircle2 size={16} />
                    </div>

                    <p className="text-sm font-medium text-neutral-700">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/services"
                className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00412e] px-6 text-sm font-bold text-white shadow-lg shadow-[#00412e]/20 transition hover:bg-[#00583e] active:scale-[0.98]"
              >
                Explore Our Services
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY STATEMENT */}
      <section className="relative overflow-hidden bg-[#00412e] px-6 py-20 text-white sm:px-10 lg:py-24">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
            Together, We Move Better
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl">
            A better connected community
            <span className="block text-emerald-400">
              starts with all of us.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            From a meal to a parcel, a business to its customers, or an event
            to the people attending it, AviorèGo is here to make movement
            easier.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#00412e] transition hover:bg-emerald-50 active:scale-[0.98]"
          >
            Experience AviorèGo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}