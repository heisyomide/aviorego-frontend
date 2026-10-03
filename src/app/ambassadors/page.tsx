"use client";

const ambassadors = [
  {
    id: 1,
    name: "Kehinde Samuel",
    role: "AviorèGo Ambassador",
    image: "/images/solo.jpeg",
    bio: "Your ambassador bio goes here.",
    instagram: "@kennyritchiecomedian",
    x: "@KennyRitchiecomedian",
    tiktok: "@kennyritchiecomedian",
  },
 {
  id: 2,
  name: "Firepemi Tolulope",
  role: "AviorèGo Ambassador",
  image: "/images/fire.jpeg",
  bio: "A Nollywood creative passionate about storytelling, entertainment, and connecting people through meaningful experiences.",
  instagram: "@Oluwafirepemi_tolulopee",
  x: "@Oluwafirepemi_tolulope",
  tiktok: "@Oluwafirepemi_tolulope",
},
{
  id: 3,
  name: "Adelusi Adedamola",
  role: "AviorèGo Ambassador",
  image: "/images/damola.jpeg",
  bio: "A Nollywood talent bringing creativity, passion, and authentic storytelling to the screen and entertainment industry.",
  instagram: "@big_dhammy001",
  x: "@bigdhammy001",
  tiktok: "@bigdhammy001",
},
{
  id: 4,
  name: "Oke Anjolaoluwa",
  role: "AviorèGo Growth Partner",
  image: "/images/jola.jpeg",
  bio: "Public Health practitioner and entrepreneur passionate about innovation, partnerships, and creating opportunities for business growth.",
  instagram: "@adejolaoluwa.oke",
  x: "@Madejolaoluwa",
  tiktok: "@mercy_adejola",
},
];

export default function AmbassadorsPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">

      {/* ================= MOBILE ================= */}
      <section className="md:hidden">

        <div
          className="
            flex
            h-[100svh]
            w-full
            snap-x
            snap-mandatory
            overflow-x-auto
            overscroll-x-contain
            scroll-smooth
            scrollbar-none
          "
        >
          {ambassadors.map((ambassador, index) => (
            <article
              key={ambassador.id}
              className="
                relative
                h-[100svh]
                min-w-full
                shrink-0
                snap-center
                overflow-hidden
                bg-[#00412e]
              "
            >
              {/* IMAGE */}
              <div className="absolute inset-x-0 top-0 h-[58%]">
                <img
                  src={ambassador.image}
                  alt={ambassador.name}
                  className="h-full w-full object-cover"
                />

                {/* Image fade */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#00412e] to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 pt-20 text-white">

                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#35c486]">
                  {ambassador.role}
                </p>

                <h1 className="mt-2 text-[30px] font-extrabold leading-none tracking-[-0.04em]">
                  {ambassador.name}
                </h1>

                <p className="mt-2 text-[9px] font-medium text-white/60">
                  {ambassador.instagram}
                </p>

                <p className="mt-4 max-w-[330px] text-[10px] leading-[1.65] text-white/75">
                  {ambassador.bio}
                </p>

                {/* SOCIALS */}
                <div className="mt-5 flex items-center gap-2">
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[11px]"
                    aria-label="Instagram"
                  >
                    ◎
                  </a>

                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold"
                    aria-label="X"
                  >
                    X
                  </a>

                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[12px]"
                    aria-label="TikTok"
                  >
                    ♪
                  </a>
                </div>

                {/* POSITION */}
                <div className="mt-7 flex items-center justify-between">
                  <span className="text-[8px] text-white/40">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(ambassadors.length).padStart(2, "0")}
                  </span>

                  {index < ambassadors.length - 1 && (
                    <span className="text-[8px] font-medium text-white/45">
                      Swipe left →
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

      </section>

      {/* ================= DESKTOP ================= */}
      <section className="hidden px-10 py-16 md:block lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#168453]">
              Our Brand Ambassadors
            </p>

            <h1 className="mt-2 text-[44px] font-extrabold leading-none tracking-[-0.04em] text-[#10231c]">
              Meet the faces behind
              <br />
              <span className="text-[#11945d]">AviorèGo.</span>
            </h1>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {ambassadors.map((ambassador) => (
              <article
                key={ambassador.id}
                className="overflow-hidden rounded-[18px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="h-[330px] overflow-hidden">
                  <img
                    src={ambassador.image}
                    alt={ambassador.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#168453]">
                    {ambassador.role}
                  </p>

                  <h2 className="mt-1 text-[20px] font-extrabold text-[#10231c]">
                    {ambassador.name}
                  </h2>

                  <p className="mt-1 text-[8px] text-[#11945d]">
                    {ambassador.instagram}
                  </p>

                  <p className="mt-3 text-[9px] leading-[1.6] text-[#68756e]">
                    {ambassador.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}