"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const heroImages = [
  "/images/solo.jpeg",
  "/images/solo-2.jpeg",
  "/images/solo-3.png",
  "/images/solo4.jpeg",
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // ============================================================
  // HERO IMAGE SLIDESHOW
  // Changes image every 5 seconds
  // ============================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Prevent background scrolling while sidebar is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-[#031b15]">

        {/* =========================================================
            MOBILE IMAGE SLIDESHOW
            ========================================================= */}
        <div className="absolute inset-x-0 top-0 h-[58%] md:hidden">

          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms] ease-in-out ${
                currentImage === index
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />
          ))}

          {/* Image darkening */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Mobile fade */}
          <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-[#031b15]/70 to-[#031b15]" />
        </div>


        {/* =========================================================
            DESKTOP IMAGE SLIDESHOW
            ========================================================= */}
        <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block">

          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms] ease-in-out ${
                currentImage === index
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />
          ))}

          {/* Darken image slightly */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Fade image into left content */}
          <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-[#031b15] via-[#031b15]/75 to-transparent" />

          {/* Fade image into bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#031b15] to-transparent" />

          {/* Slight top fade */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
        </div>


        {/* =========================================================
            NAVBAR
            ========================================================= */}
        <header className="relative z-30">
          <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 md:h-[88px] md:px-8 lg:px-10">

            {/* =====================================================
                SHARP AVIORÈGO WORDMARK
                ===================================================== */}
            <Link
              href="/"
              className="group flex items-center text-white"
            >
              <span className="text-[20px] font-extrabold tracking-[-0.8px] md:text-[22px]">
                Avior
                <span className="text-emerald-400">è</span>
                Go
              </span>
            </Link>


            {/* =====================================================
                DESKTOP NAVIGATION
                ===================================================== */}
            <div className="hidden items-center gap-8 lg:flex">

              <Link
                href="#services"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                Services
              </Link>

              <Link
                href="#events"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                Events
              </Link>

              <Link
                href="become-vendor"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                For Business
              </Link>

              <Link
                href="#about"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                About Us
              </Link>

            </div>


            {/* =====================================================
                DESKTOP ACTIONS
                ===================================================== */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="https://app.aviorego.com.ng"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#063c2d] transition hover:bg-white/90"
              >
                Get Started
              </Link>

              {/* Desktop menu button */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

            </div>


            {/* =====================================================
                MOBILE NAVIGATION
                ===================================================== */}
            <div className="flex items-center gap-2 md:hidden">

              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-xs font-medium text-white"
              >
                Log in
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

            </div>

          </nav>
        </header>


        {/* =========================================================
            HERO CONTENT
            ========================================================= */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-[1280px] flex-col justify-end px-5 pb-8 md:min-h-[calc(100vh-88px)] md:justify-center md:px-8 md:pb-0 lg:px-10">

          <div className="w-full md:max-w-[620px] lg:max-w-[650px]">

            {/* Eyebrow */}
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300 md:mb-5 md:text-xs">
              Food • Delivery • Events
            </p>


            {/* Heading */}
            <h1 className="max-w-[350px] text-[42px] font-extrabold leading-[0.96] tracking-[-2px] text-white md:max-w-[620px] md:text-[64px] md:leading-[0.98] md:tracking-[-3px] lg:text-[72px]">

              Everything You Need,
              <br />

              <span className="text-emerald-400">
                In One App.
              </span>

            </h1>


            {/* Description */}
            <p className="mt-4 max-w-[340px] text-[13px] leading-[1.55] text-white/75 md:mt-6 md:max-w-[500px] md:text-[16px] md:leading-[1.7]">
              Discover amazing food, get your items delivered,
              book transport for events and more — all on AviorèGo.
            </p>


            {/* =====================================================
                BUTTONS
                ===================================================== */}
            <div className="mt-6 space-y-2.5 md:mt-8 md:flex md:items-center md:gap-3 md:space-y-0">

              <a
                href="https://app.aviorego.com.ng"
                className="flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-[13px] font-bold text-white transition hover:bg-emerald-500 md:h-[50px] md:w-auto md:min-w-[150px] md:px-6"
              >
                Install App

                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>


              <Link
                href="become-vendor"
                className="flex h-[46px] w-full items-center justify-center rounded-full border border-white/70 bg-white/5 text-[13px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 md:h-[50px] md:w-auto md:min-w-[170px] md:px-6"
              >
                Become a Vendor
              </Link>

            </div>


            {/* =====================================================
                STORE BUTTONS
                ===================================================== */}
            <div className="mt-5 flex items-center gap-2 md:mt-7">

              <a
                href="https://app.aviorego.com.ng"
                className="flex h-[38px] items-center gap-2 rounded-md border border-white/25 bg-black/60 px-2.5 backdrop-blur-sm md:h-[44px] md:px-3"
              >
                <span className="text-[15px] text-white">
                  ▶
                </span>

                <div className="leading-none text-white">
                  <div className="text-[7px] opacity-70 md:text-[8px]">
                    GET IT ON
                  </div>

                  <div className="mt-0.5 text-[11px] font-semibold md:text-xs">
                    Google Play
                  </div>
                </div>
              </a>


              <a
                href="https://app.aviorego.com.ng"
                className="flex h-[38px] items-center gap-2 rounded-md border border-white/25 bg-black/60 px-2.5 backdrop-blur-sm md:h-[44px] md:px-3"
              >
                <span className="text-[15px] text-white">
                  ●
                </span>

                <div className="leading-none text-white">
                  <div className="text-[7px] opacity-70 md:text-[8px]">
                    DOWNLOAD ON THE
                  </div>

                  <div className="mt-0.5 text-[11px] font-semibold md:text-xs">
                    App Store
                  </div>
                </div>
              </a>

            </div>

          </div>
        </div>
      </section>


      {/* ============================================================
          SIDEBAR
          ============================================================ */}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />


      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[min(380px,88vw)] flex-col bg-[#031b15] shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-[20px] font-extrabold tracking-[-0.8px] text-white"
          >
            Avior<span className="text-emerald-400">è</span>Go
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>

        </div>


        {/* Sidebar Links */}
        <div className="flex flex-1 flex-col px-6 py-8">

          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
            Explore AviorèGo
          </p>

          <div className="flex flex-col">

            <Link
              href="#services"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-5 text-lg font-medium text-white transition hover:text-emerald-400"
            >
              Services
            </Link>

            <Link
              href="#events"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-5 text-lg font-medium text-white transition hover:text-emerald-400"
            >
              Events
            </Link>

            <Link
              href="become-vendor"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-5 text-lg font-medium text-white transition hover:text-emerald-400"
            >
              For Business
            </Link>

            <Link
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-5 text-lg font-medium text-white transition hover:text-emerald-400"
            >
              About Us
            </Link>

          </div>


          {/* Sidebar CTA */}
          <div className="mt-auto">

            <p className="mb-4 text-sm leading-relaxed text-white/50">
              Everything you need, from food and delivery to transport and events.
            </p>

            <a
              href="https://app.aviorego.com.ng"
              className="flex h-[50px] items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-500"
            >
              Install AviorèGo
            </a>

          </div>

        </div>
      </aside>
    </>
  );
}