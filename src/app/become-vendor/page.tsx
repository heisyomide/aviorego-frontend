import Link from "next/link";

export default function BecomeVendorPage() {
  return (
    <main className="min-h-screen bg-white text-[#10231c]">
      {/* ================= HERO IMAGE ================= */}
      <section className="w-full">
        <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px] md:h-[430px] lg:h-[500px]">
          <img
            src="/images/vendor.jpeg"
            alt="AviorèGo vendor"
            className="h-full w-full object-cover object-center"
          />

          {/* Soft bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12 md:px-10 md:py-16 lg:px-12 lg:py-20">
          
          <div className="max-w-2xl">
            {/* Label */}
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#178653] sm:text-[10px]">
              Become a Vendor
            </p>

            {/* Heading */}
            <h1 className="mt-2 text-[30px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#10231c] sm:text-[38px] md:text-[48px] lg:text-[54px]">
              Grow Your Business
              <br />
              with AviorèGo
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-xl text-[11px] leading-[1.65] text-[#68756e] sm:text-[13px] md:text-[14px]">
              Join AviorèGo and reach more customers, grow your sales, and
              manage your business with simple tools built for local
              businesses.
            </p>

            {/* ================= BENEFITS ================= */}
            <div className="mt-7 space-y-4 sm:mt-9 sm:space-y-5">
              
              {/* Benefit 1 */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f7ef] text-[#138653] sm:h-10 sm:w-10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path d="M4 19V9" />
                    <path d="M10 19V5" />
                    <path d="M16 19v-8" />
                    <path d="M22 19V3" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-[#10231c] sm:text-[12px]">
                    More Customers
                  </h3>

                  <p className="mt-0.5 text-[8px] leading-[1.4] text-[#68756e] sm:text-[10px]">
                    Reach more people looking for your products and services.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f7ef] text-[#138653] sm:h-10 sm:w-10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path d="M4 5h16v14H4z" />
                    <path d="M8 9h8" />
                    <path d="M8 13h5" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-[#10231c] sm:text-[12px]">
                    Easy Management
                  </h3>

                  <p className="mt-0.5 text-[8px] leading-[1.4] text-[#68756e] sm:text-[10px]">
                    Manage orders, customers, and your business in one place.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f7ef] text-[#138653] sm:h-10 sm:w-10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path d="M12 3v18" />
                    <path d="M17 7.5c0-2-2-3.5-5-3.5s-5 1.5-5 3.5 2 3 5 3 5 1 5 3.5-2 3.5-5 3.5-5-1.5-5-3.5" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-[#10231c] sm:text-[12px]">
                    Reliable Support
                  </h3>

                  <p className="mt-0.5 text-[8px] leading-[1.4] text-[#68756e] sm:text-[10px]">
                    Get the support you need as your business grows.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="https://app.aviorego.com.ng"
              className="
                mt-8
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#11945d]
                px-5
                py-3
                text-[10px]
                font-bold
                text-white
                transition
                hover:bg-[#0d7f4e]
                sm:mt-10
                sm:w-auto
                sm:px-8
                sm:py-3.5
                sm:text-[11px]
              "
            >
              Register as a Vendor
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}