import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard, { StarRating } from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartOpen } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch product details
    api.get(`/products/${slug}`)
      .then(res => {
        setProduct(res.data);
        setSelectedWeight(res.data.variations[0]?.weight || '');
        setSelectedImage(res.data.images?.[0] || res.data.image || '');
        setQty(1);

        // Fetch all products to filter related products
        return api.get('/products');
      })
      .then(res => {
        if (res && res.data) {
          const related = res.data.filter(p => p.id !== slug).slice(0, 3);
          setRelatedProducts(related);
        }
      })
      .catch(err => {
        console.error('Error loading product details:', err);
        showToast('Failed to load product details.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, showToast]);

  useEffect(() => {
    if (!loading && window.AOS) {
      setTimeout(() => {
        window.AOS.init({
          duration: 800,
          easing: 'ease-out-cubic',
          once: true
        });
        window.AOS.refresh();
      }, 100);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading font-extrabold text-2xl text-darkText">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="inline-block mt-6 bg-primary hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md">
          Back to Shop
        </Link>
      </div>
    );
  }

  const activeVariation = product.variations.find(v => v.weight === selectedWeight) || product.variations[0];
  const savePercent = activeVariation ? Math.round(((activeVariation.price - activeVariation.discountPrice) / activeVariation.price) * 100) : 0;
  const galleryImages = (product.images && product.images.length > 0) ? product.images : [product.image];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please fill all review fields.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${slug}/reviews`, {
        name: reviewName.trim(),
        rating: Number(reviewRating),
        comment: reviewComment.trim()
      });

      showToast('Review submitted successfully! Thank you.');
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');

      // Refresh product details to show new review
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, qty, true);
    setCartOpen(true);
  };

  const handleWhatsAppInquiry = () => {
    const textMsg = `Hello NVKM GROUP, I am interested in purchasing your natural powder:\n- Product: ${product.name}\n- Packaging Weight: ${selectedWeight}\n- Quantity: ${qty}\nCould you please provide bulk wholesale rates and retail delivery details for my pincode?`;
    window.open(`https://wa.me/9014274293?text=${encodeURIComponent(textMsg)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-transition">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 font-semibold">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <i className="fa-solid fa-chevron-right text-[8px] text-slate-400"></i>
        <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <i className="fa-solid fa-chevron-right text-[8px] text-slate-400"></i>
        <span className="text-slate-400 truncate">{product.name}</span>
      </nav>

      {/* Main Details Frame */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 glass-premium rounded-[24px] xs:rounded-[32px] sm:rounded-[38px] p-4 xs:p-6 md:p-10 border border-slate-200/80 shadow-md" data-aos="fade-up">
        {/* Gallery */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl xs:rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative shadow-md group">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md z-10">{product.badge}</span>
            )}
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(galleryImages.length, 4)}, 1fr)` }}>
              {galleryImages.map((img, idx) => {
                const isSelected = selectedImage === img;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`border-2 rounded-xl sm:rounded-2xl overflow-hidden aspect-square cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isSelected 
                        ? 'border-primary bg-emerald-50 shadow-md shadow-emerald-950/5' 
                        : 'border-slate-200 bg-white hover:border-slate-350'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-accent tracking-widest uppercase">{product.category}</span>
            <h1 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl text-darkText mt-1 tracking-tight">{product.name}</h1>
            
            <div className="flex items-center space-x-2 mt-2">
              <StarRating rating={product.rating} />
              <span className="text-xs font-bold text-darkText">{product.rating}</span>
              <span className="text-xs text-slate-400 font-semibold">({product.reviewsCount} verified customer reviews)</span>
            </div>

            {/* Price banner */}
            {activeVariation && (
              <div className="mt-6 flex flex-wrap items-baseline gap-2.5 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-emerald-50/70 to-slate-50/50 border border-emerald-100/50 rounded-2xl shadow-sm">
                <span className="text-4xl font-heading font-extrabold text-primary tracking-tight">₹{activeVariation.discountPrice}</span>
                {savePercent > 0 && (
                  <>
                    <span className="text-sm text-slate-400 line-through font-semibold">M.R.P: ₹{activeVariation.price}</span>
                    <span className="text-xs bg-red-500 text-white font-bold px-3 py-1 rounded-lg shadow-sm tracking-wide">Save {savePercent}%</span>
                  </>
                )}
              </div>
            )}

            <p className="text-sm text-lightText mt-5 leading-relaxed font-medium text-slate-650">{product.longDesc}</p>
            
            {/* Weight variations */}
            <div className="mt-6">
              <span className="block text-xs font-bold text-darkText mb-3 uppercase tracking-wider"><i className="fa-solid fa-weight-hanging text-accent mr-1.5"></i> Available Weights / Sizes:</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.variations.map((v, index) => {
                  const isChecked = selectedWeight === v.weight;
                  return (
                    <label key={index} className="flex-1 min-w-[90px] cursor-pointer">
                      <input
                        type="radio"
                        name="pd-weight"
                        value={v.weight}
                        checked={isChecked}
                        onChange={() => setSelectedWeight(v.weight)}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-xl xs:rounded-2xl py-2 px-2 xs:py-3 xs:px-3 text-center transition-all duration-300 transform active:scale-95 shadow-sm ${
                        isChecked 
                          ? 'border-primary bg-emerald-50/40 shadow-md shadow-emerald-950/5 scale-[1.02]' 
                          : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/50'
                      }`}>
                        <span className="block text-sm font-bold text-darkText">{v.weight}</span>
                        <span className="block text-xs text-accent font-bold mt-0.5">₹{v.discountPrice}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Qty */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-xs font-bold text-darkText uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-primary transition-all active:scale-90"><i className="fa-solid fa-minus text-xs"></i></button>
                <span className="px-5 font-bold text-sm text-darkText w-12 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-primary transition-all active:scale-90"><i className="fa-solid fa-plus text-xs"></i></button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
            <button onClick={handleAddToCart} className="flex-1 bg-slate-100 hover:bg-primary hover:text-white text-primary border border-transparent hover:border-primary/20 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] hover:-translate-y-0.5 duration-300">
              <i className="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-accent hover:bg-accentHover text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all hover:scale-[1.01] hover:-translate-y-0.5 duration-300">
              <i className="fa-solid fa-bolt"></i> Buy It Now
            </button>
            <button onClick={handleWhatsAppInquiry} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] hover:-translate-y-0.5 duration-300" title="Inquire on WhatsApp">
              <i className="fa-brands fa-whatsapp text-2xl"></i>
              <span className="sm:hidden text-sm">Inquire on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Tabs */}
      <div className="mt-10 bg-white border border-slate-200/60 rounded-[24px] xs:rounded-[32px] overflow-hidden shadow-md" data-aos="fade-up">
        {/* Tab Triggers */}
        <div className="flex border-b text-[11px] xs:text-xs sm:text-sm font-bold bg-slate-50/50 p-1">
          {['benefits', 'ingredients', 'usage'].map((tab) => {
            const label = tab === 'benefits' ? (
              <>
                <span className="sm:hidden">Benefits</span>
                <span className="hidden sm:inline">Key Benefits</span>
              </>
            ) : tab === 'ingredients' ? (
              <>
                <span className="sm:hidden">Ingredients</span>
                <span className="hidden sm:inline">Ingredients Info</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Usage</span>
                <span className="hidden sm:inline">Usage Instructions</span>
              </>
            );
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-4 text-center rounded-xl xs:rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-emerald-800 text-white shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-semibold'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 xs:p-6 md:p-8 bg-white">
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed p-3 xs:p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl xs:rounded-2xl">
                    <i className="fa-solid fa-circle-check text-accent text-lg mt-0.5"></i>
                    <span className="font-semibold">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-darkText text-lg flex items-center gap-2"><i className="fa-solid fa-flask text-accent"></i> Pure Content Formula</h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3 xs:p-4 border border-slate-100 rounded-xl xs:rounded-2xl font-medium">{product.ingredients}</p>
              <div className="flex items-center gap-2.5 p-3 xs:p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl xs:rounded-2xl text-xs text-primary font-bold mt-4">
                <i className="fa-solid fa-shield-heart text-accent text-sm"></i>
                <span>Free from preservatives, fillers, starches, chemical anti-caking compounds, or sugars.</span>
              </div>
            </div>
          )}
          {activeTab === 'usage' && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-darkText text-lg flex items-center gap-2"><i className="fa-solid fa-utensils text-accent"></i> How to Consume</h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3 xs:p-4 border border-slate-100 rounded-xl xs:rounded-2xl font-medium">{product.usage}</p>
              <div className="flex items-center gap-2.5 p-3 xs:p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl xs:rounded-2xl text-xs text-primary font-bold mt-4">
                <i className="fa-solid fa-clock text-accent text-sm"></i>
                <span>Recommended shelf life: Store in airtight container in dry, cool cabinet shelf environment.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10" data-aos="fade-up">
        {/* Review List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-[24px] xs:rounded-[32px] p-4 xs:p-6 md:p-8 shadow-md space-y-6">
          <h2 className="font-heading font-extrabold text-xl text-darkText border-b border-slate-150 pb-4 flex items-center gap-2"><i className="fa-solid fa-comments text-accent"></i> Customer Reviews ({product.reviewsCount})</h2>
          <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev, i) => (
                <div key={i} className="flex gap-3 xs:gap-4 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-gradient-to-br from-primary to-emerald-700 text-white flex items-center justify-center font-heading font-bold text-xs xs:text-sm shrink-0 shadow-sm uppercase">
                    {rev.name ? rev.name.charAt(0) : 'A'}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-darkText text-sm">{rev.name}</h4>
                      <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-amber-400">
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed italic bg-slate-50/50 p-2.5 xs:p-3 rounded-xl xs:rounded-2xl border border-slate-100">"{rev.comment}"</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <i className="fa-solid fa-feather-pointed text-3xl text-slate-300 mb-2"></i>
                <p className="text-xs text-slate-400">No customer reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Review */}
        <div className="bg-white border border-slate-200/60 rounded-[24px] xs:rounded-[32px] p-4 xs:p-6 md:p-8 shadow-md">
          <h2 className="font-heading font-extrabold text-xl text-darkText border-b border-slate-150 pb-4 flex items-center gap-2"><i className="fa-solid fa-pen-clip text-accent"></i> Submit Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4 mt-5">
            <div>
              <label className="block text-xs font-bold text-darkText mb-1.5 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-inner font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-darkText mb-1.5 uppercase tracking-wider">Star Rating</label>
              <div className="relative">
                <select
                  value={reviewRating}
                  onChange={e => setReviewRating(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Very Good)</option>
                  <option value="3">3 Stars (Good)</option>
                  <option value="2">2 Stars (Average)</option>
                  <option value="1">1 Star (Poor)</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-3.5 text-slate-400 text-xs pointer-events-none"></i>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-darkText mb-1.5 uppercase tracking-wider">Comments / Review Text</label>
              <textarea
                rows="4"
                required
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-inner font-medium resize-none"
                placeholder="How is the mixability, aroma, taste, and freshness?"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="w-full bg-primary hover:bg-emerald-850 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 transform active:scale-98"
            >
              {submittingReview ? 'Submitting...' : 'Submit My Review'}
            </button>
          </form>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16" data-aos="fade-up">
          <h2 className="font-heading font-extrabold text-2xl text-darkText mb-8 text-center">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
