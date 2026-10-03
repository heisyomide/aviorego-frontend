"use client";

export default function RegionalBanner() {
  return (
    <section id="regional-banner" className="w-full overflow-hidden">
   {/* ================= DESKTOP ================= */}
<div className="relative hidden h-[205px] w-full overflow-hidden md:block">

  {/* OSOGBO IMAGE — extends underneath the curve */}
  <div className="absolute inset-y-0 left-0 w-[31%] overflow-hidden">
    <img
      src="/images/osogbo.jpeg"
      alt="Osogbo"
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* Soft image → green gradient */}
    <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-r from-transparent to-[#00412e]" />
  </div>

  {/* PROUDLY SERVING — curved over the image */}
  <div
    className="
      absolute
      inset-y-0
      left-[24%]
      z-10
      flex
      w-[29%]
      items-center
      rounded-l-[100px]
      bg-[#00412e]
      pl-14
      pr-8
    "
  >
    <div>
      <div className="mb-1.5 text-[#1da56c]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
          <circle cx="12" cy="9" r="2.2" />
        </svg>
      </div>

      <p className="text-[8px] font-medium text-white">
        Proudly Serving
      </p>

      <h2 className="mt-0.5 text-[18px] font-extrabold leading-none text-white">
        Osogbo and Beyond
      </h2>

      <p className="mt-2 max-w-[225px] text-[8px] leading-[1.45] text-white/65">
        We're starting here, but our vision is bigger. AviorèGo is
        building a more connected and convenient future for
        communities across Nigeria and beyond.
      </p>
    </div>
  </div>

  {/* GET THE APP */}
  <div
    className="
      absolute
      inset-y-0
      left-[53%]
      flex
      w-[27%]
      items-center
      bg-[#edf9f1]
      px-8
    "
  >
    <div>
      <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#178653]">
        Install AviorèGo
      </p>

      <h2 className="mt-1 text-[17px] font-extrabold leading-tight text-[#10231c]">
        Get the App. Stay Connected.
      </h2>

      <p className="mt-1.5 max-w-[210px] text-[8px] leading-[1.45] text-[#68756e]">
        Install the AviorèGo app on your phone for a faster,
        smoother experience and exclusive features.
      </p>

      <a
        href="https://app.aviorego.com.ng"
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#11945d] px-3 py-1.5 text-[7px] font-bold text-white"
      >
        Install App
        <span>↓</span>
      </a>
    </div>
  </div>

  {/* PHONE AREA */}
  <div
    className="
      absolute
      inset-y-0
      right-0
      flex
      w-[35%]
      items-end
      justify-center
      overflow-hidden
      bg-[#edf9f1]
    "
  >
    {/* Phone */}
    <div
      className="
        relative
        z-10
        h-[185px]
        w-[91px]
        overflow-hidden
        rounded-t-[17px]
        border-[3px]
        border-black
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.18)]
      "
    >
      <div className="absolute left-1/2 top-0 z-20 h-[13px] w-[42px] -translate-x-1/2 rounded-b-[8px] bg-black" />

      <img
        src="/images/solo-3.png"
        alt="AviorèGo app"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Home screen text */}
    <div className="absolute right-22 top-[58px] z-20">
      <p className="max-w-[55px] text-[7px] font-medium leading-[1.35] text-[#168453]">
        Add to
        <br />
        Home Screen
        <br />
        and get started!
      </p>

      <div className="mt-1 text-[20px] leading-none text-[#168453]">
        ↙
      </div>
    </div>
  </div>
</div>
      {/* ================= MOBILE ================= */}
      <div className="md:hidden">

        {/* IMAGE FIRST */}
        <div className="h-[145px] w-full">
          <img
            src="/images/osogbo.jpeg"
            alt="Osogbo"
            className="h-full w-full object-cover"
          />
        </div>

        {/* GREEN CURVED PANEL */}
        <div className="relative -mt-7 rounded-t-[45px] bg-[#00412e] px-6 pb-6 pt-8">
          <div>
            <div className="mb-1 text-[#1da56c]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.2" />
              </svg>
            </div>

            <p className="text-[8px] text-white">
              Proudly Serving
            </p>

            <h2 className="mt-0.5 text-[20px] font-extrabold leading-tight text-white">
              Osogbo and Beyond
            </h2>

            <p className="mt-2 max-w-[320px] text-[9px] leading-[1.5] text-white/65">
              We're starting here, but our vision is bigger. AviorèGo is
              building a more connected and convenient future for
              communities across Nigeria and beyond.
            </p>
          </div>
        </div>

        {/* APP AREA */}
        <div className="flex min-h-[175px] items-center justify-between gap-5 bg-[#edf9f1] px-6 py-6">
          <div className="min-w-0">
            <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#168453]">
              Install AviorèGo
            </p>

            <h2 className="mt-1 text-[18px] font-extrabold leading-tight text-[#10231c]">
              Get the App.
              <br />
              Stay Connected.
            </h2>

            <p className="mt-1.5 max-w-[190px] text-[8px] leading-[1.5] text-[#68756e]">
              Install the AviorèGo app on your phone for a faster,
              smoother experience.
            </p>

            <a
              href="https://app.aviorego.com.ng"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#11945d] px-3 py-2 text-[8px] font-bold text-white"
            >
              Install App
              <span>↓</span>
            </a>
          </div>

          {/* MOBILE PHONE */}
          <div
            className="
              relative
              h-[145px]
              w-[72px]
              shrink-0
              overflow-hidden
              rounded-t-[14px]
              border-[2px]
              border-black
              bg-white
              shadow-md
            "
          >
            <div className="absolute left-1/2 top-0 z-10 h-[10px] w-[32px] -translate-x-1/2 rounded-b-[6px] bg-black" />

            <img
              src="/images/solo-3.png"
              alt="AviorèGo app"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}