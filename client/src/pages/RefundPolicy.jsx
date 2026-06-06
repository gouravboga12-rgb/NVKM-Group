export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 page-transition">
      <div className="text-center space-y-3" data-aos="fade-up">
        <span className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/25 text-rose-600 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
          <i className="fa-solid fa-rotate-left" /> Returns & Refunds
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#111827]">
          Refund Policy
        </h1>
        <p className="text-xs text-slate-400 font-medium">Last updated: June 6, 2026</p>
      </div>

      <div data-aos="fade-up" className="glass-premium rounded-[32px] p-6 sm:p-10 shadow-xl space-y-6 text-slate-650 text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
            1. Refund Eligibility: Damage Claims
          </h2>
          <p>
            Refunds are granted <strong className="text-rose-600 font-black">EXCLUSIVELY</strong> in the case of products received in a physically damaged condition or if the wrong item was delivered.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-rose-50/40 border border-rose-100/60 p-5 sm:p-6 rounded-2xl">
          <h2 className="font-heading font-extrabold text-lg text-rose-950 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-600 rounded-full" />
            2. The Mandatory Unboxing Rule
          </h2>
          <p className="text-rose-900 font-medium">
            To protect our small business and ensure a fair resolution, a <strong className="text-rose-700 font-extrabold">continuous, unedited unboxing video</strong> is strictly mandatory to claim a refund.
          </p>
          
          <div className="bg-white border border-rose-100 rounded-xl p-4 mt-2">
            <span className="block text-[10px] font-extrabold text-rose-600 uppercase tracking-widest mb-2">Video Requirements Checklist:</span>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
              <li>Video must start before opening the outer package seal.</li>
              <li>Show the shipping address label clearly in the frame.</li>
              <li>Capture the product seal and any physical damage in one single, uninterrupted shot.</li>
            </ul>
          </div>
          
          <div className="text-center font-black text-rose-700 text-sm mt-3 tracking-wide">
            ⚠️ NO VIDEO = NO REFUND.
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
            3. Manual Refund Process
          </h2>
          <p>
            For security and verification, all refunds are initiated manually:
          </p>
          <ul className="list-decimal pl-5 space-y-2.5">
            <li>
              <strong>WhatsApp Verification:</strong> Share your Order ID and the continuous unboxing video proof directly with the owner on WhatsApp at{' '}
              <a 
                href="https://wa.me/919398324095?text=Hello%20NVKM%20GROUP,%20I%20would%20like%2520to%2520claim%2520a%2520refund%2520for%2520order%2520damage.%20Here%20is%20my%20Order%20ID%20and%20unboxing%20video." 
                target="_blank" 
                rel="noreferrer" 
                className="font-extrabold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
              >
                <i className="fa-brands fa-whatsapp text-emerald-500" /> +91 93983 24095
              </a>.
            </li>
            <li>
              <strong>Review:</strong> Our team will review the proof and confirm the damage within 24-48 hours.
            </li>
            <li>
              <strong>Initiation:</strong> Once verified, the refund will be initiated to your original payment account.
            </li>
            <li>
              <strong>Timeline:</strong> The refunded amount will reflect in your bank account within <strong className="text-slate-800">5-7 working days</strong> after initiation.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-slate-400 rounded-full" />
            4. Non-Refundable Items
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Items damaged due to customer mishandling during opening (e.g., using sharp knives or scissors carelessly).</li>
            <li>Products that have been used, opened, washed, or altered from their original harvest packaging.</li>
            <li>Sale or discounted promotional items (unless received damaged and verified with unboxing proof).</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
