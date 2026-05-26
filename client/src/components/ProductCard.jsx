import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  return (
    <div className="star-rating text-sm">
      <div className="star-rating-lower"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
      <div className="star-rating-upper" style={{ width: `${(rating / 5) * 100}%` }}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
    </div>
  );
}

export { StarRating };

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen, setQuickViewProduct } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const defaultVar = product.variations[0];
  if (!defaultVar) return null;

  const wishlisted = isWishlisted(product.id);
  const savePercent = Math.round(((defaultVar.price - defaultVar.discountPrice) / defaultVar.price) * 100);

  const imagesList = (product.images && product.images.length > 0) ? product.images : [product.image];

  const handleBuyNow = () => {
    addToCart(product, defaultVar.weight, 1, true);
    setCartOpen(true);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const waUrl = `https://wa.me/9014274293?text=Hello%20NVKM%20GROUP,%20I%20am%20interested%20in%20purchasing%20your%20natural%20powder:%20${encodeURIComponent(product.name)}%20(${defaultVar.weight}%20size).%20Please%20provide%20rates.`;

  return (
    <div className="product-card glass-premium rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between" data-aos="fade-up">
      <div className="relative product-card-img-container aspect-square bg-slate-50/50 flex items-center justify-center group">
        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="bg-primary text-white text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">{product.badge}</span>
          )}
          {savePercent > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">Save {savePercent}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={() => toggleWishlist(product.id)} className="absolute top-3.5 right-3.5 z-20 w-9 h-9 bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm border border-slate-100 transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Add to Wishlist">
          <i className={`${wishlisted ? 'fa-solid fa-heart text-red-500 animate-[pulse-ring_1.5s_infinite]' : 'fa-regular fa-heart'} text-sm`}></i>
        </button>

        {/* Image */}
        <Link to={`/products/${product.id}`} className="w-full h-full block">
          <img src={imagesList[activeImgIdx]} alt={product.name} className="product-card-img cursor-pointer animate-[fadeIn_0.3s_ease]" />
        </Link>

        {/* Image Navigation Controls */}
        {imagesList.length > 1 && (
          <>
            {/* Left/Right Arrows */}
            <button 
              onClick={handlePrevImage} 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform active:scale-90"
              aria-label="Previous Image"
            >
              <i className="fa-solid fa-chevron-left text-[10px]"></i>
            </button>
            <button 
              onClick={handleNextImage} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform active:scale-90"
              aria-label="Next Image"
            >
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>

            {/* Pagination Dots */}
            <div 
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1 px-2.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md transition-opacity duration-300"
              onClick={e => { e.preventDefault(); e.stopPropagation(); }}
            >
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImgIdx(idx); }}
                  onMouseEnter={() => setActiveImgIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeImgIdx === idx 
                      ? 'w-4 bg-white' 
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(product); }} className="bg-white hover:bg-slate-50 text-primary font-bold text-xs py-3 px-5 rounded-2xl shadow-lg transition-all translate-y-4 group-hover:translate-y-0 duration-300 hover:scale-105 pointer-events-auto">
            <i className="fa-solid fa-eye mr-1.5"></i> Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-extrabold text-accent tracking-widest uppercase">{product.category}</span>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-heading font-extrabold text-base text-darkText mt-1 hover:text-primary cursor-pointer line-clamp-1 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center space-x-1.5 mt-1.5">
            <StarRating rating={product.rating} />
            <span className="text-xs font-bold text-slate-500">{product.rating}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{product.shortDesc}</p>
        </div>

        <div>
          <div className="mt-4 flex items-baseline gap-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100/50">
            <span className="text-lg font-heading font-extrabold text-primary">₹{defaultVar.discountPrice}</span>
            {savePercent > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium">₹{defaultVar.price}</span>
            )}
            <span className="text-[9px] text-slate-500 font-extrabold ml-auto bg-slate-200/50 px-2.5 py-1 rounded-lg">{defaultVar.weight} Pack</span>
          </div>

          <div className="mt-4 space-y-2">
            <button 
              onClick={() => addToCart(product, defaultVar.weight)} 
              className="w-full bg-primary hover:bg-blue-900 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <i className="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleBuyNow} 
                className="bg-accent hover:bg-accentHover text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-accent/10 hover:shadow-accent/25"
              >
                <i className="fa-solid fa-bolt"></i> Buy Now
              </button>
              <a 
                href={waUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-blue-50/60 hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-100 hover:border-transparent font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i> Inquire
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
