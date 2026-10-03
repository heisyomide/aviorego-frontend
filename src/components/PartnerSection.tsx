import Image from "next/image";

type Partner = {
  name: string;
  logo: string;
};

const partners: Partner[] = [
  {
    name: "ARA",
    logo: "/images/ara.png",
  },
  {
    name: "Partner 2",
    logo: "/images/ara.png",
  },
  {
    name: "Partner 3",
    logo: "/images/ara.png",
  },
  {
    name: "Partner 4",
    logo: "/images/ara.png",
  },
  {
    name: "Partner 5",
    logo: "/images/ara.png",
  },
];

export default function PartnerSection() {
  return (
    <section className="relative overflow-hidden py-8 md:py-10">
      {/* Soft green fade background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003b2b] via-[#08734f] to-[#dff5e8]" />

      {/* Extra soft glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_50%,rgba(94,234,212,0.18),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-100">
            Our Partners
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white md:text-base">
            Partnering for better experiences
          </h2>
        </div>

        <div className="mt-6 flex items-center justify-start gap-8 overflow-x-auto pb-1 md:justify-center md:gap-12 md:overflow-visible">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex h-10 min-w-[90px] shrink-0 items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={90}
                height={40}
                className="max-h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}