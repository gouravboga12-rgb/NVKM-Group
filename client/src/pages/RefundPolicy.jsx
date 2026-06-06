export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 page-transition">
      <div className="text-center space-y-3" data-aos="fade-up">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 text-blue-600 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
          <i className="fa-solid fa-rotate-left" /> Returns & Refunds
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#111827]">
          Refund Policy
        </h1>
        <p className="text-xs text-slate-400 font-medium">Last updated: June 6, 2026</p>
      </div>

      <div data-aos="fade-up" className="glass-premium rounded-[32px] p-6 sm:p-10 shadow-xl space-y-6 text-slate-600 text-sm leading-relaxed">
        <p>
          Thank you for shopping at <strong>NVKM GROUP</strong>. Since our products are natural edible powders, fruit extracts, and wellness supplements, we follow a strict return and refund policy to ensure safety and hygiene.
        </p>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">1. Damages & Defect Replacement</h2>
        <p>
          We take extreme care in packaging. However, if you receive a package that was damaged during transit or contains the wrong product:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Notify us within <strong>24 hours</strong> of delivery.</li>
          <li>Send a photo or unboxing video of the damaged package/item to our support WhatsApp number at <strong>+91 90142 74293</strong> or via email at <strong>Navakiranamgroup@gmail.com</strong>.</li>
          <li>Once validated, we will ship a fresh replacement package immediately at no extra cost.</li>
        </ul>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">2. Cancellations</h2>
        <p>
          You can cancel your order within <strong>2 hours</strong> of placement, provided it has not already been processed or shipped. Once order status updates to "Processing" or "Shipped", we cannot accept cancellation requests.
        </p>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">3. Returns eligibility</h2>
        <p>
          Due to the perishable nature of agricultural and food powders, we do not accept returns for open, unsealed, or partially consumed products. Returns are accepted only if the product is completely unopened, original seals are intact, and the items are shipped back within 7 days of delivery.
        </p>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">4. Refund processing</h2>
        <p>
          For valid cancelled or returned orders:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Refunds will be processed back to the original payment source within 5–7 business days.</li>
          <li>If payment was made via Cash on Delivery (COD), we will ask for your UPI ID or bank account details to complete a bank transfer refund.</li>
        </ul>
      </div>
    </div>
  );
}
