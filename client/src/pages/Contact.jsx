import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast('Thank you for contacting NVKM GROUP! We will respond within 24 hours.');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const GENERAL_WA_MSG = 'Hello NVKM GROUP, I am interested in your natural powder products. Please provide details.';

  const contactDetails = [
    {
      icon: 'fa-phone',
      label: 'Call Support',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      content: (
        <div className="flex flex-col gap-1 mt-1">
          <a href="tel:9014274293" className="font-extrabold text-slate-800 hover:text-emerald-600 transition-colors text-sm">+91 9014274293</a>
          <a href="tel:7075604700" className="font-extrabold text-slate-800 hover:text-emerald-600 transition-colors text-sm">+91 7075604700</a>
        </div>
      )
    },
    {
      icon: 'fa-brands fa-whatsapp',
      label: 'WhatsApp Chats',
      color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
      content: (
        <div className="flex flex-col gap-1 mt-1">
          <a href={`https://wa.me/9014274293?text=${encodeURIComponent(GENERAL_WA_MSG)}`} target="_blank" rel="noreferrer" className="font-extrabold text-emerald-600 hover:text-[#22c55e] transition-colors text-sm">+91 9014274293</a>
          <a href={`https://wa.me/7075604700?text=${encodeURIComponent(GENERAL_WA_MSG)}`} target="_blank" rel="noreferrer" className="font-extrabold text-emerald-600 hover:text-[#22c55e] transition-colors text-sm">+91 7075604700</a>
        </div>
      )
    },
    {
      icon: 'fa-envelope',
      label: 'Email Support',
      color: 'text-blue-500 bg-blue-50 border-blue-100',
      content: (
        <a href="mailto:Navakiranamgroup@gmail.com" className="font-extrabold text-slate-800 hover:text-emerald-600 transition-colors text-xs block mt-1 break-all">Navakiranamgroup@gmail.com</a>
      )
    },
    {
      icon: 'fa-map-location-dot',
      label: 'Factory Store Address',
      color: 'text-amber-500 bg-amber-50 border-amber-100',
      content: (
        <p className="font-bold text-slate-800 leading-relaxed text-xs mt-1">
          Near bypass Anantapur Road, Bathalapalli,<br />Sri Sathya Sai Dist, Andhra Pradesh 515661
        </p>
      )
    }
  ];

  const faqs = [
    { q: 'Do you offer wholesale pricing?', a: 'Yes! We offer tiered wholesale pricing for bulk orders above 5 kg with up to 40% discount. Contact us on WhatsApp for a custom quote.' },
    { q: 'Are your powders organic and preservative-free?', a: 'Absolutely. All NVKM GROUP powders are 100% natural — no artificial preservatives, colorants, MSG, or fillers of any kind.' },
    { q: 'How do I place a bulk order?', a: 'You can place bulk orders directly through our website or contact us via WhatsApp at +91 9014274293 for personalized B2B support and pricing.' },
    { q: 'Do you ship across India?', a: 'Yes, we ship PAN India with express delivery options. We also offer physical store pickup from our factory in Bathalapalli, Andhra Pradesh.' }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16 page-transition">

      {/* ── PAGE HEADER ── */}
      <div className="text-center max-w-2xl mx-auto space-y-4" data-aos="fade-up">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
          <i className="fa-solid fa-headset" /> Get In Touch
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#111827] bg-gradient-to-r from-[#111827] to-[#14532d] bg-clip-text text-transparent">
          Contact NVKM GROUP
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
          Reach out to us directly for retail orders, dealer queries, wholesale quotations, or store pickups. We typically respond within a few hours.
        </p>
      </div>

      {/* ── QUICK CONTACT CHIPS ── */}
      <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up">
        {[
          { href: 'tel:9014274293', icon: 'fa-phone', label: 'Call Now', bg: 'bg-gradient-to-r from-[#14532d] to-[#166534] text-white hover:scale-[1.02] shadow-lg shadow-green-950/20' },
          { href: `https://wa.me/9014274293?text=${encodeURIComponent(GENERAL_WA_MSG)}`, icon: 'fa-brands fa-whatsapp', label: 'WhatsApp Chat', bg: 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white hover:scale-[1.02] shadow-lg shadow-green-500/20', external: true },
          { href: 'mailto:Navakiranamgroup@gmail.com', icon: 'fa-envelope', label: 'Email Us', bg: 'bg-white border border-slate-200 text-slate-700 hover:shadow-md hover:scale-[1.02]' }
        ].map(({ href, icon, label, bg, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className={`inline-flex items-center gap-2 font-extrabold text-xs py-3 px-6 rounded-full transition-all duration-300 ${bg}`}
          >
            <i className={`fa-solid ${icon}`} /> {label}
          </a>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Contact Form */}
        <div data-aos="fade-right" className="lg:col-span-7 glass-premium rounded-[32px] p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#14532d] to-[#22c55e] flex items-center justify-center shadow-md">
              <i className="fa-solid fa-paper-plane text-white text-sm" />
            </div>
            <h2 className="font-heading font-extrabold text-lg text-slate-900">Send Us A Message</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3.5 rounded-2xl text-xs outline-none transition-all duration-200 text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3.5 rounded-2xl text-xs outline-none transition-all duration-200 text-slate-800 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">Email Address (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3.5 rounded-2xl text-xs outline-none transition-all duration-200 text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">Subject</label>
              <div className="relative">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3.5 rounded-2xl text-xs outline-none transition-all duration-200 text-slate-800 font-medium cursor-pointer appearance-none"
                >
                  <option value="">Select inquiry type...</option>
                  <option value="retail">Retail Order Inquiry</option>
                  <option value="wholesale">Wholesale / Bulk Pricing</option>
                  <option value="product">Product Information</option>
                  <option value="delivery">Delivery / Shipping</option>
                  <option value="other">Other Inquiry</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <i className="fa-solid fa-chevron-down text-[10px]" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">Message / Inquiry Details *</label>
              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please list the powders (Banana, Moringa, etc.) and quantities (Retail/Wholesale) you are interested in..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3.5 rounded-2xl text-xs outline-none transition-all duration-200 text-slate-800 font-medium resize-none leading-relaxed"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-[#14532d] to-[#22c55e] disabled:from-slate-400 disabled:to-slate-400 text-white font-extrabold text-xs py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 self-start cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Contact Details */}
          <div data-aos="fade-left" className="glass-premium rounded-[32px] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#14532d] to-[#22c55e] flex items-center justify-center shadow-md">
                <i className="fa-solid fa-address-book text-white text-sm" />
              </div>
              <h2 className="font-heading font-extrabold text-sm text-slate-900">Connect Directly</h2>
            </div>
            <div className="flex flex-col gap-5">
              {contactDetails.map(({ icon, label, content, color }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-4 ${i > 0 ? 'pt-5 border-t border-slate-100' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${color}`}>
                    <i className={icon} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">{label}</span>
                    {content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div data-aos="fade-left" data-aos-delay="100" className="bg-gradient-to-tr from-[#14532d] to-[#065f46] text-white rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-[-40px] right-[-40px] w-[150px] h-[150px] rounded-full bg-radial-gradient(circle,rgba(74,222,128,.12),transparent) pointer-events-none" />
            <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2 pb-4 mb-4 border-b border-white/10">
              <i className="fa-solid fa-clock text-[#4ade80]" /> Business &amp; Store Hours
            </h3>
            <div className="flex flex-col gap-3">
              {[
                ['Monday – Friday', '9:00 AM – 7:00 PM', true],
                ['Saturday', '9:00 AM – 5:00 PM', true],
                ['Sunday', 'Store Closed', false]
              ].map(([day, time, open]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-xs text-emerald-100/80 font-medium">{day}</span>
                  <span className={`text-xs font-extrabold ${open ? 'text-[#4ade80]' : 'text-emerald-300/40'}`}>{time}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-emerald-200/60 mt-4 pt-4 border-t border-white/10">
              Online orders accepted 24/7 via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ SECTION ── */}
      <div data-aos="fade-up" className="glass-premium rounded-[32px] p-6 sm:p-10 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-[10px] font-extrabold text-[#22c55e] tracking-widest uppercase">Common Questions</span>
          <h2 className="font-heading font-black text-2xl text-slate-900 mt-2">Frequently Asked Questions</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full mx-auto mt-3" />
        </div>
        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openFaq === i
                  ? 'border-emerald-200 bg-emerald-50/15 shadow-md shadow-emerald-800/5'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-transparent outline-none cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-800 pr-4">{q}</span>
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    openFaq === i ? 'bg-gradient-to-tr from-[#14532d] to-[#22c55e] text-white' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <i
                    className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              {openFaq === i && (
                <div className="px-4 sm:px-5 pb-4 border-t border-slate-100/50">
                  <p className="pt-3 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── GOOGLE MAP ── */}
      <div data-aos="fade-up" className="bg-white border border-slate-100 rounded-[32px] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-heading font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-map-location-dot text-[#16a34a]" /> Factory Location Map
        </h3>
        <div className="rounded-2xl overflow-hidden h-[350px] shadow-inner border border-slate-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15447.886026945038!2d77.7845700779774!3d14.543598715878345!2m3!1f0!2f0!3f0!3m2!1i1020!2i768!4f13.1!3m3!1m2!1s0x3bb3dfcaec9a531f%3A0xe54ef92c10b7b15a!2sBathalapalli%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="NVKM GROUP Factory Map"
          />
        </div>
      </div>

    </div>
  );
}
