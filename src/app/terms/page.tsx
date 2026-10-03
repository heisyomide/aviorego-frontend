import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/src/components/Footer";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: (
      <p>
        By accessing or using AviorèGo, you agree to be bound by these Terms
        and Conditions. If you do not agree with any part of these terms,
        please do not use our services.
      </p>
    ),
  },
  {
    title: "2. About AviorèGo",
    content: (
      <>
        <p>
          AviorèGo is a technology platform that connects customers with
          services including food marketplace, local delivery, and event
          logistics.
        </p>

        <p className="mt-4">
          Our platform may connect customers with restaurants, vendors,
          delivery partners, event service providers, and other participating
          businesses.
        </p>
      </>
    ),
  },
  {
    title: "3. Use of Our Services",
    content: (
      <>
        <p>
          You agree to use AviorèGo only for lawful purposes and in accordance
          with these Terms.
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Provide accurate information when creating an account.</li>
          <li>Keep your account information secure.</li>
          <li>Use the platform responsibly and respectfully.</li>
          <li>Do not misuse, disrupt, or attempt to compromise the platform.</li>
          <li>Do not use another person&apos;s account without permission.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Accounts",
    content: (
      <p>
        Some AviorèGo services require you to create an account. You are
        responsible for maintaining the confidentiality of your account
        information and for activities carried out through your account.
        Please notify us if you believe your account has been accessed without
        your authorization.
      </p>
    ),
  },
  {
    title: "5. Orders, Deliveries and Services",
    content: (
      <>
        <p>
          When you place an order or request a service through AviorèGo, you
          agree to provide accurate delivery, contact, and service information.
        </p>

        <p className="mt-4">
          Availability, pricing, estimated delivery times, and other service
          details may vary depending on the vendor, delivery partner,
          location, demand, and other circumstances.
        </p>
      </>
    ),
  },
  {
    title: "6. Payments and Charges",
    content: (
      <p>
        Applicable prices, delivery charges, service fees, and other charges
        will be displayed where applicable before you complete a transaction.
        You agree to provide valid payment information and authorize the
        applicable charges for services you request.
      </p>
    ),
  },
  {
    title: "7. Vendors and Service Partners",
    content: (
      <p>
        AviorèGo may work with independent restaurants, vendors, delivery
        partners, event providers, and other businesses. Information about
        products and services may be supplied by these partners, and their
        availability and fulfillment may depend on their individual
        operations.
      </p>
    ),
  },
  {
    title: "8. Cancellations and Refunds",
    content: (
      <p>
        Cancellation, refund, replacement, or adjustment policies may vary
        depending on the service or vendor involved. Where a specific
        cancellation or refund policy applies, it will be communicated through
        the relevant service or transaction.
      </p>
    ),
  },
  {
    title: "9. Prohibited Activities",
    content: (
      <>
        <p>You must not use AviorèGo to:</p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Break any applicable law or regulation.</li>
          <li>Submit fraudulent or misleading information.</li>
          <li>Attempt to gain unauthorized access to our systems.</li>
          <li>Interfere with the operation or security of the platform.</li>
          <li>Abuse, threaten, harass, or harm other users or service partners.</li>
          <li>Use the platform for activities that are unlawful or prohibited.</li>
        </ul>
      </>
    ),
  },
  {
    title: "10. Intellectual Property",
    content: (
      <p>
        The AviorèGo name, logo, branding, platform design, software, content,
        graphics, and other materials provided by AviorèGo are protected by
        applicable intellectual property laws. You may not copy, modify,
        distribute, or commercially exploit our materials without appropriate
        permission.
      </p>
    ),
  },
  {
    title: "11. Third-Party Services",
    content: (
      <p>
        AviorèGo may integrate with or provide access to third-party services,
        payment providers, vendors, maps, communications tools, or other
        platforms. Your use of third-party services may also be subject to
        their own terms and policies.
      </p>
    ),
  },
  {
    title: "12. Service Availability",
    content: (
      <p>
        We work to keep AviorèGo available and reliable, but we do not
        guarantee that the platform will always be uninterrupted, error-free,
        or available in every location. Services may occasionally be
        unavailable due to maintenance, technical issues, network problems, or
        circumstances outside our control.
      </p>
    ),
  },
  {
    title: "13. Limitation of Liability",
    content: (
      <p>
        To the extent permitted by applicable law, AviorèGo will not be liable
        for indirect, incidental, special, or consequential losses arising
        from your use of the platform or services. Nothing in these Terms is
        intended to exclude liability that cannot lawfully be excluded.
      </p>
    ),
  },
  {
    title: "14. Changes to These Terms",
    content: (
      <p>
        We may update these Terms and Conditions from time to time to reflect
        changes to our services, operations, or applicable requirements.
        Updated terms will be made available through our platform, and your
        continued use of AviorèGo after an update may constitute acceptance of
        the revised terms.
      </p>
    ),
  },
  {
    title: "15. Contact Us",
    content: (
      <>
        <p>
          If you have questions about these Terms and Conditions, please
          contact the AviorèGo team.
        </p>

        <Link
          href="/contact"
          className="mt-5 inline-flex items-center font-bold text-emerald-700 transition hover:text-emerald-900"
        >
          Contact AviorèGo
          <span className="ml-2">→</span>
        </Link>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-[#07120f]">
      {/* HEADER */}
      <section className="relative overflow-hidden bg-[#00412e] text-white">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-7 sm:px-8 lg:px-10 lg:pb-20 lg:pt-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10"
              aria-label="Back to home"
            >
              <ArrowLeft size={17} />
            </Link>

            <Link
              href="/"
              className="text-xl font-extrabold tracking-[-0.05em]"
            >
              Avior<span className="text-emerald-400">è</span>Go
            </Link>

            <div className="w-10" />
          </div>

          <div className="mt-16 max-w-3xl lg:mt-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
              Legal
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-6xl">
              Terms &
              <span className="block text-emerald-400">
                Conditions.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              These terms explain the rules and conditions that apply when you
              use AviorèGo and our services.
            </p>

            <p className="mt-5 text-[11px] font-medium text-white/40">
              Last updated: October 2026
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 py-12 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Intro notice */}
          <div className="mb-10 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
            <p className="text-sm leading-6 text-[#00412e]">
              Please read these Terms and Conditions carefully before using
              AviorèGo. By accessing or using our platform, you acknowledge
              that you have read and understood these terms.
            </p>
          </div>

          {/* Sections */}
          <div className="divide-y divide-neutral-100">
            {sections.map((section) => (
              <article
                key={section.title}
                className="py-8 first:pt-0 last:pb-0 sm:py-10"
              >
                <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#07120f] sm:text-xl">
                  {section.title}
                </h2>

                <div className="mt-4 text-sm leading-7 text-neutral-600 sm:text-[15px]">
                  {section.content}
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 rounded-[28px] bg-[#00412e] p-7 text-white sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              Questions?
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              Need clarification about our terms?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
              Our team is available to help you understand how AviorèGo works
              and answer questions about our services.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-bold text-[#00412e] transition hover:bg-emerald-50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}