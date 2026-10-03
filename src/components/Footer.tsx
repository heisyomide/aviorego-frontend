"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#07120f] px-5 pb-6 pt-10  text-white sm:px-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Main footer */}
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-8">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-[24px] font-extrabold tracking-[-0.04em]"
            >
              <span className="text-white">Avior</span>
              <span className="text-[#20a96d]">è</span>
              <span className="text-white">Go</span>
            </Link>

            <p className="mt-1 text-[9px] font-medium tracking-wide text-white/45">
              Food • Delivery • Events
            </p>

            <p className="mt-4 max-w-[220px] text-[9px] leading-[1.6] text-white/45">
              Everything you need, in one app. Connecting people, businesses
              and communities with simple, reliable services.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-[10px] font-bold text-white">
              Quick Links
            </h3>

            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  href="/ambassadors"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  Ambassadors
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-[10px] font-bold text-white">
              Support
            </h3>

            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#faq"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  href="#faq"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  FAQs
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-[10px] font-bold text-white">
              Legal
            </h3>

            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-[9px] text-white/50 transition hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

     {/* FOLLOW US */}
<div>
  <h3 className="text-[10px] font-bold text-white">
    Follow Us
  </h3>

  <div className="mt-3 flex items-center gap-2.5">
    {/* Instagram */}
    <a
      href="https://www.instagram.com/aviorego"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:border-[#20a96d] hover:text-[#20a96d]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-3.5 w-3.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle
          cx="17.5"
          cy="6.5"
          r="1"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    </a>

    {/* X */}
    <a
      href="https://x.com/aviorego"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="X"
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[11px] font-bold text-white/60 transition hover:border-[#20a96d] hover:text-[#20a96d]"
    >
      X
    </a>

    {/* TikTok */}
    <a
      href="https://www.tiktok.com/aviorego"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="TikTok"
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold text-white/60 transition hover:border-[#20a96d] hover:text-[#20a96d]"
    >
      ♪
    </a>

    {/* Facebook */}
    <a
      href="https://www.facebook.com/aviorego"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[11px] font-bold text-white/60 transition hover:border-[#20a96d] hover:text-[#20a96d]"
    >
      f
    </a>

    {/* YouTube */}
    <a
      href="https://www.youtube.com/aviorego"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="YouTube"
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold text-white/60 transition hover:border-[#20a96d] hover:text-[#20a96d]"
    >
      ▶
    </a>
  </div>
</div>
</div>

        {/* Bottom divider */}
        <div className="mt-8 border-t border-white/10 pt-4">
          <div className="flex flex-col gap-2 text-[8px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2025 AviorèGo. All rights reserved.</p>

            <p>
              Made for a more connected Nigeria.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}