export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 page-transition">
      <div className="text-center space-y-3" data-aos="fade-up">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 text-blue-600 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
          <i className="fa-solid fa-shield-halved" /> Legal Information
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#111827]">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 font-medium">Last updated: June 6, 2026</p>
      </div>

      <div data-aos="fade-up" className="glass-premium rounded-[32px] p-6 sm:p-10 shadow-xl space-y-6 text-slate-600 text-sm leading-relaxed">
        <p>
          At <strong>NVKM GROUP</strong>, accessible from our e-commerce platform, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by NVKM GROUP and how we use it.
        </p>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">1. Information We Collect</h2>
        <p>
          If you register for an account, make a purchase, or contact us directly, we may collect personal details such as:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Contact details (Name, Phone number, Email address, Shipping and billing addresses)</li>
          <li>Account credentials (hashed passwords)</li>
          <li>Payment related information (processed securely via encrypted gateways like Razorpay; we do not store raw card/banking credentials on our servers)</li>
          <li>Details of inquiries sent through the contact form or WhatsApp</li>
        </ul>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect in various ways, including to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Provide, operate, and maintain our e-commerce store</li>
          <li>Process, package, ship, and track your orders</li>
          <li>Communicate with you regarding purchases, updates, or customer service</li>
          <li>Send security alerts, transactional emails, and order invoices</li>
          <li>Detect, prevent, and mitigate fraudulent activities or security breaches</li>
        </ul>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">3. Data Security & Storage</h2>
        <p>
          We employ state-of-the-art security measures (including HTTPS encryption, JWT session validation, and secure cloud storage in Supabase) to keep your personal data protected. While we take maximum precautions, no online transaction is 100% secure, and users are advised to keep account passwords confidential.
        </p>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">4. Third-Party Services</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We share data only with trusted partners required to process your transaction (e.g., Razorpay for payment processing and shipping providers for home delivery).
        </p>

        <h2 className="font-heading font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-2 pt-4">5. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding this Privacy Policy, feel free to contact us via email at <strong>Navakiranamgroup@gmail.com</strong> or call us at <strong>+91 90142 74293</strong>.
        </p>
      </div>
    </div>
  );
}
