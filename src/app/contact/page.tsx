import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Footer from "@/src/components/Footer";

const contactDetails = [
  {
    icon: Phone,
    title: "Give Us a Call",
    value: "Your phone number",
    href: "tel:+2349044591575",
  },
  {
    icon: Mail,
    title: "Send Us an Email",
    value: "Your email address",
    href: "mailto:aviore.careers@gmail.com",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Osun State, Nigeria",
    href: "#",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#07120f]">
      {/* CONTACT HERO */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 lg:px-12 lg:pb-24 lg:pt-10">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-[#00412e] transition hover:bg-neutral-50"
              aria-label="Back to home"
            >
              <ArrowLeft size={17} />
            </Link>

            <div className="text-xl font-extrabold tracking-[-0.05em] text-[#00412e]">
              Avior<span className="text-emerald-500">è</span>Go
            </div>

            <div className="w-10" />
          </div>

          {/* Heading */}
          <div className="mx-auto mt-16 max-w-2xl text-center lg:mt-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
              Contact Us
            </p>

            <h1 className="mt-4 text-[42px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#07120f] sm:text-6xl lg:text-7xl">
              Get in
              <span className="text-[#008f62]"> Touch.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
              Have a question, need support, or want to work with us?
              We&apos;d love to hear from you. Reach out and let&apos;s
              make things move better together.
            </p>
          </div>

          {/* Contact cards */}
          <div className="mx-auto mt-14 max-w-4xl lg:mt-20">
            <div className="grid gap-3 lg:grid-cols-3 lg:gap-5">
              {contactDetails.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group flex items-center gap-4 rounded-2xl border border-neutral-100 bg-[#f8faf9] p-5 transition hover:-translate-y-1 hover:border-emerald-100 hover:bg-emerald-50/40"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00412e] text-emerald-400 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                        {item.title}
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-[#07120f]">
                        {item.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TOGETHER WE MOVE BETTER */}
      <section className="relative overflow-hidden bg-[#00412e]">
        <div className="grid min-h-[520px] lg:min-h-[580px] lg:grid-cols-[0.95fr_1.05fr]">
          {/* Image */}
          <div className="relative order-2 min-h-[300px] lg:order-1 lg:min-h-full">
            <Image
              src="/images/osogbo.jpeg"
              alt="Osogbo community"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Blend image into green */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00412e]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#00412e]" />

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#00412e]/60 to-transparent lg:hidden" />
          </div>

          {/* Content */}
          <div className="order-1 flex flex-col justify-center px-6 py-16 text-white sm:px-10 lg:order-2 lg:px-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
              AviorèGo
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Together
              <span className="block text-emerald-400">
                We Move Better.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              Every connection matters. Every journey counts. Every
              community deserves better ways to move, connect, and grow.
            </p>

            <div className="mt-9">
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#00412e] shadow-xl transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                Explore AviorèGo
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SUPPORT */}
      <section className="bg-[#f7faf8] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                Need Help?
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#07120f] sm:text-4xl">
                We&apos;re here to help.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500">
                Whether you&apos;re a customer, vendor, partner, or simply
                want to learn more about AviorèGo, our team is ready to help.
              </p>
            </div>

            <div className="flex md:justify-end">
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00412e] px-7 text-sm font-bold text-white shadow-lg transition hover:bg-[#00583e] active:scale-[0.98]"
              >
                View Our Services
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}