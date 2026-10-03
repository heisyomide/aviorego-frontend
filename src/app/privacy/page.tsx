import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/src/components/Footer";

const sections = [
  {
    title: "1. Introduction",
    content: (
      <p>
        At AviorèGo, we respect your privacy and are committed to protecting
        the information you share with us. This Privacy Policy explains what
        information we may collect, how we use it, and the choices available
        to you when you use our platform and services.
      </p>
    ),
  },
  {
    title: "2. Information We Collect",
    content: (
      <>
        <p>
          Depending on how you use AviorèGo, we may collect information such
          as:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Your name and contact information.</li>
          <li>Account and profile information.</li>
          <li>Delivery and service addresses.</li>
          <li>Order and transaction information.</li>
          <li>Information you provide when contacting support.</li>
          <li>Device and technical information needed to operate the platform.</li>
          <li>Location information when you choose to enable location services.</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. How We Use Your Information",
    content: (
      <>
        <p>We may use collected information to:</p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Create and manage your account.</li>
          <li>Process orders and service requests.</li>
          <li>Coordinate deliveries and logistics services.</li>
          <li>Provide customer support.</li>
          <li>Improve our platform and services.</li>
          <li>Communicate important service updates.</li>
          <li>Protect the security and integrity of our platform.</li>
          <li>Comply with applicable legal requirements.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Location Information",
    content: (
      <p>
        Some AviorèGo services may require location information to provide
        accurate delivery, logistics, mapping, or service functionality.
        Location access is controlled through your device settings, and you
        can choose whether to grant or withdraw permission where supported.
      </p>
    ),
  },
  {
    title: "5. Payment Information",
    content: (
      <p>
        Payments may be processed through third-party payment providers. We
        may receive transaction-related information necessary to confirm and
        manage your payment, but payment credentials may be handled directly
        by the applicable payment provider in accordance with its own privacy
        and security practices.
      </p>
    ),
  },
  {
    title: "6. Cookies and Similar Technologies",
    content: (
      <p>
        AviorèGo may use cookies, local storage, and similar technologies to
        remember preferences, maintain sessions, improve functionality, and
        understand how our platform is used. You can manage certain browser
        permissions through your device or browser settings.
      </p>
    ),
  },
  {
    title: "7. How We Share Information",
    content: (
      <>
        <p>
          We may share information where necessary to provide our services,
          including with:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Restaurants, vendors, and service providers involved in your request.</li>
          <li>Delivery and logistics partners.</li>
          <li>Payment and technology service providers.</li>
          <li>Professional advisers or service providers working on our behalf.</li>
          <li>Authorities where disclosure is required by law.</li>
        </ul>

        <p className="mt-4">
          We do not share information simply because it is available to us.
          Information is shared where reasonably necessary for service
          delivery, security, legal compliance, or other legitimate purposes.
        </p>
      </>
    ),
  },
  {
    title: "8. Data Security",
    content: (
      <p>
        We take reasonable technical and organizational measures to protect
        information against unauthorized access, loss, misuse, alteration, or
        disclosure. However, no online service can guarantee absolute
        security.
      </p>
    ),
  },
  {
    title: "9. Data Retention",
    content: (
      <p>
        We retain information for as long as reasonably necessary to provide
        our services, maintain appropriate business and transaction records,
        resolve disputes, protect our platform, and meet applicable legal or
        regulatory requirements.
      </p>
    ),
  },
  {
    title: "10. Your Privacy Choices",
    content: (
      <>
        <p>
          Depending on applicable law, you may have rights relating to your
          personal information, which can include requesting access,
          correction, deletion, or other appropriate handling of your data.
        </p>

        <p className="mt-4">
          You may also manage certain permissions, such as location access,
          through your device settings.
        </p>
      </>
    ),
  },
  {
    title: "11. Children and Minors",
    content: (
      <p>
        AviorèGo services are not intended to be used in ways that violate
        applicable age or child-protection requirements. Where a service has
        specific age requirements, those requirements apply.
      </p>
    ),
  },
  {
    title: "12. Third-Party Services",
    content: (
      <p>
        Our platform may contain integrations or links to third-party
        services. Those services may have their own privacy policies and
        practices. We encourage you to review the applicable policies when
        using third-party services.
      </p>
    ),
  },
  {
    title: "13. Changes to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time as our services,
        technology, or legal requirements change. When changes are made, the
        updated policy will be made available through our platform.
      </p>
    ),
  },
  {
    title: "14. Contact Us",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or how AviorèGo
          handles information, please contact our team.
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-[#07120f]">
      {/* HEADER */}
      <section className="relative overflow-hidden bg-[#00412e] text-white">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />

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
              Legal & Privacy
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-6xl">
              Privacy
              <span className="block text-emerald-400">
                Policy.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Your information matters to us. This policy explains how
              AviorèGo collects, uses, protects, and handles information when
              you use our platform and services.
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
          {/* Privacy notice */}
          <div className="mb-10 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
            <p className="text-sm leading-6 text-[#00412e]">
              This Privacy Policy describes how information may be collected
              and used when you interact with AviorèGo. Please read it
              alongside our Terms & Conditions.
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
              Your Privacy Matters
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              Have a question about your information?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
              If you have questions about this Privacy Policy or how your
              information is handled, our team is available to help.
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