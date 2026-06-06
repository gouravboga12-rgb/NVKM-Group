import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import ProductCard, { StarRating } from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartOpen } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editName, setEditName] = useState('');
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState(false);

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

  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (user && product) {
      api.get('/orders/my')
        .then(res => {
          const bought = res.data.some(order => 
            order.status !== 'Cancelled' && 
            (order.order_items || order.items || []).some(item => 
              item.product_slug === product.id || item.productId === product.id
            )
          );
          setHasPurchased(bought);
        })
        .catch(err => {
          console.error('Error checking purchase status:', err);
          setHasPurchased(false);
        });
    } else {
      setHasPurchased(false);
    }
  }, [user, product]);

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
        <Link to="/shop" className="inline-block mt-6 bg-primary hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md">
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

  const handleReviewEditSubmit = async (e, reviewId) => {
    e.preventDefault();
    if (!editComment.trim() || !editName.trim()) {
      showToast('Please fill all review fields.', 'error');
      return;
    }

    setSubmittingEdit(true);
    try {
      await api.put(`/products/${slug}/reviews/${reviewId}`, {
        rating: Number(editRating),
        comment: editComment.trim(),
        name: editName.trim()
      });

      showToast('Review updated successfully!');
      setEditingReviewId(null);

      // Refresh product details
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update review.', 'error');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/products/${slug}/reviews/${reviewId}`);
      showToast('Review deleted successfully!');

      // Refresh product details
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete review.', 'error');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, qty);
  };

  const handleBuyNow = () => {
    const success = addToCart(product, selectedWeight, qty, true);
    if (success) {
      setCartOpen(true);
    }
  };

  const handleWhatsAppInquiry = () => {
    const textMsg = `Hello NVKM GROUP, I am interested in purchasing your natural powder:\n- Product: ${product.name}\n- Packaging Weight: ${selectedWeight}\n- Quantity: ${qty}\nCould you please provide bulk wholesale rates and retail delivery details for my pincode?`;
    window.open(`https://wa.me/9014274293?text=${encodeURIComponent(textMsg)}`, '_blank');
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-24 sm:py-10 page-transition">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 sm:mb-8 font-semibold overflow-hidden">
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
                    className={`border-2 rounded-xl sm:rounded-2xl overflow-hidden aspect-square cursor-pointer transition-all duration-300 hover:scale-105 ${isSelected
                        ? 'border-primary bg-blue-50 shadow-md shadow-blue-950/5'
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
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-accent tracking-widest uppercase">{product.category}</span>
            <h1 className="font-heading font-extrabold text-xl xs:text-2xl sm:text-3xl text-darkText mt-0.5 tracking-tight">{product.name}</h1>

            <div className="flex items-center flex-wrap gap-2 mt-1.5">
              <StarRating rating={product.rating} />
              <span className="text-[11px] font-bold text-darkText">{product.rating}</span>
              <span className="text-[11px] text-slate-400 font-semibold">({product.reviewsCount} reviews)</span>
            </div>

            {/* Price banner */}
            {activeVariation && (
              <div className="mt-4 flex flex-wrap items-baseline gap-2 p-3 bg-gradient-to-r from-blue-50/70 to-slate-50/50 border border-blue-100/50 rounded-xl shadow-sm">
                <span className="text-2xl font-heading font-extrabold text-primary tracking-tight">₹{activeVariation.discountPrice}</span>
                {savePercent > 0 && (
                  <>
                    <span className="text-xs text-slate-400 line-through font-semibold">M.R.P: ₹{activeVariation.price}</span>
                    <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">Save {savePercent}%</span>
                  </>
                )}
              </div>
            )}

            {/* Delivery Charges Info */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-bold">
              <i className="fa-solid fa-truck text-primary text-[11px]"></i>
              {product.deliveryCharges > 0 ? (
                <span>Delivery Charges: <strong className="text-slate-800">₹{product.deliveryCharges}</strong></span>
              ) : (
                <span className="text-green-600 font-extrabold">FREE Delivery</span>
              )}
            </div>

            <p className="text-xs text-lightText mt-4 leading-relaxed font-medium text-slate-600">{product.longDesc || product.shortDesc}</p>

            {/* Weight variations */}
            <div className="mt-5">
              <span className="block text-[11px] font-bold text-darkText mb-2.5 uppercase tracking-wider"><i className="fa-solid fa-weight-hanging text-accent mr-1.5"></i> Available Weights / Sizes:</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.variations.map((v, index) => {
                  const isChecked = selectedWeight === v.weight;
                  return (
                    <label key={index} className="flex-1 min-w-[85px] cursor-pointer">
                      <input
                        type="radio"
                        name="pd-weight"
                        value={v.weight}
                        checked={isChecked}
                        onChange={() => setSelectedWeight(v.weight)}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-xl py-1.5 px-1.5 text-center transition-all duration-300 transform active:scale-95 shadow-sm ${isChecked
                          ? 'border-primary bg-blue-50/40 shadow-md shadow-blue-950/5 scale-[1.01]'
                          : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/50'
                        }`}>
                        <span className="block text-xs font-bold text-darkText">{v.weight}</span>
                        <span className="block text-[10px] text-accent font-bold mt-0.5">₹{v.discountPrice}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Qty */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-[11px] font-bold text-darkText uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 hover:text-primary transition-all active:scale-90"><i className="fa-solid fa-minus text-[10px]"></i></button>
                <span className="px-3 font-bold text-xs text-darkText w-10 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 hover:text-primary transition-all active:scale-90"><i className="fa-solid fa-plus text-[10px]"></i></button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100">
            <button onClick={handleAddToCart} className="flex-1 bg-slate-100 hover:bg-primary hover:text-white text-primary border border-transparent hover:border-primary/20 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01] hover:-translate-y-0.5 duration-300 text-xs">
              <i className="fa-solid fa-cart-shopping text-xs"></i> Add to Cart
            </button>
            <div className="flex gap-2 flex-1">
              <button onClick={handleBuyNow} className="flex-1 bg-accent hover:bg-accentHover text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-accent/20 transition-all hover:scale-[1.01] hover:-translate-y-0.5 duration-300 text-xs">
                <i className="fa-solid fa-bolt text-xs"></i> Buy Now
              </button>
              <button onClick={handleWhatsAppInquiry} className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-green-600/20 transition-all hover:scale-[1.01] hover:-translate-y-0.5 duration-300 text-xs" title="Inquire on WhatsApp">
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Product Information & Specifications */}
    {(product.ingredients || product.usage || (product.customFields && Object.keys(product.customFields).length > 0)) && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10" data-aos="fade-up">
        {/* Ingredients & Usage */}
        {(product.ingredients || product.usage) && (
          <div className="bg-white border border-slate-200/60 rounded-[24px] xs:rounded-[32px] p-6 md:p-8 shadow-md">
            <h3 className="font-heading font-extrabold text-lg text-darkText border-b border-slate-150 pb-4 flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-accent"></i> Product Information
            </h3>
            <div className="space-y-4 mt-5 text-slate-700">
              {product.ingredients && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ingredients / Composition</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">{product.ingredients}</p>
                </div>
              )}
              {product.usage && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-4">Suggested Usage</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">{product.usage}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Fields (Product Specifications) */}
        {product.customFields && Object.keys(product.customFields).length > 0 && (
          <div className={`bg-white border border-slate-200/60 rounded-[24px] xs:rounded-[32px] p-6 md:p-8 shadow-md ${!(product.ingredients || product.usage) ? 'md:col-span-2' : ''}`}>
            <h3 className="font-heading font-extrabold text-lg text-darkText border-b border-slate-150 pb-4 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-accent"></i> Specifications
            </h3>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {Object.entries(product.customFields).map(([key, val], idx) => (
                    <tr 
                      key={idx} 
                      className={`${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'} border-b border-slate-100/80 last:border-b-0`}
                    >
                      <td className="px-4 py-3 text-xs font-bold text-slate-800 w-1/3 border-r border-slate-100">{key}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-medium">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )}

      {/* Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10" data-aos="fade-up">
        {/* Review List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-[24px] xs:rounded-[32px] p-4 xs:p-6 md:p-8 shadow-md space-y-6">
          <h2 className="font-heading font-extrabold text-xl text-darkText border-b border-slate-150 pb-4 flex items-center gap-2"><i className="fa-solid fa-comments text-accent"></i> Customer Reviews ({product.reviewsCount})</h2>
          <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
            {product.reviews && product.reviews.length > 0 ? (
              (expandedReviews ? product.reviews : product.reviews.slice(0, 2)).map((rev, i) => (
                <div key={i} className="flex gap-3 xs:gap-4 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center font-heading font-bold text-xs xs:text-sm shrink-0 shadow-sm uppercase">
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
                    
                    {editingReviewId === rev.id ? (
                      <form onSubmit={(e) => handleReviewEditSubmit(e, rev.id)} className="space-y-3 mt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your Name</label>
                          <input 
                            type="text" 
                            required
                            value={editName} 
                            onChange={e => setEditName(e.target.value)} 
                            className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-medium" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Star Rating</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditRating(star)}
                                onMouseEnter={() => setEditHoverRating(star)}
                                onMouseLeave={() => setEditHoverRating(0)}
                                className="text-xl transition-transform active:scale-90 focus:outline-none"
                              >
                                <i 
                                  className={`fa-star ${
                                    star <= (editHoverRating || editRating) 
                                      ? 'fa-solid text-amber-400' 
                                      : 'fa-regular text-slate-350'
                                  }`}
                                ></i>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Comments / Review Text</label>
                          <textarea 
                            required
                            value={editComment} 
                            onChange={e => setEditComment(e.target.value)} 
                            rows="3" 
                            className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-medium resize-none"
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button 
                            type="button" 
                            disabled={submittingEdit}
                            onClick={() => setEditingReviewId(null)} 
                            className="px-3 py-1.5 border border-slate-250 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={submittingEdit}
                            className="px-4 py-1.5 bg-primary hover:bg-blue-850 text-white rounded-xl text-[10px] font-bold shadow-md shadow-primary/10 transition-all"
                          >
                            {submittingEdit ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed italic bg-slate-50/50 p-2.5 xs:p-3 rounded-xl xs:rounded-2xl border border-slate-100">"{rev.comment}"</p>
                        
                        {(() => {
                          const isAdmin = user && user.email === 'janagondanaveen@gmail.com';
                          const isOwner = user && rev.user_id === user.id;
                          const canManage = isAdmin || isOwner;
                          
                          if (!canManage) return null;
                          return (
                            <div className="flex items-center gap-4 mt-2 px-0.5">
                              <button 
                                onClick={() => {
                                  setEditingReviewId(rev.id);
                                  setEditRating(rev.rating);
                                  setEditComment(rev.comment);
                                  setEditName(rev.name || '');
                                  setEditHoverRating(0);
                                }} 
                                className="text-[10px] font-extrabold text-primary hover:text-blue-800 flex items-center gap-1 transition-colors"
                              >
                                <i className="fa-solid fa-pen-to-square text-[9px]"></i> Edit Review
                              </button>
                              <button 
                                onClick={() => handleReviewDelete(rev.id)} 
                                className="text-[10px] font-extrabold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                              >
                                <i className="fa-solid fa-trash-can text-[9px]"></i> Delete
                              </button>
                            </div>
                          );
                        })()}
                      </>
                    )}
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

          {product.reviews && product.reviews.length > 2 && (
            <div className="pt-2 flex justify-center">
              <button 
                onClick={() => setExpandedReviews(!expandedReviews)} 
                className="text-xs font-bold text-primary hover:text-blue-800 transition-colors flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200"
              >
                {expandedReviews ? (
                  <>
                    <i className="fa-solid fa-chevron-up text-[10px]"></i> Show Less Reviews
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-chevron-down text-[10px]"></i> View More Reviews ({product.reviews.length - 2} more)
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Submit Review */}
        <div className="bg-white border border-slate-200/60 rounded-[24px] xs:rounded-[32px] p-4 xs:p-6 md:p-8 shadow-md">
          <h2 className="font-heading font-extrabold text-xl text-darkText border-b border-slate-150 pb-4 flex items-center gap-2"><i className="fa-solid fa-pen-clip text-accent"></i> Submit Review</h2>
          
          {!user ? (
            <div className="text-center py-8 px-4 mt-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <i className="fa-solid fa-user-lock text-3xl text-slate-400 mb-3 block"></i>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Authentication Required</h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[280px] mx-auto font-medium">Please sign in to write a product review for verified purchase checks.</p>
              <Link 
                to="/login" 
                className="inline-block mt-4 bg-primary hover:bg-blue-800 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-md active:scale-95"
              >
                <i className="fa-solid fa-arrow-right-to-bracket mr-1.5 text-[10px]"></i> Sign In / Register
              </Link>
            </div>
          ) : !hasPurchased ? (
            <div className="text-center py-8 px-4 mt-5 bg-amber-50/50 border border-dashed border-amber-200 rounded-2xl">
              <i className="fa-solid fa-circle-info text-3xl text-amber-500 mb-3 block"></i>
              <h3 className="text-xs font-black text-amber-800 uppercase tracking-wider">Verified Purchase Only</h3>
              <p className="text-[11px] text-amber-600 mt-1 max-w-[280px] mx-auto font-semibold">Only customers who have purchased this product can leave a product review.</p>
              <Link 
                to="/shop" 
                className="inline-block mt-4 bg-white hover:bg-amber-50 text-amber-850 border border-amber-200 font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <i className="fa-solid fa-basket-shopping mr-1.5 text-[10px]"></i> Browse Shop
              </Link>
            </div>
          ) : (
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
              <div className="flex items-center gap-2 py-1">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl transition-all duration-155 transform hover:scale-115 active:scale-90 focus:outline-none"
                    >
                      <i 
                        className={`fa-star ${
                          star <= (hoverRating || reviewRating) 
                            ? 'fa-solid text-amber-400' 
                            : 'fa-regular text-slate-350'
                        }`}
                      ></i>
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500 ml-2 shadow-sm px-2 py-1 bg-slate-50 rounded-lg border border-slate-100/50">
                  {(hoverRating || reviewRating) === 5 && '5 Stars (Excellent)'}
                  {(hoverRating || reviewRating) === 4 && '4 Stars (Very Good)'}
                  {(hoverRating || reviewRating) === 3 && '3 Stars (Good)'}
                  {(hoverRating || reviewRating) === 2 && '2 Stars (Average)'}
                  {(hoverRating || reviewRating) === 1 && '1 Star (Poor)'}
                </span>
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
              className="w-full bg-primary hover:bg-blue-850 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 transform active:scale-98"
            >
              {submittingReview ? 'Submitting...' : 'Submit My Review'}
            </button>
          </form>
          )}
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

    {/* Sticky Bottom Action Bar for Mobile */}
    {activeVariation && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 px-4 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] flex items-center justify-between pb-safe">
        <div className="flex flex-col text-left">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{selectedWeight} Pack · Qty {qty}</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-primary">₹{activeVariation.discountPrice * qty}</span>
            {activeVariation.price > activeVariation.discountPrice && (
              <span className="text-[10px] text-slate-400 line-through">₹{activeVariation.price * qty}</span>
            )}
          </div>
          <span className="text-[8px] text-slate-400 font-semibold mt-0.5">Inclusive of all taxes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={handleBuyNow} className="bg-accent hover:bg-accentHover text-white font-extrabold text-[10px] xs:text-xs py-2 px-2.5 xs:px-3.5 rounded-xl flex items-center justify-center gap-1 shadow-md shadow-accent/15 active:scale-95 transition-all whitespace-nowrap">
            <i className="fa-solid fa-bolt text-[10px]"></i> Buy Now
          </button>
          <button onClick={handleAddToCart} className="bg-primary hover:bg-blue-900 text-white font-extrabold text-[10px] xs:text-xs py-2 px-2.5 xs:px-3.5 rounded-xl flex items-center justify-center gap-1 shadow-md shadow-primary/15 active:scale-95 transition-all whitespace-nowrap">
            <i className="fa-solid fa-cart-shopping text-[10px]"></i> Add to Cart
          </button>
        </div>
      </div>
    )}
  </>
  );
}
