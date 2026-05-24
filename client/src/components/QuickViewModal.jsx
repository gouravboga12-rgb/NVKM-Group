import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { StarRating } from './ProductCard';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, setCartOpen } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const activeWeight = selectedWeight || product.variations[0]?.weight;
  const variation = product.variations.find(v => v.weight === activeWeight) || product.variations[0];
  const savePercent = variation ? Math.round(((variation.price - variation.discountPrice) / variation.price) * 100) : 0;

  const imagesList = (product.images && product.images.length > 0) ? product.images : [product.image];

  const handleClose = () => { 
    setQuickViewProduct(null); 
    setSelectedWeight(null); 
    setQty(1); 
    setActiveImgIdx(0);
  };

  const handleAddToCart = () => { addToCart(product, activeWeight, qty); handleClose(); };
  const handleBuyNow = () => { addToCart(product, activeWeight, qty, true); handleClose(); setCartOpen(true); };

  const handleWhatsApp = () => {
    const msg = `Hello NVKM GROUP, I am interested in purchasing your natural powder:\n- Product: ${product.name}\n- Packaging Weight: ${activeWeight}\n- Quantity: ${qty}\nCould you please provide bulk wholesale rates and retail delivery details for my pincode?`;
    window.open(`https://wa.me/9014274293?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 page-transition">
      <div onClick={handleClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
      <div className="relative bg-white w-full max-w-4xl rounded-[24px] sm:rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100 animate-slide-up">
        <button onClick={handleClose} className="absolute top-5 right-5 z-20 p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full border border-slate-100 transition-all shadow-sm hover:scale-105 active:scale-95" aria-label="Close modal">
          <i className="fa-solid fa-xmark text-base"></i>
        </button>
 
        <div className="overflow-y-auto p-4 sm:p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Image */}
            <div className="space-y-4">
              <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] sm:rounded-[30px] overflow-hidden aspect-square flex items-center justify-center relative shadow-inner group">
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-md z-10">{product.badge}</span>
                )}
                <img src={imagesList[activeImgIdx]} alt={product.name} className="w-full h-full object-cover animate-[fadeIn_0.3s_ease]" />

                {imagesList.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImgIdx(prev => prev === 0 ? imagesList.length - 1 : prev - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 active:scale-90"
                      aria-label="Previous image"
                    >
                      <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>
                    <button 
                      onClick={() => setActiveImgIdx(prev => prev === imagesList.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 active:scale-90"
                      aria-label="Next image"
                    >
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                  </>
                )}
              </div>

              {imagesList.length > 1 && (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(imagesList.length, 5)}, 1fr)` }}>
                  {imagesList.map((img, idx) => {
                    const isSelected = activeImgIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveImgIdx(idx)}
                        className={`border-2 rounded-xl overflow-hidden aspect-square cursor-pointer transition-all duration-200 hover:scale-105 ${
                          isSelected 
                            ? 'border-primary bg-emerald-50 shadow-md' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-extrabold text-accent tracking-widest uppercase">{product.category}</span>
                <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-darkText mt-1">{product.name}</h3>
                
                <div className="flex items-center space-x-2 mt-2">
                  <StarRating rating={product.rating} />
                  <span className="text-xs font-bold text-darkText">{product.rating}</span>
                  <span className="text-xs text-slate-400 font-semibold">({product.reviewsCount} reviews)</span>
                </div>

                {variation && (
                  <div className="mt-4 flex items-baseline gap-2.5 p-4 bg-slate-50/70 border border-slate-100/50 rounded-[20px] shadow-sm">
                    <span className="text-3xl font-heading font-extrabold text-primary">₹{variation.discountPrice}</span>
                    {savePercent > 0 && (
                      <>
                        <span className="text-sm text-slate-400 line-through font-semibold">M.R.P: ₹{variation.price}</span>
                        <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-2.5 py-1 rounded-lg">Save {savePercent}%</span>
                      </>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-4 leading-relaxed">{product.shortDesc}</p>

                <ul className="mt-5 space-y-2 border-t pt-4 border-slate-100">
                  {product.benefits.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                      <i className="fa-solid fa-circle-check text-accent mt-0.5 text-xs"></i><span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Weight Options */}
                <div className="mt-6">
                  <span className="block text-xs font-extrabold text-darkText mb-2.5">Available Size / Weights:</span>
                  <div className="flex gap-2">
                    {product.variations.map((v, i) => (
                      <label key={i} className="flex-1 cursor-pointer">
                        <input type="radio" name="qv-weight" value={v.weight} checked={activeWeight === v.weight} onChange={() => setSelectedWeight(v.weight)} className="sr-only peer" />
                        <div className="border border-slate-200/80 peer-checked:border-primary peer-checked:bg-emerald-50/60 peer-checked:ring-1 peer-checked:ring-primary rounded-2xl py-3 px-3 text-center transition-all duration-200 shadow-sm hover:border-slate-300">
                          <span className="block text-xs font-extrabold text-darkText">{v.weight}</span>
                          <span className="block text-[10px] text-slate-500 font-bold mt-0.5">₹{v.discountPrice}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-extrabold text-darkText">Select Qty:</span>
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3.5 py-2 text-slate-500 hover:bg-slate-50 transition-colors"><i className="fa-solid fa-minus text-xs"></i></button>
                    <span className="px-4 font-extrabold text-sm text-darkText">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="px-3.5 py-2 text-slate-500 hover:bg-slate-50 transition-colors"><i className="fa-solid fa-plus text-xs"></i></button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-emerald-800 text-white font-bold text-xs py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]">
                  <i className="fa-solid fa-cart-shopping text-xs"></i> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="flex-1 bg-accent hover:bg-accentHover text-white font-bold text-xs py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-accent/10 hover:shadow-accent/25 transition-all duration-300 hover:scale-[1.02]">
                  <i className="fa-solid fa-bolt text-xs"></i> Buy Now
                </button>
                <button onClick={handleWhatsApp} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95" title="WhatsApp Inquiry">
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span className="sm:hidden text-xs">Inquire on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
