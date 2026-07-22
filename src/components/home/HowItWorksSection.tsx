const steps = [
  { num: "1", title: "Book Pickup", desc: "Enter sender, receiver, and parcel info." },
  { num: "2", title: "Driver Assigned", desc: "Verified courier claims your request." },
  { num: "3", title: "Package Pickup", desc: "Courier collects package at your doorstep." },
  { num: "4", title: "Live Transit", desc: "Track shipment on GPS interactive map." },
  { num: "5", title: "PIN Verification", desc: "Receiver provides delivery confirmation PIN." },
  { num: "6", title: "Delivered", desc: "Payment released safely to driver." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 bg-neutral-50 border-t border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Simple Workflow
          </h2>
          <h3 className="text-3xl font-black text-neutral-900">
            How Aviorè Go Works
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="p-5 rounded-2xl bg-white border border-neutral-200/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                {step.num}
              </div>
              <h4 className="font-extrabold text-sm text-neutral-900">{step.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}